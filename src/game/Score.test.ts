import { describe, it, expect } from 'vitest';
import { Score } from './Score';

describe('Score', () => {
  it('should initialize with 0', () => {
    const score = new Score();
    expect(score.value).toBe(0);
  });

  it('should add points', () => {
    const score = new Score();
    score.add(10);
    expect(score.value).toBe(10);
    score.add(5);
    expect(score.value).toBe(15);
  });

  it('should reset score', () => {
    const score = new Score(100);
    score.reset();
    expect(score.value).toBe(0);
  });

  it('should clone correctly', () => {
    const score = new Score(50);
    const clone = score.clone();
    expect(clone.value).toBe(50);
    expect(clone).not.toBe(score);
  });

  describe('subtract', () => {
    it('should subtract points normally', () => {
      const score = new Score(100);
      score.subtract(30);
      expect(score.value).toBe(70);
    });

    it('should prevent negative scores', () => {
      const score = new Score(20);
      score.subtract(50);
      expect(score.value).toBe(0);
    });

    it('should handle exact subtraction to zero', () => {
      const score = new Score(50);
      score.subtract(50);
      expect(score.value).toBe(0);
    });

    it('should handle multiple add and subtract operations', () => {
      const score = new Score();
      score.add(100);
      score.subtract(30);
      score.add(50);
      score.subtract(20);
      expect(score.value).toBe(100);
    });
  });
});
