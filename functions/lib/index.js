"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIntakeAIReport = exports.submitIntake = void 0;
const app_1 = require("firebase-admin/app");
const submitIntake_1 = require("./submitIntake");
Object.defineProperty(exports, "submitIntake", { enumerable: true, get: function () { return submitIntake_1.submitIntake; } });
const generateIntakeAIReport_1 = require("./generateIntakeAIReport");
Object.defineProperty(exports, "generateIntakeAIReport", { enumerable: true, get: function () { return generateIntakeAIReport_1.generateIntakeAIReport; } });
(0, app_1.initializeApp)();
// Optional safety check at deploy/runtime:
if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is not set (functions/.env not loaded?)");
}
