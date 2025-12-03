import { describe, it, expect } from 'vitest';
import { Game } from './Game';

describe('Game Scoring System', () => {
  describe('Flagging mines', () => {
    it('should award +100 points for correctly flagging a mine (first time)', () => {
      const game = Game.create(5, 5, 1, 3, 0);
      
      // Find the mine
      let mineX = 0, mineY = 0;
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          if (game.grid[y][x].isMine) {
            mineX = x;
            mineY = y;
            break;
          }
        }
      }
      
      const initialScore = game.score.value;
      const newGame = game.toggleFlagAt(mineX, mineY);
      
      expect(newGame.score.value).toBe(initialScore + 100);
      expect(newGame.grid[mineY][mineX].isFlagged).toBe(true);
      expect(newGame.grid[mineY][mineX].correctlyFlaggedBefore).toBe(true);
    });

    it('should NOT award points for flagging a mine the second time', () => {
      const game = Game.create(5, 5, 1, 3, 0);
      
      // Find the mine
      let mineX = 0, mineY = 0;
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          if (game.grid[y][x].isMine) {
            mineX = x;
            mineY = y;
            break;
          }
        }
      }
      
      // Flag it once
      const game2 = game.toggleFlagAt(mineX, mineY);
      const scoreAfterFirstFlag = game2.score.value;
      
      // Unflag it
      const game3 = game2.toggleFlagAt(mineX, mineY);
      
      // Flag it again
      const game4 = game3.toggleFlagAt(mineX, mineY);
      
      // Score should remain the same (no additional +100)
      expect(game4.score.value).toBe(scoreAfterFirstFlag);
    });

    it('should NOT award points for flagging a non-mine cell', () => {
      const game = Game.create(5, 5, 1, 3, 0);
      
      // Find a non-mine cell
      let safeX = 0, safeY = 0;
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          if (!game.grid[y][x].isMine) {
            safeX = x;
            safeY = y;
            break;
          }
        }
      }
      
      const initialScore = game.score.value;
      const newGame = game.toggleFlagAt(safeX, safeY);
      
      expect(newGame.score.value).toBe(initialScore);
    });
  });

  describe('Revealing cells', () => {
    it('should award +15 points for revealing a single safe cell', () => {
      const game = Game.create(5, 5, 1, 3, 0);
      
      // Find a non-mine cell with neighbors (not empty region)
      let safeX = 0, safeY = 0;
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          const cell = game.grid[y][x];
          if (!cell.isMine && cell.neighborMines > 0) {
            safeX = x;
            safeY = y;
            break;
          }
        }
      }
      
      const initialScore = game.score.value;
      const newGame = game.revealAt(safeX, safeY);
      
      expect(newGame.score.value).toBe(initialScore + 15);
    });

    it('should award +15 points per cell in empty region', () => {
      // Create a game with mines in corners to ensure we have an empty region
      const game = new Game(5, 5, 4);
      game.lives.gainLife();
      game.lives.gainLife();
      game.lives.gainLife();
      
      // Manually place mines in corners
      game.grid[0][0].setMine();
      game.grid[0][4].setMine();
      game.grid[4][0].setMine();
      game.grid[4][4].setMine();
      
      // Count neighbors
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          const cell = game.grid[y][x];
          if (!cell.isMine) {
            const count = game.countNeighbors(x, y);
            cell.setNeighborCount(count);
          }
        }
      }
      
      const initialScore = game.score.value;
      // Click on center cell (should have 0 neighbors and trigger flood fill)
      const newGame = game.revealAt(2, 2);
      
      // Count revealed cells
      let revealedCount = 0;
      newGame.forEachCell(cell => {
        if (cell.isRevealed && !cell.isMine) revealedCount++;
      });
      
      expect(newGame.score.value).toBe(initialScore + (revealedCount * 15));
      expect(revealedCount).toBeGreaterThan(1);
    });

    it('should deduct -50 points when detonating a mine', () => {
      const game = Game.create(5, 5, 1, 3, 0);
      
      // Find the mine
      let mineX = 0, mineY = 0;
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          if (game.grid[y][x].isMine) {
            mineX = x;
            mineY = y;
            break;
          }
        }
      }
      
      const initialScore = game.score.value;
      const newGame = game.revealAt(mineX, mineY);
      
      expect(newGame.score.value).toBe(Math.max(0, initialScore - 50));
    });

    it('should never have negative score after detonating mine', () => {
      const game = Game.create(5, 5, 1, 3, 0);
      // Score starts at 0
      expect(game.score.value).toBe(0);
      
      // Find the mine
      let mineX = 0, mineY = 0;
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          if (game.grid[y][x].isMine) {
            mineX = x;
            mineY = y;
            break;
          }
        }
      }
      
      const newGame = game.revealAt(mineX, mineY);
      
      expect(newGame.score.value).toBe(0);
      expect(newGame.score.value).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Life power-ups', () => {
    it('should award +50 bonus when gaining a life from power-up', () => {
      const game = new Game(5, 5, 0);
      game.lives.gainLife();
      game.lives.gainLife();
      game.lives.gainLife();
      
      // Place a life power-up in a cell with neighbors
      game.grid[2][2].isLife = true;
      game.grid[2][2].setNeighborCount(1);
      
      const initialScore = game.score.value;
      const newGame = game.revealAt(2, 2);
      
      // Should get +15 for revealing + +50 for life bonus
      expect(newGame.score.value).toBe(initialScore + 15 + 50);
      expect(newGame.lives.count).toBe(4);
    });

    it('should award +50 bonus for life in flood fill region', () => {
      const game = new Game(5, 5, 0);
      game.lives.gainLife();
      game.lives.gainLife();
      game.lives.gainLife();
      
      // Place a life power-up in center with no neighbors
      game.grid[2][2].isLife = true;
      game.grid[2][2].setNeighborCount(0);
      
      const initialScore = game.score.value;
      const newGame = game.revealAt(2, 2);
      
      // Count revealed cells
      let revealedCount = 0;
      newGame.forEachCell(cell => {
        if (cell.isRevealed) revealedCount++;
      });
      
      // Should get +15 per cell + +50 for life bonus
      expect(newGame.score.value).toBe(initialScore + (revealedCount * 15) + 50);
      expect(newGame.lives.count).toBe(4);
    });
  });

  describe('Combined scenarios', () => {
    it('should handle multiple scoring actions correctly', () => {
      const game = Game.create(5, 5, 2, 3, 0);
      
      // Find a mine and a safe cell
      let mineX = 0, mineY = 0;
      let safeX = 0, safeY = 0;
      
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          if (game.grid[y][x].isMine && mineX === 0) {
            mineX = x;
            mineY = y;
          } else if (!game.grid[y][x].isMine && game.grid[y][x].neighborMines > 0) {
            safeX = x;
            safeY = y;
          }
        }
      }
      
      let currentGame = game;
      let expectedScore = 0;
      
      // Flag the mine: +100
      currentGame = currentGame.toggleFlagAt(mineX, mineY);
      expectedScore += 100;
      expect(currentGame.score.value).toBe(expectedScore);
      
      // Reveal a safe cell: +15
      currentGame = currentGame.revealAt(safeX, safeY);
      expectedScore += 15;
      expect(currentGame.score.value).toBe(expectedScore);
      
      expect(currentGame.score.value).toBeGreaterThanOrEqual(0);
    });

    it('should maintain score consistency through game clone', () => {
      const game = Game.create(5, 5, 1, 3, 0);
      game.score.add(250);
      
      const clonedGame = game.clone();
      
      expect(clonedGame.score.value).toBe(250);
      expect(clonedGame.score).not.toBe(game.score);
    });
  });
});
