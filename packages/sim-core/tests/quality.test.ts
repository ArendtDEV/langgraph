import { describe, it, expect } from "vitest";
import { computeQuality } from "../src/quality";

describe("computeQuality", () => {
  it("combines components with default weights", () => {
    const q = computeQuality({ script: 0.8, production: 0.6, post: 0.7 });
    expect(q).toBeCloseTo(
      0.4 * 0.8 * 100 + 0.35 * 0.6 * 100 + 0.25 * 0.7 * 100,
    );
  });

  it("clamps result between 0 and 100", () => {
    const q = computeQuality({ script: 2, production: 2, post: 2 });
    expect(q).toBe(100);
    const q2 = computeQuality({ script: -1, production: -1, post: -1 });
    expect(q2).toBe(0);
  });

  it("supports custom weights", () => {
    const q = computeQuality({
      script: 0.5,
      production: 0.5,
      post: 0.5,
      weights: { script: 0.5, production: 0.3, post: 0.2 },
    });
    expect(q).toBeCloseTo(50);
  });

  it("normalizes weights that do not sum to 1", () => {
    const q = computeQuality({
      script: 0.8,
      production: 0.6,
      post: 0.7,
      weights: { script: 1, production: 1, post: 1 },
    });
    const total = 3;
    const expected =
      ((1 / total) * 0.8 + (1 / total) * 0.6 + (1 / total) * 0.7) * 100;
    expect(q).toBeCloseTo(expected);
  });

  it("throws on weights outside [0,1]", () => {
    expect(() =>
      computeQuality({
        script: 0.5,
        production: 0.5,
        post: 0.5,
        weights: { script: -0.1, production: 0.5, post: 0.6 },
      }),
    ).toThrow();
    expect(() =>
      computeQuality({
        script: 0.5,
        production: 0.5,
        post: 0.5,
        weights: { script: 0.5, production: 1.2, post: 0.3 },
      }),
    ).toThrow();
  });

  it("throws when weights sum to 0", () => {
    expect(() =>
      computeQuality({
        script: 0.5,
        production: 0.5,
        post: 0.5,
        weights: { script: 0, production: 0, post: 0 },
      }),
    ).toThrow();
  });
});
