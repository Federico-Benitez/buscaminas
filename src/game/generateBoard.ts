import type { Board, Cell } from "./types";

export function generateBoard(rows: number, cols: number, mines: number): Board {
  const board: Board = [];

  // Inicializar celdas vacías
  for (let y = 0; y < rows; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < cols; x++) {
      row.push({
        x,
        y,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      });
    }
    board.push(row);
  }

  // Colocar minas aleatoriamente
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);

    if (!board[y][x].isMine) {
      board[y][x].isMine = true;
      minesPlaced++;
    }
  }

  // Calcular número de minas vecinas
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!board[y][x].isMine) {
        board[y][x].neighborMines = countNeighbors(board, x, y);
      }
    }
  }

  return board;
}

function countNeighbors(board: Board, x: number, y: number): number {
  const dirs = [-1, 0, 1];
  let count = 0;

  for (const dy of dirs) {
    for (const dx of dirs) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;

      if (board[ny]?.[nx]?.isMine) {
        count++;
      }
    }
  }

  return count;
}
