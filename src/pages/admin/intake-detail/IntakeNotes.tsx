import { Button } from '../../../components/ui/Button';

type Props = {
  note: string;
  setNote: (v: string) => void;
  savingNote: boolean;
  addNote: () => void;
  internalNotes: Array<{
    id?: string;
    text: string;
    createdAt?: Date;
    createdByUid?: string;
    createdByEmail?: string | null;
    isLegacy?: boolean;
  }>;
  user: any;
  shortenUid: (uid?: string) => string;
  formatNoteTimestamp: (d?: any) => string;
};

export function IntakeNotes({
  note,
  setNote,
  savingNote,
  addNote,
  internalNotes,
  user,
  shortenUid,
  formatNoteTimestamp,
}: Props) {
  return (
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
              {n.isLegacy ? <p className="text-[11px] uppercase tracking-wide text-amber-700">Legacy note</p> : null}
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
  );
}
