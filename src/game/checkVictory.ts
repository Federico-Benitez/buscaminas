import type { Board } from "./types";

export function checkVictory(board: Board) {
  let revealed = 0;
  let total = 0;
  let mines = 0;

  board.forEach(row => {
    row.forEach(cell => {
      total++;
      if (cell.isMine) mines++;
      if (cell.isRevealed) revealed++;
    });
  });

  // Si todas las no-minas están reveladas → GANASTE
  return revealed === total - mines;
}
