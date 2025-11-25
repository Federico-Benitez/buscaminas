import type { Board } from "./types";
import BoardClass from "./Board";

export function checkVictory(board: Board | InstanceType<typeof BoardClass>) {
  if (board instanceof BoardClass) return board.checkVictory();
  // otherwise compute from plain board
  let revealed = 0;
  let total = 0;
  let mines = 0;
  board.forEach((row) => {
    row.forEach((cell) => {
      total++;
      if (cell.isMine) mines++;
      if (cell.isRevealed) revealed++;
    });
  });
  return revealed === total - mines;
}
