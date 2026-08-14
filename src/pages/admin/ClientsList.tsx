import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Section } from '../../components/ui/Section';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import AdminRoute from '../../components/intake/AdminRoute';

type IntakeDoc = {
  id: string;
  createdAt?: Date;
  status?: string;
  clientName?: string;
  clientEmailLower?: string;
  clientEmail?: string;
};

type ClientGroup = {
  emailLower: string;
  displayName: string;
  email: string;
  count: number;
  lastIntakeAt?: Date;
  latestStatus?: string;
};

const PAGE_SIZE = 200;

export default function ClientsList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intakes, setIntakes] = useState<IntakeDoc[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [search, setSearch] = useState('');

  const fetchPage = async (reset = false) => {
    setError(null);
    if (reset) setLoading(true);
    try {
      const db = getFirestore();
      const base = collection(db, 'intakes');
      let q = query(base, orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
      if (!reset && lastDoc) {
        q = query(base, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE));
      }
      const snap = await getDocs(q);
      const items: IntakeDoc[] = snap.docs.map((d) => {
        const data = d.data() as any;
        const payload = data.payload || {};
        const client = payload.client || {};
        const createdAt =
          data.createdAt && typeof data.createdAt.toDate === 'function'
            ? data.createdAt.toDate()
            : undefined;
        return {
          id: d.id,
          createdAt,
          status: data.status,
          clientName: client.fullName,
          clientEmailLower: data.emailLower || (client.email ? client.email.toLowerCase() : undefined),
          clientEmail: client.email,
        };
      });
      if (reset) {
        setIntakes(items);
      } else {
        setIntakes((prev) => [...prev, ...items]);
      }
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err) {
      setError('Unable to load clients.');
    } finally {
      if (reset) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(true);
  }, []);

  const groups: ClientGroup[] = useMemo(() => {
    const map = new Map<string, ClientGroup>();
    intakes.forEach((i) => {
      const email = i.clientEmailLower || '';
      if (!email) return;
      const existing = map.get(email);
      if (!existing) {
        map.set(email, {
          emailLower: email,
          email: i.clientEmail || email,
          displayName: i.clientName || 'Unknown name',
          count: 1,
          lastIntakeAt: i.createdAt,
          latestStatus: i.status,
        });
      } else {
        existing.count += 1;
        if (!existing.lastIntakeAt || (i.createdAt && i.createdAt > existing.lastIntakeAt)) {
          existing.lastIntakeAt = i.createdAt;
          existing.displayName = i.clientName || existing.displayName;
          existing.latestStatus = i.status || existing.latestStatus;
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      const aTime = a.lastIntakeAt ? a.lastIntakeAt.getTime() : 0;
      const bTime = b.lastIntakeAt ? b.lastIntakeAt.getTime() : 0;
      return bTime - aTime;
    });
  }, [intakes]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return groups;
    return groups.filter((g) => {
      return g.displayName.toLowerCase().includes(term) || g.email.toLowerCase().includes(term);
    });
  }, [groups, search]);

  const formatDate = (d?: Date) => {
    if (!d) return 'Unknown';
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <AdminRoute>
      <Section id="admin-clients" variant="muted">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">
          <SectionHeading title="Clients" subtitle="Grouped by email" align="left" />

          <Card className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                type="search"
                placeholder="Search name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
              />
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <p>Total clients: {groups.length}</p>
                {hasMore ? (
                  <Button type="button" variant="secondary" onClick={() => fetchPage(false)} className="text-sm px-3">
                    Load more
                  </Button>
                ) : null}
              </div>
            </div>

            {loading ? <p className="text-slate-700">Loading…</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            {!loading && !error ? (
              <div className="space-y-3">
                {filtered.length === 0 ? (
                  <p className="text-sm text-slate-600">No clients found.</p>
                ) : (
                  filtered.map((c) => (
                    <button
                      key={c.emailLower}
                      type="button"
                      onClick={() => {
                        window.location.href = `/admin/clients/${encodeURIComponent(c.emailLower)}`;
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm hover:border-brand-blue transition-colors"
                    >
                      <div className="flex flex-wrap justify-between gap-2">
                        <div className="space-y-1">
                          <p className="font-semibold text-brand-charcoal">{c.displayName}</p>
                          <p className="text-sm text-slate-600">{c.email}</p>
                          <p className="text-xs text-slate-500">Last intake: {formatDate(c.lastIntakeAt)}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="inline-flex items-center rounded-full bg-brand-navy/10 text-brand-navy px-3 py-1 text-xs font-semibold">
                            {c.latestStatus || 'submitted'}
                          </span>
                          <p className="text-xs text-slate-600">Intakes: {c.count}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </Card>
        </div>
      </Section>
    </AdminRoute>
  );
}

