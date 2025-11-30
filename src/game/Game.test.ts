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

  describe('Flood Fill (Auto-reveal adjacent cells)', () => {
    it('should reveal all adjacent cells when clicking an empty cell (0 neighbors)', () => {
      // Create a 3x3 board with no mines
      const game = Game.create(3, 3, 0, 3);
      
      // Click the center cell
      const newGame = game.revealAt(1, 1);
      
      // All 9 cells should be revealed (flood fill)
      let revealedCount = 0;
      newGame.forEachCell(cell => {
        if (cell.isRevealed) revealedCount++;
      });
      
      expect(revealedCount).toBe(9);
    });

    it('should stop flood fill at cells with neighbor mines', () => {
      // Create a custom board: mine at (2,2), click at (0,0)
      const game = new Game(3, 3, 1);
      game.lives.reset(3);
      
      // Place mine at bottom-right corner
      game.grid[2][2].setMine();
      
      // Recalculate neighbor counts
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          if (!game.grid[y][x].isMine) {
            const count = game.countNeighbors(x, y);
            game.grid[y][x].setNeighborCount(count);
          }
        }
      }
      
      // Click top-left corner (0,0) - should flood fill but stop at cells near mine
      const newGame = game.revealAt(0, 0);
      
      // Cells (0,0), (0,1), (1,0), (1,1) should be revealed (no neighbors)
      expect(newGame.grid[0][0].isRevealed).toBe(true);
      expect(newGame.grid[0][1].isRevealed).toBe(true);
      expect(newGame.grid[1][0].isRevealed).toBe(true);
      expect(newGame.grid[1][1].isRevealed).toBe(true);
      
      // Cells near the mine should also be revealed (they have neighbor counts)
      expect(newGame.grid[1][2].isRevealed).toBe(true);
      expect(newGame.grid[2][1].isRevealed).toBe(true);
      
      // The mine itself should NOT be revealed
      expect(newGame.grid[2][2].isRevealed).toBe(false);
    });

    it('should not flood fill through flagged cells', () => {
      const game = Game.create(3, 3, 0, 3);
      
      // Flag the center cell
      const flaggedGame = game.toggleFlagAt(1, 1);
      
      // Click a corner
      const newGame = flaggedGame.revealAt(0, 0);
      
      // The flagged cell should NOT be revealed
      expect(newGame.grid[1][1].isRevealed).toBe(false);
      expect(newGame.grid[1][1].isFlagged).toBe(true);
    });

    it('should reveal all cells in a large empty area', () => {
      // Create a 5x5 board with no mines
      const game = Game.create(5, 5, 0, 3);
      
      // Click any cell
      const newGame = game.revealAt(2, 2);
      
      // All 25 cells should be revealed
      let revealedCount = 0;
      newGame.forEachCell(cell => {
        if (cell.isRevealed) revealedCount++;
      });
      
      expect(revealedCount).toBe(25);
    });

    it('should handle flood fill with life cells correctly', () => {
      const game = new Game(3, 3, 0);
      game.lives.reset(1);
      
      // Place a life cell
      game.grid[1][1].isLife = true;
      
      // Click a corner - should flood fill and collect the life
      const newGame = game.revealAt(0, 0);
      
      // All cells should be revealed
      let revealedCount = 0;
      newGame.forEachCell(cell => {
        if (cell.isRevealed) revealedCount++;
      });
      expect(revealedCount).toBe(9);
      
      // Should have gained a life
      expect(newGame.lives.count).toBe(2);
    });
  });
});
