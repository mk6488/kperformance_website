import { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  orderBy,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  startAfter,
  limit,
} from 'firebase/firestore';
import { Section } from '../../components/ui/Section';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import AdminRoute from '../../components/intake/AdminRoute';
import { useAuthUser } from '../../lib/adminAuth';
import { generateIntakeAIReport, ReportType } from '../../lib/aiApi';
import { Tabs } from '../../components/ui/Tabs';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
import bodyMapFront from '../../assets/bodyMapFront.png';
import bodyMapBack from '../../assets/bodyMapBack.png';
import bodyMapLeft from '../../assets/bodyMapLeft.png';
import bodyMapRight from '../../assets/bodyMapRight.png';
import { followUpTemplates, fillTemplate } from '../../lib/followUpTemplates';

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

type Note = {
  id: string;
  text: string;
  createdAt?: Date;
  createdByUid?: string;
  createdByEmail?: string | null;
  isLegacy?: boolean;
};

type AuditEvent = {
  id: string;
  type: 'status_change' | 'note_added' | 'reviewed' | string;
  createdAt?: Date;
  actorUid?: string;
  actorEmail?: string | null;
  meta?: Record<string, any>;
};

type AIReport = {
  id: string;
  reportType: string;
  content: string;
  createdAt?: Date;
  model?: string;
  createdByUid?: string;
  createdByEmail?: string | null;
};

const views = [
  { id: 'front', label: 'Front', img: bodyMapFront },
  { id: 'back', label: 'Back', img: bodyMapBack },
  { id: 'left', label: 'Left', img: bodyMapLeft },
  { id: 'right', label: 'Right', img: bodyMapRight },
];

export default function IntakeDetail({ intakeId }: Props) {
  const { user, loading: authLoading } = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IntakeDoc | null>(null);
  const [note, setNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [legacyNotes, setLegacyNotes] = useState<Note[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [aiReports, setAiReports] = useState<AIReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState<string | null>(null);
  const [aiContent, setAiContent] = useState<string>('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [savingNoteFromAI, setSavingNoteFromAI] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);
  const [navLoading, setNavLoading] = useState(false);

  const getByPath = (obj: any, path: string) => {
    if (!obj || !path) return undefined;
    const parts = path.split('.').filter(Boolean);
    let current: any = obj;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  };

  const hasValue = (val: any) => {
    if (val === null || val === undefined) return false;
    if (typeof val === 'string') return val.trim().length > 0;
    if (Array.isArray(val)) return val.length > 0;
    if (val instanceof Date) return true;
    if (typeof val === 'number') return true;
    if (val && typeof val === 'object') return Object.keys(val).length > 0;
    return Boolean(val);
  };

  const getIntakeValueWithMeta = (paths: string[]) => {
    if (!data) return null;
    for (const p of paths) {
      const v = getByPath(data, p);
      if (hasValue(v)) return { value: v, path: p };
    }
    return null;
  };

  const getIntakeValue = (paths: string[]) => getIntakeValueWithMeta(paths)?.value;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setError('Please sign in to view this intake.');
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      setError(null);
      let unsubNotes: (() => void) | null = null;
      let unsubAudit: (() => void) | null = null;
      let unsubAi: (() => void) | null = null;
      try {
        const db = getFirestore();
        const snap = await getDoc(doc(db, 'intakes', intakeId));
        if (snap.exists()) {
          setData(snap.data() as IntakeDoc);
          const legacy = (snap.data() as any).internalNotes || [];
          const parsedLegacy: Note[] = Array.isArray(legacy)
            ? legacy
                .map((n: any, idx: number) => ({
                  id: n.id || `legacy-${idx}`,
                  text: n.text || '',
                  createdByUid: n.createdByUid,
                  createdAt: n.createdAt?.toDate ? n.createdAt.toDate() : undefined,
                  isLegacy: true,
                }))
                .reverse()
            : [];
          setLegacyNotes(parsedLegacy);
          const notesQuery = query(collection(db, 'intakes', intakeId, 'internalNotes'), orderBy('createdAt', 'desc'));
          unsubNotes = onSnapshot(notesQuery, (dbNotes) => {
            const parsed: Note[] = dbNotes.docs.map((d) => {
              const nd = d.data() as any;
              const rawCreated = nd.createdAt;
              const created =
                rawCreated?.toDate?.() ||
                (rawCreated instanceof Date ? rawCreated : rawCreated ? new Date(rawCreated) : undefined);
              return {
                id: d.id,
                text: nd.text || '',
                createdByUid: nd.createdByUid,
                createdByEmail: nd.createdByEmail,
                createdAt: created && !Number.isNaN(created.getTime()) ? created : undefined,
                isLegacy: false,
              };
            });
            const merged = [...parsed, ...parsedLegacy].sort((a, b) => {
              const aTime = a.createdAt ? a.createdAt.getTime() : 0;
              const bTime = b.createdAt ? b.createdAt.getTime() : 0;
              return bTime - aTime;
            });
            setNotes(merged);
          });
          const auditQuery = query(collection(db, 'intakes', intakeId, 'audit'), orderBy('createdAt', 'desc'));
          unsubAudit = onSnapshot(auditQuery, (dbEvents) => {
            const parsed: AuditEvent[] = dbEvents.docs.map((d) => {
              const ad = d.data() as any;
              const rawCreated = ad.createdAt;
              const created =
                rawCreated?.toDate?.() ||
                (rawCreated instanceof Date ? rawCreated : rawCreated ? new Date(rawCreated) : undefined);
              return {
                id: d.id,
                type: ad.type,
                actorUid: ad.actorUid,
                actorEmail: ad.actorEmail,
                meta: ad.meta,
                createdAt: created && !Number.isNaN(created.getTime()) ? created : undefined,
              };
            });
            setAuditEvents(parsed);
          });
          const aiQuery = query(collection(db, 'intakes', intakeId, 'aiReports'), orderBy('createdAt', 'desc'));
          unsubAi = onSnapshot(aiQuery, (dbAi) => {
            const parsed: AIReport[] = dbAi.docs.map((d) => {
              const rd = d.data() as any;
              const rawCreated = rd.createdAt;
              const created =
                rawCreated?.toDate?.() ||
                (rawCreated instanceof Date ? rawCreated : rawCreated ? new Date(rawCreated) : undefined);
              return {
                id: d.id,
                reportType: rd.reportType || 'unknown',
                content: rd.content || '',
                model: rd.model,
                createdByUid: rd.createdByUid,
                createdByEmail: rd.createdByEmail,
                createdAt: created && !Number.isNaN(created.getTime()) ? created : undefined,
              };
            });
            setAiReports(parsed);
            if (!selectedReportId && parsed.length > 0) {
              setSelectedReportId(parsed[0].id);
              setAiContent(parsed[0].content);
            }
          });
          return () => {
            if (unsubNotes) unsubNotes();
            if (unsubAudit) unsubAudit();
            if (unsubAi) unsubAi();
          };
        } else {
          setError('Not found');
        }
      } catch (err: any) {
        if (err?.code === 'permission-denied') {
          setError('Permission denied. Please ensure your admin account has access.');
        } else {
          setError('Unable to load intake.');
        }
      } finally {
        setLoading(false);
      }
    };
    let unsubscribe: (() => void) | null = null;
    load().then((fn) => {
      if (typeof fn === 'function') unsubscribe = fn;
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [intakeId, user, authLoading]);

  useEffect(() => {
    const fetchNeighbors = async () => {
      if (!data?.createdAt?.toDate) {
        setPrevId(null);
        setNextId(null);
        return;
      }
      setNavLoading(true);
      try {
        const db = getFirestore();
        const ts = data.createdAt;
        // Next (older) in desc order
        const nextSnap = await getDocs(
          query(collection(db, 'intakes'), orderBy('createdAt', 'desc'), startAfter(ts), limit(1)),
        );
        const prevSnap = await getDocs(
          query(collection(db, 'intakes'), orderBy('createdAt', 'asc'), startAfter(ts), limit(1)),
        );
        setNextId(nextSnap.docs[0]?.id || null);
        setPrevId(prevSnap.docs[0]?.id || null);
      } catch {
        setPrevId(null);
        setNextId(null);
      } finally {
        setNavLoading(false);
      }
    };
    fetchNeighbors();
  }, [data?.createdAt]);

  const markers = useMemo(() => {
    const raw =
      (getIntakeValue([
        'payload.bodyMap.markers',
        'payload.problem.bodyMap.markers',
        'bodyMap.markers',
        'problem.bodyMap.markers',
      ]) as any) || [];
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

  const client = (getIntakeValue(['payload.client', 'client', 'payload.data.client', 'data.client']) as any) || {};
  const problem =
    (getIntakeValue(['payload.problem', 'problem', 'payload.data.problem', 'data.problem']) as any) || {};
  const medical =
    (getIntakeValue(['payload.medical', 'medical', 'payload.data.medical', 'data.medical']) as any) || {};
  const lifestyle =
    (getIntakeValue(['payload.lifestyle', 'lifestyle', 'payload.data.lifestyle', 'data.lifestyle']) as any) || {};
  const consent =
    (getIntakeValue(['payload.consent', 'consent', 'payload.data.consent', 'data.consent']) as any) || {};
  const submittedAtClientISO = getIntakeValue([
    'payload.submittedAtClientISO',
    'submittedAtClientISO',
    'payload.data.submittedAtClientISO',
    'data.submittedAtClientISO',
  ]);
  const clientEmailLowerRaw = getIntakeValue(['emailLower', 'payload.emailLower', 'payload.client.email']);
  const clientEmailLower =
    typeof clientEmailLowerRaw === 'string' ? clientEmailLowerRaw.toLowerCase() : client.email?.toLowerCase();
  const createdAtRaw = getIntakeValue(['createdAt', 'payload.createdAt', 'data.createdAt']);
  const archivedAtRaw = getIntakeValue(['archivedAt', 'data.archivedAt']);
  const payloadRootMeta = getIntakeValueWithMeta(['payload', 'data']);
  const internalNotes = notes;
  const replacements = {
    name: client.fullName || '',
    email: client.email || '',
  };
  const aiAllowed = !!consent.aiDraftConsent;

  const ageText = useMemo(() => {
    if (!client.dob) return 'DOB not provided';
    const dob = new Date(client.dob);
    if (Number.isNaN(dob.getTime())) return `DOB: ${client.dob}`;
    const diff = Date.now() - dob.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return `${client.dob} (${age} yrs)`;
  }, [client.dob]);

  const formatDate = (d: any) => {
    if (!d) return 'Unknown date';
    if (typeof d === 'string' || typeof d === 'number') {
      const parsed = new Date(d);
      return Number.isNaN(parsed.getTime()) ? String(d) : parsed.toLocaleString();
    }
    if (d.toDate && typeof d.toDate === 'function') return d.toDate().toLocaleString();
    if (d instanceof Date) return d.toLocaleString();
    return String(d);
  };
  const createdAtDisplay = formatDate(createdAtRaw);
  const submittedAtDisplay = formatDate(submittedAtClientISO);

  const shortenUid = (uid?: string) => {
    if (!uid) return 'unknown';
    if (uid.length <= 12) return uid;
    return `${uid.slice(0, 6)}…${uid.slice(-4)}`;
  };

  const copyFollowUp = async (templateId: keyof typeof followUpTemplates) => {
    const t = followUpTemplates[templateId];
    if (!t) return;
    const body = fillTemplate(t.body, replacements);
    const subject = fillTemplate(t.subject, replacements);
    try {
      await navigator.clipboard.writeText(body);
      setCopyMessage(`Copied: ${t.label}`);
      setTimeout(() => setCopyMessage(null), 1500);
    } catch {
      setCopyMessage('Unable to copy');
      setTimeout(() => setCopyMessage(null), 1500);
    }
    if (t.setStatus) {
      updateStatus(t.setStatus);
    }
    return { body, subject };
  };

  const makeMailto = (subject: string, body: string, to?: string) => {
    const params = new URLSearchParams({
      subject,
      body,
    }).toString();
    return `mailto:${to || ''}?${params}`;
  };

  const formatNoteTimestamp = (d?: any) => {
    if (!d) return 'Just now';
    if (d?.toDate && typeof d.toDate === 'function') return d.toDate().toLocaleString();
    if (d instanceof Date) return d.toLocaleString();
    if (typeof d === 'string' || typeof d === 'number') {
      const parsed = new Date(d);
      return Number.isNaN(parsed.getTime()) ? String(d) : parsed.toLocaleString();
    }
    return 'Just now';
  };

  const handleGenerateAI = async (type: ReportType) => {
    if (!intakeId) return;
    setAiError(null);
    setAiGenerating(type);
    setAiSuccess(false);
    try {
      const payload = await generateIntakeAIReport({ intakeId, reportType: type });
      if (payload?.content) {
        setAiContent(payload.content);
        setSelectedReportId(payload.reportId || null);
        setAiSuccess(true);
        setTimeout(() => setAiSuccess(false), 2000);
      } else {
        setAiError('No content returned from AI');
      }
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'permission-denied') setAiError('You do not have permission to generate AI reports.');
      else if (code === 'failed-precondition')
        setAiError(err?.message || 'AI drafting requires client consent or quota is exceeded.');
      else if (code === 'unauthenticated') setAiError('Invalid OpenAI API key.');
      else if (code === 'resource-exhausted') setAiError('Rate limited. Try again in a moment.');
      else setAiError(err?.message || 'Unable to generate AI report. Please try again.');
    } finally {
      setAiGenerating(null);
    }
  };

  const handleCopyAI = async () => {
    if (!aiContent) return;
    await navigator.clipboard.writeText(aiContent);
    setCopyMessage('Copied');
    setTimeout(() => setCopyMessage(null), 1200);
  };

  const addNoteFromAI = async () => {
    if (!user) return;
    setSavingNoteFromAI(true);
    try {
      const db = getFirestore();
      const text =
        selectedReportId && aiReports.find((r) => r.id === selectedReportId)
          ? `AI report saved (id: ${selectedReportId}). Review in AI Assistant panel.`
          : 'AI report saved. Review in AI Assistant panel.';
      const newNote = {
        text,
        createdAt: serverTimestamp(),
        createdByUid: user.uid,
        createdByEmail: (user as any)?.email || null,
      };
      await addDoc(collection(db, 'intakes', intakeId, 'internalNotes'), newNote);
    } catch (err) {
      setError('Unable to save AI report to notes.');
    } finally {
      setSavingNoteFromAI(false);
    }
  };
  const toDate = (d: any) => {
    if (!d) return undefined;
    if (d?.toDate && typeof d.toDate === 'function') return d.toDate();
    if (d instanceof Date) return d;
    if (typeof d === 'string' || typeof d === 'number') {
      const parsed = new Date(d);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return undefined;
  };
  const createdAtDate = toDate(createdAtRaw);
  const PURGE_ENABLED = false;
  const PURGE_CUTOFF_DAYS = 90;
  const canPurge =
    data?.status === 'archived' &&
    createdAtDate &&
    Date.now() - createdAtDate.getTime() > PURGE_CUTOFF_DAYS * 24 * 60 * 60 * 1000 &&
    PURGE_ENABLED;

  const updateStatus = async (status: string) => {
    if (!user) return;
    setUpdatingStatus(true);
    try {
      const db = getFirestore();
      const prevStatus = data?.status || 'submitted';
      await updateDoc(doc(db, 'intakes', intakeId), {
        status,
        reviewedAt: status === 'reviewed' ? serverTimestamp() : null,
        reviewedByUid: status === 'reviewed' ? user.uid : null,
        archivedAt: status === 'archived' ? serverTimestamp() : null,
        archivedByUid: status === 'archived' ? user.uid : null,
      });
      setData((prev) => (prev ? { ...prev, status } : prev));
      await addDoc(collection(db, 'intakes', intakeId, 'audit'), {
        type: 'status_change',
        createdAt: serverTimestamp(),
        actorUid: user.uid,
        actorEmail: user.email || null,
        meta: { fromStatus: prevStatus, toStatus: status },
      });
      if (status === 'reviewed') {
        await addDoc(collection(db, 'intakes', intakeId, 'audit'), {
          type: 'reviewed',
          createdAt: serverTimestamp(),
          actorUid: user.uid,
          actorEmail: user.email || null,
          meta: { fromStatus: prevStatus, toStatus: status },
        });
      }
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
        text: note.trim(),
        createdAt: serverTimestamp(),
        createdByUid: user.uid,
        createdByEmail: user.email || null,
      };
      const noteRef = await addDoc(collection(db, 'intakes', intakeId, 'internalNotes'), newNote);
      await addDoc(collection(db, 'intakes', intakeId, 'audit'), {
        type: 'note_added',
        createdAt: serverTimestamp(),
        actorUid: user.uid,
        actorEmail: user.email || null,
        meta: { noteId: noteRef.id },
      });
      setNote('');
    } catch (err) {
      setError('Unable to add note.');
    } finally {
      setSavingNote(false);
    }
  };

  const summaryLocationText = useMemo(() => {
    if (markers.length === 0) return '—';
    const byView: Record<string, number> = {};
    markers.forEach((m) => {
      byView[m.view] = (byView[m.view] || 0) + 1;
    });
    return views
      .map((v) => (byView[v.id] ? `${v.label}: ${byView[v.id]} marker${byView[v.id] > 1 ? 's' : ''}` : null))
      .filter(Boolean)
      .join(', ');
  }, [markers]);

  return (
    <AdminRoute>
      <Section id="admin-intake-detail" variant="muted">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">
          <SectionHeading title="Intake detail" subtitle={intakeId} align="left" />
          <style>{`
            @media print {
              header, footer, button, .no-print { display: none !important; }
              body { background: white; }
              section { padding: 0 !important; }
              .print-container { background: white !important; box-shadow: none !important; border: none !important; }
              img { break-inside: avoid; }
            }
          `}</style>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={navLoading || !prevId}
              onClick={() => {
                if (prevId) window.location.href = `/admin/intakes/${prevId}`;
              }}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={navLoading || !nextId}
              onClick={() => {
                if (nextId) window.location.href = `/admin/intakes/${nextId}`;
              }}
            >
              Next
            </Button>
            {navLoading ? <p className="text-sm text-slate-600">Loading neighbours…</p> : null}
            <Button
              type="button"
              variant="secondary"
              className="no-print"
              onClick={() => window.print()}
            >
              Print / Save as PDF
            </Button>
          </div>

          <Card className="space-y-3">
            {loading && <p className="text-slate-700">Loading…</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {!loading && !error && data && (
              <div className="space-y-6 text-sm text-slate-800">
                <Card className="space-y-2">
                  <p className="text-base font-semibold text-brand-navy">Quick summary</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs uppercase text-slate-500">Presenting problem</p>
                      <p className="text-sm text-brand-charcoal">{problem.mainConcern || '—'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase text-slate-500">Body map</p>
                      <p className="text-sm text-brand-charcoal">{summaryLocationText || '—'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase text-slate-500">Red flags</p>
                      <p className="text-sm text-brand-charcoal">
                        {(medical.redFlags || []).length > 0 ? (medical.redFlags || []).join(', ') : '—'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase text-slate-500">Consent / Under 18</p>
                      <p className="text-sm text-brand-charcoal">
                        {consent.healthDataConsent ? 'Consent given' : 'Consent missing'} ·{' '}
                        {client.under18 ? 'Under 18' : '18+ or not specified'}
                      </p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-xs uppercase text-slate-500">Contact</p>
                      <p className="text-sm text-brand-charcoal">
                        {client.fullName || '—'} · {client.email || '—'} · {client.phone || '—'}
                      </p>
                      {clientEmailLower ? (
                        <Button
                          type="button"
                          variant="secondary"
                          className="mt-1 text-xs"
                          onClick={() => {
                            window.location.href = `/admin/clients/${encodeURIComponent(clientEmailLower)}`;
                          }}
                        >
                          View client history
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </Card>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-brand-charcoal">{client.fullName || 'Unknown name'}</p>
                    <p>{ageText}</p>
                  </div>
                  <div className="space-y-1">
                    <p>Status: {data.status || 'submitted'}</p>
                    <p>Created: {createdAtDisplay}</p>
                    <p>Reviewed by: {data.reviewedByUid || '—'}</p>
                    {data.status === 'archived' ? (
                      <p className="text-sm text-amber-700">
                        Archived on {formatNoteTimestamp(archivedAtRaw)} by {data.archivedByUid || 'unknown'}
                      </p>
                    ) : null}
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
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={!canPurge}
                    title="Purge is disabled by default; enable the feature flag to allow"
                    onClick={() => {
                      if (!canPurge) return;
                      alert('Purge is disabled by default. Enable PURGE_ENABLED to proceed.');
                    }}
                  >
                    Purge (disabled)
                  </Button>
                </div>

                <div className="space-y-3">
                  <CollapsibleSection title="Main concern" defaultOpen>
                    <p>{problem.mainConcern || 'Not provided'}</p>
                    <p className="text-slate-600">Pain now: {problem.painNow ?? 'Not set'} /10</p>
                    <p>Onset: {problem.onset || 'Not provided'}</p>
                    <p>Location: {problem.locationText || 'Not provided'}</p>
                    <p>Aggravators: {problem.aggravators || 'Not provided'}</p>
                    <p>Helps: {problem.easers || 'Not provided'}</p>
                    <p>Goals: {problem.goals || 'Not provided'}</p>
                  </CollapsibleSection>

                  <CollapsibleSection title="Medical" defaultOpen={false}>
                    <p>Conditions: {medical.conditions || 'Not provided'}</p>
                    <p>Surgeries: {medical.surgeries || 'Not provided'}</p>
                    <p>Medications: {medical.medications || 'Not provided'}</p>
                    <p>Allergies: {medical.allergies || 'Not provided'}</p>
                    <p>Red flags: {(medical.redFlags || []).join(', ') || 'None selected'}</p>
                  </CollapsibleSection>

                  <CollapsibleSection title="Lifestyle" defaultOpen={false}>
                    <p>Activity: {lifestyle.activity || 'Not provided'}</p>
                    <p>Weekly load: {lifestyle.weeklyLoad || 'Not provided'}</p>
                    <p>Sleep hours: {lifestyle.sleepHours || 'Not provided'}</p>
                    <p>Stress: {lifestyle.stressScore ?? 'Not set'} /10</p>
                  </CollapsibleSection>

                  <CollapsibleSection title="Consent" defaultOpen={false}>
                    <p>Health data consent: {consent.healthDataConsent ? 'Given' : 'Not given'}</p>
                    <p>Confirmed truthful: {consent.confirmTruthful ? 'Yes' : 'No'}</p>
                    <p>
                      Contact prefs:{' '}
                      {['email', 'sms', 'phone']
                        .filter((k) => consent.contactPrefs && consent.contactPrefs[k])
                        .join(', ') || 'None'}
                    </p>
                  </CollapsibleSection>

                  <CollapsibleSection title="Body map" defaultOpen>
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
                  </CollapsibleSection>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-brand-navy">Work area</h3>
                  <Tabs
                    defaultTabId="notes"
                    tabs={[
                      {
                        id: 'notes',
                        label: 'Notes',
                        content: (
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
                                {savingNote ? 'Saving…' : 'Add note'}
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {internalNotes.length === 0 ? (
                                <p className="text-sm text-slate-600">No notes yet.</p>
                              ) : (
                                internalNotes.map((n, idx) => (
                                  <div key={n.id || idx} className="rounded border border-slate-200 bg-white px-3 py-2">
                                    <p className="text-sm text-brand-charcoal whitespace-pre-wrap break-words">{n.text}</p>
                                    {n.isLegacy ? (
                                      <p className="text-[11px] uppercase tracking-wide text-amber-700">Legacy note</p>
                                    ) : null}
                                    <p className="text-xs text-slate-500">
                                      By{' '}
                                      {n.createdByUid && user && n.createdByUid === user.uid
                                        ? 'You'
                                        : n.createdByEmail
                                        ? n.createdByEmail
                                        : shortenUid(n.createdByUid)}{' '}
                                      • {formatNoteTimestamp(n.createdAt)}
                                    </p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        ),
                      },
                      {
                        id: 'ai',
                        label: 'AI Assistant',
                        content: (
                          <div className="space-y-3">
                            <h3 className="text-base font-semibold text-brand-navy">AI Assistant</h3>
                            <p className="text-sm text-amber-700">AI-assisted draft — clinician review required.</p>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { id: 'clinician_summary', label: 'Clinician summary' },
                                { id: 'treatment_plan', label: 'Treatment plan' },
                                { id: 'followup_questions', label: 'Follow-up questions' },
                                { id: 'both', label: 'Summary + plan' },
                              ].map((b) => (
                                <Button
                                  key={b.id}
                                  type="button"
                                  variant={aiGenerating === b.id ? 'primary' : 'secondary'}
                                  className="text-sm"
                                  disabled={!!aiGenerating || !aiAllowed}
                                  onClick={() =>
                                    handleGenerateAI(
                                      b.id as 'clinician_summary' | 'treatment_plan' | 'followup_questions' | 'both',
                                    )
                                  }
                                >
                                  {aiGenerating === b.id ? 'Generating…' : b.label}
                                </Button>
                              ))}
                            </div>
                            {!aiAllowed ? (
                              <p className="text-sm text-amber-700">
                                AI generation is disabled because client AI consent was not provided.
                              </p>
                            ) : null}
                            {aiError ? <p className="text-sm text-red-600">{aiError}</p> : null}
                            {aiSuccess ? <p className="text-sm text-green-700">Generated and saved.</p> : null}
                            {aiContent ? (
                              <Card className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Button type="button" variant="secondary" onClick={handleCopyAI}>
                                    Copy
                                  </Button>
                                  <Button type="button" variant="secondary" disabled={savingNoteFromAI} onClick={addNoteFromAI}>
                                    {savingNoteFromAI ? 'Saving…' : 'Save to notes'}
                                  </Button>
                                  {copyMessage ? <span className="text-sm text-green-700">{copyMessage}</span> : null}
                                </div>
                                <pre className="whitespace-pre-wrap text-sm text-slate-800">{aiContent}</pre>
                              </Card>
                            ) : null}
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-brand-charcoal">Saved AI reports</p>
                              {aiReports.length === 0 ? (
                                <p className="text-sm text-slate-600">No AI reports yet.</p>
                              ) : (
                                <div className="space-y-2">
                                  {aiReports.map((r) => (
                                    <button
                                      key={r.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedReportId(r.id);
                                        setAiContent(r.content);
                                      }}
                                      className={`w-full rounded border px-3 py-2 text-left ${
                                        selectedReportId === r.id ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-200 bg-white'
                                      }`}
                                    >
                                      <div className="flex justify-between text-sm text-brand-charcoal">
                                        <span>{r.reportType}</span>
                                        <span className="text-xs text-slate-600">
                                          {r.createdAt ? r.createdAt.toLocaleString() : 'pending'}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-600 truncate">{r.content.slice(0, 140)}</p>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ),
                      },
                      {
                        id: 'followup',
                        label: 'Follow-up',
                        content: (
                          <div className="space-y-3">
                            <h3 className="text-base font-semibold text-brand-navy">Follow-up</h3>
                            <div className="flex flex-wrap gap-2">
                              {(['requestMoreInfo', 'notSuitable', 'readyToBook'] as Array<keyof typeof followUpTemplates>).map(
                                (id) => {
                                  const t = followUpTemplates[id];
                                  const { label } = t;
                                  return (
                                    <Button
                                      key={id}
                                      type="button"
                                      variant="secondary"
                                      className="text-sm"
                                      onClick={async () => {
                                        const filled = await copyFollowUp(id);
                                        if (filled) {
                                          // noop; copyFollowUp handles status and toast
                                        }
                                      }}
                                    >
                                      {label}
                                    </Button>
                                  );
                                },
                              )}
                            </div>
                            {copyMessage ? <p className="text-sm text-green-700">{copyMessage}</p> : null}
                            <p className="text-xs text-slate-600">
                              Templates copy to clipboard; status updates apply automatically when relevant. Optionally open your
                              email client after copying.
                            </p>
                            <div className="grid sm:grid-cols-3 gap-2 text-xs">
                              {(['requestMoreInfo', 'notSuitable', 'readyToBook'] as Array<keyof typeof followUpTemplates>).map(
                                (id) => {
                                  const t = followUpTemplates[id];
                                  const body = fillTemplate(t.body, replacements);
                                  const subject = fillTemplate(t.subject, replacements);
                                  return (
                                    <a
                                      key={`${id}-mailto`}
                                      href={makeMailto(subject, body, client.email)}
                                      className="text-brand-blue hover:underline"
                                    >
                                      Open email: {t.label}
                                    </a>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        ),
                      },
                      {
                        id: 'activity',
                        label: 'Activity',
                        content: (
                          <div className="space-y-2">
                            <h3 className="text-base font-semibold text-brand-navy">Activity</h3>
                            {auditEvents.length === 0 ? (
                              <p className="text-sm text-slate-600">No activity yet.</p>
                            ) : (
                              <div className="space-y-2">
                                {auditEvents.map((ev) => {
                                  const actor =
                                    ev.actorUid && user && ev.actorUid === user.uid
                                      ? 'You'
                                      : ev.actorEmail || shortenUid(ev.actorUid);
                                  const ts = formatNoteTimestamp(ev.createdAt);
                                  let text = '';
                                  if (ev.type === 'status_change') {
                                    const fromStatus = ev.meta?.fromStatus || 'unknown';
                                    const toStatus = ev.meta?.toStatus || 'unknown';
                                    text = `${actor} changed status from ${fromStatus} → ${toStatus}`;
                                  } else if (ev.type === 'note_added') {
                                    text = `${actor} added a note`;
                                  } else if (ev.type === 'reviewed') {
                                    text = `${actor} marked this as reviewed`;
                                  } else {
                                    text = `${actor} did ${ev.type || 'an action'}`;
                                  }
                                  return (
                                    <div key={ev.id} className="rounded border border-slate-200 bg-white px-3 py-2">
                                      <p className="text-sm text-brand-charcoal">{text}</p>
                                      <p className="text-xs text-slate-500">{ts}</p>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      </Section>
    </AdminRoute>
  );
}

