import { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { Section } from '../../components/ui/Section';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import AdminRoute from '../../components/intake/AdminRoute';

type Props = {
  intakeId: string;
};

export default function IntakeDetail({ intakeId }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getFirestore();
        const snap = await getDoc(doc(db, 'intakes', intakeId));
        if (snap.exists()) {
          setData(snap.data());
        } else {
          setError('Not found');
        }
      } catch (err: any) {
        setError('Unable to load intake.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [intakeId]);

  return (
    <AdminRoute>
      <Section id="admin-intake-detail" variant="muted">
        <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-4">
          <SectionHeading title="Intake detail" subtitle={intakeId} align="left" />
          <Card className="space-y-3">
            {loading && <p className="text-slate-700">Loading…</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {!loading && !error && (
              <pre className="text-xs bg-slate-50 p-3 rounded border border-slate-200 overflow-auto">
{JSON.stringify(data, null, 2)}
              </pre>
            )}
          </Card>
        </div>
      </Section>
    </AdminRoute>
  );
}
