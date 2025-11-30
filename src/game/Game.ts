import { Cell } from "./Cell";
import type { Board as BoardType } from "./types";

import { Lives } from "./Lives";
import { Score } from "./Score";

export class Game {
  rows: number;
  cols: number;
  mines: number;
  grid: Cell[][];
  lives: Lives;
  score: Score;
  gameState: 'playing' | 'won' | 'lost' = 'playing';

  constructor(rows: number, cols: number, mines: number) {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.grid = [];
    this.lives = new Lives(0); // Default, will be set in create
    this.score = new Score();

    for (let y = 0; y < rows; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < cols; x++) {
        row.push(new Cell(x, y));
      }
      this.grid.push(row);
    }
  }

  static create(rows: number, cols: number, mines: number, lives: number, hiddenLives: number = 0) {
    const game = new Game(rows, cols, mines);
    game.lives = new Lives(lives);

    // place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      const cell = game.grid[y][x];
      if (!cell.isMine) {
        cell.setMine();
        minesPlaced++;
      }
    }

    // place hidden lives
    let livesPlaced = 0;
    // Safety check: ensure we don't loop forever if too many lives requested
    const maxLives = (rows * cols) - mines;
    const actualLives = Math.min(hiddenLives, maxLives);

    while (livesPlaced < actualLives) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      const cell = game.grid[y][x];
      if (!cell.isMine && !cell.isLife) {
        cell.isLife = true;
        livesPlaced++;
      }
    }

    // count neighbors
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = game.grid[y][x];
        if (!cell.isMine) {
          const count = game.countNeighbors(x, y);
          cell.setNeighborCount(count);
        }
      }
    }

    return game;
  }

  countNeighbors(x: number, y: number) {
    const dirs = [-1, 0, 1];
    let count = 0;

    for (const dy of dirs) {
      for (const dx of dirs) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (this.grid[ny]?.[nx]?.isMine) count++;
      }
    }

    return count;
  }

  clone() {
    const g = new Game(this.rows, this.cols, this.mines);
    g.lives = this.lives.clone();
    g.score = this.score.clone();
    g.gameState = this.gameState;
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        g.grid[y][x] = this.grid[y][x].clone();
      }
    }
    return g;
  }

  // Reveal cell at (x, y). Returns new Game instance.
  revealAt(x: number, y: number) {
    const game = this.clone();
    if (game.gameState !== 'playing') return game;

    const cell = game.grid[y]?.[x];
    if (!cell || cell.isFlagged || cell.isRevealed) return game;

    // Logic for revealing a mine
    if (cell.isMine) {
      cell.reveal();
      if (!game.lives.isEmpty()) {
        game.lives.loseLife();
        if (game.lives.isEmpty()) {
          game.gameState = 'lost';
          game.revealAllMines();
        }
      } else {
         game.gameState = 'lost';
         game.revealAllMines();
      }
      return game;
    }

    // Logic for revealing a safe cell
    // If cell has no neighbor mines, use flood fill to reveal all connected empty cells
    if (cell.neighborMines === 0) {
      game.floodFill(x, y);
    } else {
      // Just reveal this single cell
      cell.reveal();
      game.score.add(10);
      
      if (cell.isLife) {
        game.lives.gainLife();
        game.score.add(50);
      }
    }

    if (game.checkVictory()) {
      game.gameState = 'won';
    }

    return game;
  }

  // Toggle flag at (x, y)
  toggleFlagAt(x: number, y: number) {
    const game = this.clone();
    if (game.gameState !== 'playing') return game;

    const cell = game.grid[y]?.[x];
    if (!cell || cell.isRevealed) return game;
    cell.toggleFlag();
    return game;
  }

  revealAllMines() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cell = this.grid[y][x];
        if (cell.isMine) cell.reveal();
      }
    }
  }

  checkVictory() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cell = this.grid[y][x];
        if (!cell.isMine && !cell.isRevealed) return false;
      }
    }
    return true;
  }

  private floodFill(x: number, y: number) {
    const stack = [{ x, y }];
    // Note: floodFill operates on 'this' because it's called on a cloned instance

    while (stack.length) {
      const { x, y } = stack.pop()!;
      const cell = this.grid[y]?.[x];
      if (!cell || cell.isRevealed || cell.isFlagged) continue;

      cell.reveal();
      this.score.add(10); // Points for flood filled cells

      if (cell.isLife) {
        this.lives.gainLife();
        this.score.add(50);
      }

      if (cell.neighborMines > 0) continue;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          stack.push({ x: x + dx, y: y + dy });
        }
      }
    }
  }

  forEachCell(cb: (cell: Cell) => void) {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        cb(this.grid[y][x]);
      }
    }
  }

  toJSON(): BoardType {
    // Convert to plain data structure so components remain simple or for debug.
    return this.grid.map(row => row.map(cell => ({
      x: cell.x,
      y: cell.y,
      isMine: cell.isMine,
      isRevealed: cell.isRevealed,
      isFlagged: cell.isFlagged,
      neighborMines: cell.neighborMines,
      isLife: cell.isLife
    })));
  }
}

export default Game;
