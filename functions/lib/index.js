"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitIntake = void 0;
const app_1 = require("firebase-admin/app");
const https_1 = require("firebase-functions/v2/https");
(0, app_1.initializeApp)();
exports.submitIntake = (0, https_1.onCall)({ region: 'europe-west2' }, async (request) => {
    throw new https_1.HttpsError('unimplemented', 'submitIntake not implemented yet');
});
