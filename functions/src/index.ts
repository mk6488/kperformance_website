import { initializeApp } from "firebase-admin/app";
import { submitIntake } from "./submitIntake";
import { generateIntakeAIReport } from "./generateIntakeAIReport";

initializeApp();

// Optional safety check at deploy/runtime:
if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set (functions/.env not loaded?)");
}

export { submitIntake, generateIntakeAIReport };
