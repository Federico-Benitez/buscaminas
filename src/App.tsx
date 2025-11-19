import { useState } from "react";
import { generateBoard } from "./game/generateBoard";
import { Board as BoardComponent } from "./components/Board";
import { floodFill } from "./game/floodFill";
import type { Board } from "./game/types";

export default function App() {
  const [board, setBoard] = useState(() => generateBoard(9, 9, 10));
  const [gameOver, setGameOver] = useState(false);

  function resetGame() {
    setBoard(generateBoard(9, 9, 10));
    setGameOver(false);
  }



  const handleLeftClick = (x: number, y: number) => {
    if (gameOver) return;

    const newBoard = structuredClone(board);
    const cell = newBoard[y][x];

    if (cell.isRevealed || cell.isFlagged) return;

    // Si tocás una mina → perdiste
    if (cell.isMine) {
      revealAllMines(newBoard);
      setGameOver(true);
      setBoard(newBoard);
      return;
    }

    cell.isRevealed = true;

    if (cell.neighborMines === 0) {
      floodFill(newBoard, x, y);
    }

    setBoard(newBoard);
  };

  const handleRightClick = (x: number, y: number) => {
    if (gameOver) return;

    const newBoard = structuredClone(board);
    const cell = newBoard[y][x];

    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    setBoard(newBoard);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <button
        onClick={resetGame}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Reiniciar partida
      </button>

      <BoardComponent
        board={board}
        onCellClick={handleLeftClick}
        onCellRightClick={handleRightClick}
      />
    </div>
  );

}

function revealAllMines(board: Board) {
  board.forEach(row =>
    row.forEach(cell => {
      if (cell.isMine) {
        cell.isRevealed = true;
      }
    })
  );
}


