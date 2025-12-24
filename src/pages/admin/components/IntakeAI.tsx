import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { AIReport } from '../IntakeDetail';
import { ReportType } from '../../../lib/aiApi';
import { Dispatch, SetStateAction, useState } from 'react';

type Props = {
  aiAllowed: boolean;
  aiGenerating: string | null;
  aiError: string | null;
  aiSuccess: boolean;
  aiContent: string;
  aiReports: AIReport[];
  selectedReportId: string | null;
  setSelectedReportId: Dispatch<SetStateAction<string | null>>;
  setAiContent: Dispatch<SetStateAction<string>>;
  handleGenerateAI: (type: ReportType) => Promise<void>;
  handleCopyAI: () => Promise<void>;
  addNoteFromAI: () => Promise<void>;
  savingNoteFromAI: boolean;
  updatingStatus: boolean;
  updateStatus: (status: string) => Promise<void>;
  copyMessage: string | null;
};

export function IntakeAI({
  aiAllowed,
  aiGenerating,
  aiError,
  aiSuccess,
  aiContent,
  aiReports,
  selectedReportId,
  setSelectedReportId,
  setAiContent,
  handleGenerateAI,
  handleCopyAI,
  addNoteFromAI,
  savingNoteFromAI,
  updatingStatus,
  updateStatus,
  copyMessage,
}: Props) {
  const [reportType, setReportType] = useState<ReportType>('clinician_summary');

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-brand-navy">AI Assistant</h3>
      <p className="text-sm text-amber-700">AI-assisted draft — clinician review required.</p>
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <select
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            disabled={!!aiGenerating || !aiAllowed}
          >
            <option value="clinician_summary">Clinician summary</option>
            <option value="treatment_plan">Treatment plan (Session 1)</option>
            <option value="followup_questions">Follow-up questions</option>
            <option value="both">Give both (Clinician + Patient)</option>
          </select>
          <Button
            type="button"
            variant="primary"
            className="text-sm"
            disabled={!!aiGenerating || !aiAllowed}
            onClick={() => handleGenerateAI(reportType)}
          >
            {aiGenerating ? 'Generating…' : 'Generate'}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <Button
            type="button"
            variant="secondary"
            className="text-xs"
            disabled={!!aiGenerating || !aiAllowed}
            onClick={() => {
              setReportType('clinician_summary');
              handleGenerateAI('clinician_summary');
            }}
          >
            Quick: Clinician summary
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="text-xs"
            disabled={!!aiGenerating || !aiAllowed}
            onClick={() => {
              setReportType('followup_questions');
              handleGenerateAI('followup_questions');
            }}
          >
            Quick: Follow-up Qs
          </Button>
        </div>
      </div>
      {!aiAllowed ? (
        <p className="text-sm text-amber-700">AI generation is disabled because client AI consent was not provided.</p>
      ) : null}
      {aiError ? <p className="text-sm text-red-600">{aiError}</p> : null}
      {aiSuccess ? <p className="text-sm text-green-700">Generated and saved.</p> : null}
      {aiContent ? (
        <Card className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" onClick={handleCopyAI}>
                Copy
              </Button>
              <Button type="button" variant="secondary" disabled={savingNoteFromAI} onClick={addNoteFromAI}>
                {savingNoteFromAI ? 'Saving…' : 'Save to notes'}
              </Button>
            </div>
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
                  <span className="text-xs text-slate-600">{r.createdAt ? r.createdAt.toLocaleString() : 'pending'}</span>
                </div>
                <p className="text-xs text-slate-600 truncate">{r.content.slice(0, 140)}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
