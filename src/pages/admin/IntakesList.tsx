import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { Section } from '../../components/ui/Section';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import AdminRoute from '../../components/intake/AdminRoute';

type IntakeItem = {
  id: string;
  createdAt?: Date;
  status?: string;
  clientName?: string;
  clientEmail?: string;
  under18?: boolean | null;
};

const statusOptions = ['all', 'submitted', 'reviewed', 'needs_followup', 'archived'];
const PAGE_SIZE = 25;
const FILTER_STORAGE_KEY = 'admin-intakes-filter-v1';
type QuickFilter = 'triage' | 'active' | 'archived' | 'all' | 'custom';

export default function IntakesList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intakes, setIntakes] = useState<IntakeItem[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [under18Only, setUnder18Only] = useState(false);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('triage');

  useEffect(() => {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.quickFilter) setQuickFilter(parsed.quickFilter as QuickFilter);
        if (parsed.status) setStatus(parsed.status as string);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      FILTER_STORAGE_KEY,
      JSON.stringify({
        quickFilter,
        status,
      }),
    );
  }, [quickFilter, status]);

  const effectiveStatuses = useMemo(() => {
    switch (quickFilter) {
      case 'triage':
        return ['submitted', 'needs_followup'];
      case 'active':
        return ['submitted', 'needs_followup', 'reviewed'];
      case 'archived':
        return ['archived'];
      case 'all':
        return [];
      case 'custom':
      default:
        return status === 'all' ? [] : [status];
    }
  }, [quickFilter, status]);

  const fetchPage = async (reset = false) => {
    setError(null);
    if (reset) {
      setLoading(true);
      setLastDoc(null);
    }
    try {
      const db = getFirestore();
      const base = collection(db, 'intakes');
      const filters = [];
      if (effectiveStatuses.length === 1) {
        filters.push(where('status', '==', effectiveStatuses[0]));
      } else if (effectiveStatuses.length > 1) {
        filters.push(where('status', 'in', effectiveStatuses));
      }
      const order = orderBy('createdAt', 'desc');
      let snap;
      try {
        let q = query(base, ...filters, order, limit(PAGE_SIZE));
        if (!reset && lastDoc) {
          q = query(base, ...filters, order, startAfter(lastDoc), limit(PAGE_SIZE));
        }
        snap = await getDocs(q);
      } catch (err: any) {
        // Fallback when composite index is missing for status+createdAt: fetch without status filter and filter client-side.
        let q = query(base, order, limit(PAGE_SIZE));
        if (!reset && lastDoc) {
          q = query(base, order, startAfter(lastDoc), limit(PAGE_SIZE));
        }
        snap = await getDocs(q);
        setError(null); // clear previous error to avoid showing failure message
      }
      const items: IntakeItem[] = [];
      snap.forEach((doc) => {
        const data = doc.data() as any;
        const payload = data.payload || {};
        const client = payload.client || {};
        const createdAt =
          data.createdAt && typeof data.createdAt.toDate === 'function'
            ? data.createdAt.toDate()
            : undefined;
        items.push({
          id: doc.id,
          createdAt,
          status: data.status,
          clientName: client.fullName,
          clientEmail: client.email,
          under18: typeof client.under18 === 'boolean' ? client.under18 : null,
        });
      });
      if (reset) {
        setIntakes(items);
      } else {
        setIntakes((prev) => [...prev, ...items]);
      }
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err: any) {
      setError('Unable to load intakes.');
    } finally {
      if (reset) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickFilter, status]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return intakes.filter((item) => {
      if (effectiveStatuses.length > 0 && (!item.status || !effectiveStatuses.includes(item.status))) return false;
      if (under18Only && item.under18 !== true) return false;
      if (term) {
        const name = item.clientName?.toLowerCase() || '';
        const email = item.clientEmail?.toLowerCase() || '';
        if (!name.includes(term) && !email.includes(term)) return false;
      }
      return true;
    });
  }, [intakes, search, under18Only, effectiveStatuses]);

  const formatDateTime = (d?: Date) => {
    if (!d) return 'Unknown date';
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <AdminRoute>
      <Section id="admin-intakes" variant="muted">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">
          <SectionHeading
            title="Intake submissions"
            subtitle="Admin-only list of submitted intake forms."
            align="left"
          />

          <Card className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                type="search"
                placeholder="Search name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
              />
              <div className="flex flex-wrap gap-3 items-center">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setQuickFilter('custom');
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === 'all' ? 'All statuses' : opt}
                    </option>
                  ))}
                </select>
                <label className="inline-flex items-center gap-2 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    checked={under18Only}
                    onChange={(e) => setUnder18Only(e.target.checked)}
                    className="h-4 w-4 rounded border border-slate-300 text-brand-navy focus:ring-brand-blue"
                  />
                  Under-18 only
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'triage', label: 'Triage (submitted + needs follow-up)' },
                { id: 'active', label: 'All active (incl. reviewed)' },
                { id: 'archived', label: 'Archived' },
                { id: 'all', label: 'All' },
              ].map((f) => (
                <Button
                  key={f.id}
                  type="button"
                  variant={quickFilter === f.id ? 'primary' : 'secondary'}
                  className="text-sm"
                  onClick={() => {
                    setQuickFilter(f.id as QuickFilter);
                    setStatus('all');
                  }}
                >
                  {f.label}
                </Button>
              ))}
            </div>

            {loading ? <p className="text-slate-700">Loading…</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            {!loading && !error ? (
              <div className="space-y-3">
                {filtered.length === 0 ? (
                  <p className="text-sm text-slate-600">No intakes found.</p>
                ) : (
                  filtered.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        window.location.href = `/admin/intakes/${item.id}`;
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm hover:border-brand-blue transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-1">
                          <p className="font-semibold text-brand-charcoal">{item.clientName || 'Unknown name'}</p>
                          <p className="text-sm text-slate-600">{item.clientEmail || 'No email'}</p>
                          <p className="text-xs text-slate-500">{formatDateTime(item.createdAt)}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="inline-flex items-center rounded-full bg-brand-navy/10 text-brand-navy px-3 py-1 text-xs font-semibold">
                            {item.status || 'submitted'}
                          </span>
                          <p className="text-xs text-slate-600">
                            {item.under18 === true
                              ? 'Under 18'
                              : item.under18 === false
                              ? '18+'
                              : 'Under-18: unknown'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <p>Loaded: {filtered.length}</p>
                  {hasMore ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => fetchPage(false)}
                      className="text-sm px-3"
                    >
                      Load more
                    </Button>
                  ) : (
                    <p className="text-xs text-slate-500">No more results</p>
                  )}
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      </Section>
    </AdminRoute>
  );
}

