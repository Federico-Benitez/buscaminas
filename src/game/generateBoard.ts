import type { Board } from "./types";
import BoardClass from "./Board";

export function generateBoard(rows: number, cols: number, mines: number): Board {
  return BoardClass.create(rows, cols, mines, 0).toJSON();
}

// kept for backward compatibility by delegating to BoardClass.create
