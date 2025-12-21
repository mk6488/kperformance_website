import { useEffect, useMemo, useState } from 'react';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { Section } from '../../components/ui/Section';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import AdminRoute from '../../components/intake/AdminRoute';
import { useAuthUser } from '../../lib/adminAuth';
import bodyMapFront from '../../assets/bodyMapFront.png';
import bodyMapBack from '../../assets/bodyMapBack.png';
import bodyMapLeft from '../../assets/bodyMapLeft.png';
import bodyMapRight from '../../assets/bodyMapRight.png';

type Props = {
  intakeId: string;
};

type IntakeDoc = {
  client?: any;
  problem?: any;
  medical?: any;
  lifestyle?: any;
  bodyMap?: any;
  consent?: any;
  status?: string;
  createdAt?: any;
  internalNotes?: any[];
  reviewedAt?: any;
  reviewedByUid?: string;
};

const views = [
  { id: 'front', label: 'Front', img: bodyMapFront },
  { id: 'back', label: 'Back', img: bodyMapBack },
  { id: 'left', label: 'Left', img: bodyMapLeft },
  { id: 'right', label: 'Right', img: bodyMapRight },
];

export default function IntakeDetail({ intakeId }: Props) {
  const { user } = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IntakeDoc | null>(null);
  const [note, setNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getFirestore();
        const snap = await getDoc(doc(db, 'intakes', intakeId));
        if (snap.exists()) {
          setData(snap.data() as IntakeDoc);
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

  const markers = useMemo(() => {
    const raw = data?.bodyMap?.markers;
    return Array.isArray(raw)
      ? raw.filter(
          (m) =>
            m &&
            ['front', 'back', 'left', 'right'].includes(m.view) &&
            typeof m.x === 'number' &&
            typeof m.y === 'number',
        )
      : [];
  }, [data]);

  const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : undefined;
  const client = data?.client || {};
  const problem = data?.problem || {};
  const medical = data?.medical || {};
  const lifestyle = data?.lifestyle || {};
  const consent = data?.consent || {};
  const internalNotes = Array.isArray(data?.internalNotes) ? [...data!.internalNotes].reverse() : [];

  const ageText = useMemo(() => {
    if (!client.dob) return 'DOB not provided';
    const dob = new Date(client.dob);
    if (Number.isNaN(dob.getTime())) return `DOB: ${client.dob}`;
    const diff = Date.now() - dob.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return `${client.dob} (${age} yrs)`;
  }, [client.dob]);

  const formatDate = (d?: Date) => (d ? d.toLocaleString() : 'Unknown date');

  const updateStatus = async (status: string) => {
    if (!user) return;
    setUpdatingStatus(true);
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'intakes', intakeId), {
        status,
        reviewedAt: status === 'reviewed' ? serverTimestamp() : null,
        reviewedByUid: status === 'reviewed' ? user.uid : null,
      });
      setData((prev) => (prev ? { ...prev, status } : prev));
    } catch (err) {
      setError('Unable to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const addNote = async () => {
    if (!note.trim() || !user) return;
    setSavingNote(true);
    try {
      const db = getFirestore();
      const newNote = {
        id: `${Date.now()}`,
        text: note.trim(),
        createdAt: serverTimestamp(),
        createdByUid: user.uid,
      };
      await updateDoc(doc(db, 'intakes', intakeId), {
        internalNotes: arrayUnion(newNote),
      });
      setNote('');
      setData((prev) =>
        prev
          ? {
              ...prev,
              internalNotes: [...(prev.internalNotes || []), { ...newNote, createdAt: new Date() }],
            }
          : prev,
      );
    } catch (err) {
      setError('Unable to add note.');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <AdminRoute>
      <Section id="admin-intake-detail" variant="muted">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">
          <SectionHeading title="Intake detail" subtitle={intakeId} align="left" />

          <Card className="space-y-3">
            {loading && <p className="text-slate-700">Loading…</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {!loading && !error && data && (
              <div className="space-y-6 text-sm text-slate-800">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-brand-charcoal">{client.fullName || 'Unknown name'}</p>
                    <p>{client.email || 'No email'}</p>
                    <p>{client.phone || 'No phone'}</p>
                    <p>{ageText}</p>
                  </div>
                  <div className="space-y-1">
                    <p>Status: {data.status || 'submitted'}</p>
                    <p>Created: {formatDate(createdAt)}</p>
                    <p>Reviewed by: {data.reviewedByUid || '—'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" disabled={updatingStatus} onClick={() => updateStatus('reviewed')}>
                    Mark reviewed
                  </Button>
                  <Button type="button" variant="secondary" disabled={updatingStatus} onClick={() => updateStatus('needs_followup')}>
                    Needs follow-up
                  </Button>
                  <Button type="button" variant="secondary" disabled={updatingStatus} onClick={() => updateStatus('archived')}>
                    Archive
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-brand-navy">Main concern</h3>
                  <p>{problem.mainConcern || 'Not provided'}</p>
                  <p className="text-slate-600">Pain now: {problem.painNow ?? 'Not set'} /10</p>
                  <p>Onset: {problem.onset || 'Not provided'}</p>
                  <p>Location: {problem.locationText || 'Not provided'}</p>
                  <p>Aggravators: {problem.aggravators || 'Not provided'}</p>
                  <p>Helps: {problem.easers || 'Not provided'}</p>
                  <p>Goals: {problem.goals || 'Not provided'}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-brand-navy">Medical</h3>
                  <p>Conditions: {medical.conditions || 'Not provided'}</p>
                  <p>Surgeries: {medical.surgeries || 'Not provided'}</p>
                  <p>Medications: {medical.medications || 'Not provided'}</p>
                  <p>Allergies: {medical.allergies || 'Not provided'}</p>
                  <p>Red flags: {(medical.redFlags || []).join(', ') || 'None selected'}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-brand-navy">Lifestyle</h3>
                  <p>Activity: {lifestyle.activity || 'Not provided'}</p>
                  <p>Weekly load: {lifestyle.weeklyLoad || 'Not provided'}</p>
                  <p>Sleep hours: {lifestyle.sleepHours || 'Not provided'}</p>
                  <p>Stress: {lifestyle.stressScore ?? 'Not set'} /10</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-brand-navy">Consent</h3>
                  <p>Health data consent: {consent.healthDataConsent ? 'Given' : 'Not given'}</p>
                  <p>Confirmed truthful: {consent.confirmTruthful ? 'Yes' : 'No'}</p>
                  <p>
                    Contact prefs:{' '}
                    {['email', 'sms', 'phone']
                      .filter((k) => consent.contactPrefs && consent.contactPrefs[k])
                      .join(', ') || 'None'}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-brand-navy">Body map</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {views.map((v) => (
                      <div key={v.id} className="border border-slate-200 rounded-lg bg-white p-3">
                        <p className="text-sm font-semibold text-brand-charcoal mb-2">{v.label}</p>
                        <div className="relative">
                          <img src={v.img} alt={`${v.label} view`} className="w-full h-auto select-none" />
                          {markers
                            .filter((m) => m.view === v.id)
                            .map((m, idx) => (
                              <span
                                key={`${v.id}-${idx}`}
                                className="absolute -translate-x-1/2 -translate-y-1/2 block h-3 w-3 rounded-full bg-brand-navy shadow"
                                style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
                              />
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-brand-navy">Internal notes</h3>
                  <div className="space-y-2">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
                      placeholder="Add a note (visible to admins only)"
                    />
                    <Button type="button" onClick={addNote} disabled={savingNote || !note.trim()}>
                      {savingNote ? 'Adding…' : 'Add note'}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {internalNotes.length === 0 ? (
                      <p className="text-sm text-slate-600">No notes yet.</p>
                    ) : (
                      internalNotes.map((n, idx) => (
                        <div key={n.id || idx} className="rounded border border-slate-200 bg-white px-3 py-2">
                          <p className="text-sm text-brand-charcoal">{n.text}</p>
                          <p className="text-xs text-slate-500">
                            By {n.createdByUid || 'unknown'} •{' '}
                            {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString() : 'pending'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </Section>
    </AdminRoute>
  );
}
