import { useEffect, useState } from 'react';
import type { Assessment } from '../../assessment/types';
import { listRecentAssessments, createAssessment } from '../../assessment/assessmentApi';
import { emptyAssessment } from '../../assessment/emptyAssessment';
import { adminSignOut } from '../../lib/adminAuth';

function statusLabel(s: Assessment['status']) {
  if (s === 'complete') return { text: 'Complete', cls: 'bg-brand-green/15 text-emerald-800' };
  if (s === 'partialRedFlag') return { text: 'Red flag', cls: 'bg-red-100 text-red-700' };
  return { text: 'Draft', cls: 'bg-amber-100 text-amber-700' };
}

export default function AssessmentHomePage() {
  const [sessions, setSessions] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    listRecentAssessments(20).then(data => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  async function handleNew() {
    setCreating(true);
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
              onClick={handleNew}
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
    </div>
  );
}
