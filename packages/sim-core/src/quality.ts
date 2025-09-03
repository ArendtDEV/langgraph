/**
 * Compute overall quality score for a project.
 * S, P and H are expected to be normalized between 0 and 1.
 * Weights should sum to 1. The result is returned on a 0-100 scale.
 */
export interface QualityInput {
  script: number; // script quality 0..1
  production: number; // production quality 0..1
  post: number; // post-production quality 0..1
  weights?: {
    script: number;
    production: number;
    post: number;
  };
}

const defaultWeights = {
  script: 0.4,
  production: 0.35,
  post: 0.25,
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function computeQuality(input: QualityInput): number {
  const weights = input.weights ?? defaultWeights;
  const score =
    weights.script * input.script +
    weights.production * input.production +
    weights.post * input.post;
  return clamp01(score) * 100;
}

export { clamp01 };
