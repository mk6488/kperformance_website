"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODEL_PRICING = void 0;
exports.estimateCostUsd = estimateCostUsd;
exports.MODEL_PRICING = {
    'gpt-4o-mini': { inputUsdPer1M: 0.15, outputUsdPer1M: 0.60 },
};
function estimateCostUsd(model, inputTokens, outputTokens) {
    const pricing = exports.MODEL_PRICING[model];
    if (!pricing)
        return null;
    const inT = inputTokens ?? 0;
    const outT = outputTokens ?? 0;
    const cost = (inT * (pricing.inputUsdPer1M / 1000000)) + (outT * (pricing.outputUsdPer1M / 1000000));
    return Math.round(cost * 1e6) / 1e6; // round to micro-dollars for stability
}
