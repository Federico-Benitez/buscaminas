import { describe, it, expect } from 'vitest';
import { Game } from './Game';

describe('Game', () => {
  it('should create a game with correct dimensions', () => {
    const game = Game.create(10, 10, 10, 3);
    expect(game.rows).toBe(10);
    expect(game.cols).toBe(10);
    expect(game.mines).toBe(10);
    expect(game.lives.count).toBe(3);
  });

  it('should place hidden lives', () => {
    // Force a small board with 1 mine and 1 life to ensure placement
    const game = Game.create(2, 2, 0, 3, 4); // 4 hidden lives requested, max 4 cells
    let lifeCount = 0;
    game.forEachCell(cell => {
      if (cell.isLife) lifeCount++;
    });
    expect(lifeCount).toBeGreaterThan(0);
  });

  it('should reveal a safe cell and update score', () => {
    const game = Game.create(5, 5, 0, 3); // No mines
    const newGame = game.revealAt(0, 0);
    expect(newGame.grid[0][0].isRevealed).toBe(true);
    expect(newGame.score.value).toBeGreaterThan(0); // Should get points
  });

  it('should lose a life when hitting a mine', () => {
    // Create a board full of mines
    const game = Game.create(2, 2, 4, 3);
    const newGame = game.revealAt(0, 0);
    expect(newGame.lives.count).toBe(2);
    expect(newGame.gameState).toBe('playing');
  });

  it('should lose game when running out of lives', () => {
    const game = Game.create(2, 2, 4, 1); // 1 life
    const newGame = game.revealAt(0, 0);
    expect(newGame.lives.count).toBe(0);
    expect(newGame.gameState).toBe('lost');
  });

  it('should gain a life when finding a life cell', () => {
    // Mock a game state where we know where the life is
    const game = new Game(2, 2, 0);
    game.lives.reset(1);
    game.grid[0][0].isLife = true;
    
    const newGame = game.revealAt(0, 0);
    expect(newGame.lives.count).toBe(2);
  });

  it('should win game when all safe cells are revealed', () => {
    const game = Game.create(2, 2, 0, 3); // No mines
    // Reveal all cells
    let currentGame = game;
    for(let y=0; y<2; y++) {
        for(let x=0; x<2; x++) {
            currentGame = currentGame.revealAt(x, y);
        }
    }
    expect(currentGame.gameState).toBe('won');
  });
});
