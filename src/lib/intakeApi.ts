import { signInAnonymously } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from './firebase';
import type { IntakeValues } from '../components/intake/types';

export async function submitIntake(values: IntakeValues): Promise<{ intakeId: string }> {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  const callable = httpsCallable(functions, 'submitIntake');
  const payload = {
    ...values,
    submittedAtClientISO: new Date().toISOString(),
    formVersion: 'intake-v2',
  };

  const result = await callable(payload);
  const data = result.data as any;

  if (!data?.intakeId) {
    throw new Error('No intakeId returned');
  }

  return { intakeId: String(data.intakeId) };
}
