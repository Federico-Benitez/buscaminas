import { describe, it, expect } from 'vitest';
import { Lives } from './Lives';

describe('Lives', () => {
  it('should initialize with correct count and maxLives', () => {
    const lives = new Lives(3);
    expect(lives.count).toBe(3);
    expect(lives.maxLives).toBe(3);
  });

  it('should lose a life', () => {
    const lives = new Lives(3);
    lives.loseLife();
    expect(lives.count).toBe(2);
  });

  it('should not lose life if count is 0', () => {
    const lives = new Lives(0);
    lives.loseLife();
    expect(lives.count).toBe(0);
  });

  it('should gain a life', () => {
    const lives = new Lives(3);
    lives.gainLife();
    expect(lives.count).toBe(4);
  });

  it('should check if empty', () => {
    const lives = new Lives(1);
    expect(lives.isEmpty()).toBe(false);
    lives.loseLife();
    expect(lives.isEmpty()).toBe(true);
  });

  it('should reset lives', () => {
    const lives = new Lives(3);
    lives.loseLife();
    lives.reset(5);
    expect(lives.count).toBe(5);
    expect(lives.maxLives).toBe(5);
  });

  it('should clone correctly', () => {
    const lives = new Lives(3);
    lives.loseLife();
    const clone = lives.clone();
    expect(clone.count).toBe(2);
    expect(clone.maxLives).toBe(3);
    expect(clone).not.toBe(lives);
  });
});
