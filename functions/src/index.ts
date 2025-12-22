import { initializeApp } from 'firebase-admin/app';
import { submitIntake } from './submitIntake';
import { generateIntakeAIReport } from './generateIntakeAIReport';

initializeApp();

export { submitIntake, generateIntakeAIReport };

