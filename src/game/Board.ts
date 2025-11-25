import { Cell } from "./Cell";
import type { Board as BoardType } from "./types";

export class Board {
  rows: number;
  cols: number;
  mines: number;
  grid: Cell[][];

  constructor(rows: number, cols: number, mines: number) {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.grid = [];

    for (let y = 0; y < rows; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < cols; x++) {
        row.push(new Cell(x, y));
      }
      this.grid.push(row);
    }
  }

  static create(rows: number, cols: number, mines: number) {
    const board = new Board(rows, cols, mines);

    // place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      const cell = board.grid[y][x];
      if (!cell.isMine) {
        cell.setMine();
        minesPlaced++;
      }
    }

    // count neighbors
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = board.grid[y][x];
        if (!cell.isMine) {
          const count = board.countNeighbors(x, y);
          cell.setNeighborCount(count);
        }
      }
    }

    return board;
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
    const b = new Board(this.rows, this.cols, this.mines);
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        b.grid[y][x] = this.grid[y][x].clone();
      }
    }
    return b;
  }

  // Reveal cell at (x, y). Returns new Board instance.
  revealAt(x: number, y: number) {
    const board = this.clone();
    const cell = board.grid[y]?.[x];
    if (!cell || cell.isFlagged || cell.isRevealed) return board;

    if (cell.isMine) {
      board.revealAllMines();
      return board;
    }

    // If there are no neighbor mines, expand
    if (cell.neighborMines === 0) {
      board.floodFill(x, y);
    } else {
      cell.reveal();
    }

    return board;
  }

  // Toggle flag at (x, y)
  toggleFlagAt(x: number, y: number) {
    const board = this.clone();
    const cell = board.grid[y]?.[x];
    if (!cell || cell.isRevealed) return board;
    cell.toggleFlag();
    return board;
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

    while (stack.length) {
      const { x, y } = stack.pop()!;
      const cell = this.grid[y]?.[x];
      if (!cell || cell.isRevealed || cell.isFlagged) continue;

      cell.reveal();

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
      neighborMines: cell.neighborMines
    })));
  }
}

export default Board;
