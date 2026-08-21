import { useEffect, useState } from 'react';
import type { Assessment } from '../../assessment/types';
import { listRecentAssessments, createAssessment, loadAssessment } from '../../assessment/assessmentApi';
import { emptyAssessment, emptyRetestAssessment } from '../../assessment/emptyAssessment';
import { adminSignOut } from '../../lib/adminAuth';

function statusLabel(s: Assessment['status']) {
  if (s === 'complete') return { text: 'Complete', cls: 'bg-brand-green/15 text-emerald-800' };
  if (s === 'partialRedFlag') return { text: 'Red flag', cls: 'bg-red-100 text-red-700' };
  return { text: 'Draft', cls: 'bg-amber-100 text-amber-700' };
}

type CreationMode = 'idle' | 'choosingType' | 'choosingPrior';

export default function AssessmentHomePage() {
  const [sessions, setSessions] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [creationMode, setCreationMode] = useState<CreationMode>('idle');

  useEffect(() => {
    listRecentAssessments(20).then(data => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  const completedSessions = sessions.filter(s => s.status === 'complete');

  async function handleNewInitial() {
    setCreating(true);
    setCreationMode('idle');
    try {
      const now = new Date().toISOString();
      const draft = emptyAssessment(now);
      const { id: _id, ...rest } = draft;
      const newId = await createAssessment(rest);
      window.location.href = `/assessment/${newId}`;
    } catch {
      setCreating(false);
    }
  }

  async function handleNewRetest(priorId: string) {
    setCreating(true);
    setCreationMode('idle');
    try {
      const prior = await loadAssessment(priorId);
      if (!prior) { setCreating(false); return; }
      const now = new Date().toISOString();
      const draft = emptyRetestAssessment(now, prior);
      const { id: _id, ...rest } = draft;
      const newId = await createAssessment(rest);
      window.location.href = `/assessment/${newId}`;
    } catch {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-offWhite">
      <header className="bg-white border-b border-[#e9eef5] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-blue.png" alt="K Performance" className="h-8 w-8 object-contain" />
            <span className="font-semibold text-brand-navy text-base">Assessments</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => adminSignOut().finally(() => { window.location.replace('/admin/login'); })}
              className="text-sm font-medium text-brand-slate px-3 py-2 rounded-lg min-h-[44px] hover:bg-slate-100 transition-colors"
            >
              Sign out
            </button>
            <button
              onClick={() => setCreationMode('choosingType')}
              disabled={creating}
              className="bg-brand-navy text-white text-sm font-semibold px-5 py-2.5 rounded-full min-h-[44px] hover:bg-brand-blue transition-colors disabled:opacity-50"
            >
              {creating ? 'Starting…' : '+ New session'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-brand-slate text-sm py-8 text-center">Loading…</p>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e9eef5] shadow-sm p-8 text-center space-y-2">
            <p className="text-brand-charcoal font-medium">No sessions yet</p>
            <p className="text-sm text-brand-slate">Tap "New session" to start your first assessment.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sessions.map(s => {
              const badge = statusLabel(s.status);
              const name = s.athleteSnapshot?.name || 'Unnamed athlete';
              const date = s.sessionMeta?.date || s.createdAt?.slice(0, 10) || '';
              return (
                <li key={s.id}>
                  <a
                    href={`/assessment/${s.id}`}
                    className="block bg-white rounded-xl border border-[#e9eef5] shadow-sm px-4 py-4 hover:border-brand-blue/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-brand-charcoal">{name}</p>
                        <p className="text-sm text-brand-slate mt-0.5">
                          {s.athleteSnapshot?.sport || '—'} · {date}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${badge.cls}`}>
                        {badge.text}
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {/* Session creation modal */}
      {creationMode !== 'idle' && (
        <div className="fixed inset-0 bg-black/40 z-20 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            {creationMode === 'choosingType' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-brand-charcoal">New session</p>
                  <button onClick={() => setCreationMode('idle')} className="text-brand-slate text-xl leading-none px-1">×</button>
                </div>
                <button
                  onClick={handleNewInitial}
                  className="w-full text-left bg-brand-offWhite border border-[#e9eef5] hover:border-brand-blue/40 rounded-xl px-4 py-4 transition-colors"
                >
                  <p className="font-semibold text-brand-charcoal">Initial assessment</p>
                  <p className="text-sm text-brand-slate mt-0.5">Full 9-step battery — new athlete or first session</p>
                </button>
                <button
                  onClick={() => setCreationMode('choosingPrior')}
                  disabled={completedSessions.length === 0}
                  className="w-full text-left bg-brand-offWhite border border-[#e9eef5] hover:border-brand-blue/40 rounded-xl px-4 py-4 transition-colors disabled:opacity-40"
                >
                  <p className="font-semibold text-brand-charcoal">Retest</p>
                  <p className="text-sm text-brand-slate mt-0.5">
                    {completedSessions.length === 0
                      ? 'No completed sessions to retest yet'
                      : 'Pick a prior session to retest'}
                  </p>
                </button>
              </div>
            )}

            {creationMode === 'choosingPrior' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setCreationMode('choosingType')} className="text-brand-slate text-xl leading-none px-1">←</button>
                  <p className="font-semibold text-brand-charcoal">Pick prior session</p>
                </div>
                <p className="text-sm text-brand-slate">Athlete snapshot, conditions protocol, and priority carry-forward will be copied from the selected session.</p>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {completedSessions.map(s => {
                    const name = s.athleteSnapshot?.name || 'Unnamed';
                    const date = s.sessionMeta?.date || s.createdAt?.slice(0, 10) || '';
                    const sport = s.athleteSnapshot?.sport || '—';
                    const isRetest = s.sessionType === 'retest';
                    return (
                      <button
                        key={s.id}
                        onClick={() => handleNewRetest(s.id)}
                        className="w-full text-left bg-brand-offWhite border border-[#e9eef5] hover:border-brand-blue/40 rounded-xl px-4 py-3 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-brand-charcoal text-sm">{name}</p>
                            <p className="text-xs text-brand-slate">{sport} · {date}</p>
                          </div>
                          {isRetest && (
                            <span className="text-[10px] font-semibold bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full flex-shrink-0">Retest</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
