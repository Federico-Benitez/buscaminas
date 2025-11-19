import type { Board } from "./types";

export function floodFill(board: Board, x: number, y: number) {
  const stack = [{ x, y }];

  while (stack.length) {
    const { x, y } = stack.pop()!;
    const cell = board[y]?.[x];

    if (!cell || cell.isRevealed || cell.isFlagged) continue;

    cell.isRevealed = true;

    // Si tiene minas vecinas, se revela pero no continúa expandiendo
    if (cell.neighborMines > 0) continue;

    // Expandir vecinos
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        stack.push({ x: x + dx, y: y + dy });
      }
    }
  }
}
