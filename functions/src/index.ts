import { initializeApp } from 'firebase-admin/app';
import { submitIntake } from './submitIntake';
import { generateIntakeAIReport } from './generateIntakeAIReport';

// Load OPENAI_API_KEY from runtime config if not already set
const openaiKeyFromConfig = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const functions = require('firebase-functions') as any;
    return functions?.config?.().openai?.key as string | undefined;
  } catch {
    return undefined;
  }
})();

process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || openaiKeyFromConfig;

initializeApp();

export { submitIntake, generateIntakeAIReport };

