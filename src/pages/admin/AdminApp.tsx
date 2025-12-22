import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { Section } from '../../components/ui/Section';
import { Card } from '../../components/ui/Card';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Button } from '../../components/ui/Button';
import AdminRoute from '../../components/intake/AdminRoute';
import { adminSignOut } from '../../lib/adminAuth';

type IntakeItem = {
  id: string;
  status?: string;
  clientName?: string;
  createdAt?: Date;
};

export default function AdminApp() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<IntakeItem[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getFirestore();
        const snap = await getDocs(collection(db, 'intakes'));
        const list: IntakeItem[] = [];
        snap.forEach((doc) => {
          const data = doc.data() as any;
          const payload = data.payload || {};
          const createdAt =
            data.createdAt && typeof data.createdAt.toDate === 'function'
              ? data.createdAt.toDate()
              : undefined;
          list.push({
            id: doc.id,
            status: data.status || 'submitted',
            clientName: payload.client?.fullName || 'Unknown',
            createdAt,
          });
        });
        // Sort descending by createdAt
        list.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        setItems(list);
      } catch (err) {
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const counts = useMemo(() => {
    const c = {
      submitted: 0,
      needs_followup: 0,
      reviewed: 0,
      archived: 0,
    };
    items.forEach((i) => {
      if (i.status === 'needs_followup') c.needs_followup += 1;
      else if (i.status === 'reviewed') c.reviewed += 1;
      else if (i.status === 'archived') c.archived += 1;
      else c.submitted += 1;
    });
    return c;
  }, [items]);

  const recent = useMemo(() => items.slice(0, 5), [items]);

  const formatDateTime = (d?: Date) => {
    if (!d) return 'Unknown';
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <AdminRoute>
      <Section id="admin" variant="muted">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeading title="Admin dashboard" subtitle="Overview of intake submissions" align="left" />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                adminSignOut().finally(() => {
                  window.location.href = '/admin/login';
                });
              }}
            >
              Sign out
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <p className="text-sm text-slate-600">Submitted</p>
              <p className="text-2xl font-semibold text-brand-navy">{counts.submitted}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-600">Needs follow-up</p>
              <p className="text-2xl font-semibold text-brand-navy">{counts.needs_followup}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-600">Reviewed</p>
              <p className="text-2xl font-semibold text-brand-navy">{counts.reviewed}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-600">Archived</p>
              <p className="text-2xl font-semibold text-brand-navy">{counts.archived}</p>
            </Card>
          </div>

          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-brand-charcoal">Recent intakes</p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  window.location.href = '/admin/intakes';
                }}
              >
                View all intakes
              </Button>
            </div>
            {loading && <p className="text-slate-700">Loading…</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {!loading && !error ? (
              <div className="space-y-2">
                {recent.length === 0 ? (
                  <p className="text-sm text-slate-600">No submissions yet.</p>
                ) : (
                  recent.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        window.location.href = `/admin/intakes/${item.id}`;
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm hover:border-brand-blue transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-brand-charcoal">{item.clientName}</p>
                          <p className="text-xs text-slate-600">{formatDateTime(item.createdAt)}</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-brand-navy/10 text-brand-navy px-3 py-1 text-xs font-semibold">
                          {item.status || 'submitted'}
                        </span>
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

