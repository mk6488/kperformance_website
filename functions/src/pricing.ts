export type Pricing = {
  inputUsdPer1M: number;
  outputUsdPer1M: number;
};

export const MODEL_PRICING: Record<string, Pricing> = {
  'gpt-4o-mini': { inputUsdPer1M: 0.15, outputUsdPer1M: 0.60 },
};

export function estimateCostUsd(model: string, inputTokens?: number | null, outputTokens?: number | null) {
  const pricing = MODEL_PRICING[model];
  if (!pricing) return null;
  const inT = inputTokens ?? 0;
  const outT = outputTokens ?? 0;
  const cost =
    (inT * (pricing.inputUsdPer1M / 1_000_000)) + (outT * (pricing.outputUsdPer1M / 1_000_000));
  return Math.round(cost * 1e6) / 1e6; // round to micro-dollars for stability
}
