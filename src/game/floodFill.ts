import type { Board } from "./types";
import BoardClass from "./Board";

export function floodFill(board: Board | InstanceType<typeof BoardClass>, x: number, y: number) {
  if (board instanceof BoardClass) {
    const newBoard = board.revealAt(x, y);
    return newBoard.toJSON();
  }

  // fallback to old implementation for plain boards
  const stack = [{ x, y }];
  while (stack.length) {
    const { x, y } = stack.pop()!;
    const cell = board[y]?.[x];
    if (!cell || cell.isRevealed || cell.isFlagged) continue;
    cell.isRevealed = true;
    if (cell.neighborMines > 0) continue;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        stack.push({ x: x + dx, y: y + dy });
      }
    }
  }
  return board;
}
