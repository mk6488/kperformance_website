import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
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
};

type Props = {
  emailKey: string;
};

export default function ClientDetail({ emailKey }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<IntakeItem[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getFirestore();
        const q = query(
          collection(db, 'intakes'),
          where('emailLower', '==', emailKey),
          orderBy('createdAt', 'desc'),
        );
        const snap = await getDocs(q);
        const list: IntakeItem[] = snap.docs.map((d) => {
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
            clientName: client.fullName || 'Unknown name',
            clientEmail: client.email || emailKey,
          };
        });
        setItems(list);
      } catch (err) {
        setError('Unable to load client history.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [emailKey]);

  const first = items[0];

  const formatDate = (d?: Date) => {
    if (!d) return 'Unknown';
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <AdminRoute>
      <Section id="admin-client-detail" variant="muted">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">
          <SectionHeading
            title={first?.clientName || 'Client'}
            subtitle={first?.clientEmail || emailKey}
            align="left"
          />
          <Card className="space-y-3">
            {loading ? <p className="text-slate-700">Loading…</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {!loading && !error ? (
              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-slate-600">No intakes for this client.</p>
                ) : (
                  items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        window.location.href = `/admin/intakes/${item.id}`;
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm hover:border-brand-blue transition-colors"
                    >
                      <div className="flex flex-wrap justify-between gap-2">
                        <div className="space-y-1">
                          <p className="font-semibold text-brand-charcoal">{item.clientName}</p>
                          <p className="text-sm text-slate-600">{first?.clientEmail || emailKey}</p>
                          <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="inline-flex items-center rounded-full bg-brand-navy/10 text-brand-navy px-3 py-1 text-xs font-semibold">
                            {item.status || 'submitted'}
                          </span>
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
