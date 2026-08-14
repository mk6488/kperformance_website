import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export type ReportType = 'clinician_summary' | 'treatment_plan' | 'followup_questions' | 'both';

export async function generateIntakeAIReport(params: { intakeId: string; reportType: ReportType }) {
  const callable = httpsCallable(functions, 'generateIntakeAIReport');
  const res = await callable(params);
  return res.data as any;
}
