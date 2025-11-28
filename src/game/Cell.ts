import type { Cell as CellType } from "./types";

export class Cell implements CellType {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  isLife: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.isMine = false;
    this.isRevealed = false;
    this.isFlagged = false;
    this.neighborMines = 0;
    this.isLife = false;
  }

  reveal() {
    this.isRevealed = true;
  }

  toggleFlag() {
    if (!this.isRevealed) this.isFlagged = !this.isFlagged;
  }

  setMine() {
    this.isMine = true;
  }

  setNeighborCount(count: number) {
    this.neighborMines = count;
  }

  clone() {
    const c = new Cell(this.x, this.y);
    c.isMine = this.isMine;
    c.isRevealed = this.isRevealed;
    c.isFlagged = this.isFlagged;
    c.neighborMines = this.neighborMines;
    c.isLife = this.isLife;
    return c;
  }
}
