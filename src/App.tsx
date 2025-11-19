import { useState } from "react";
import { generateBoard } from "./game/generateBoard";
import { Board as BoardComponent } from "./components/Board";
import { floodFill } from "./game/floodFill";
import type { Board } from "./game/types";
import { checkVictory } from "./game/checkVictory";

export default function App() {
  const [board, setBoard] = useState(() => generateBoard(9, 9, 10));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  function resetGame() {
    setBoard(generateBoard(9, 9, 10));
    setGameOver(false);
  }



  const handleLeftClick = (x: number, y: number) => {
    if (gameOver || won) return;

    const newBoard = structuredClone(board);
    const cell = newBoard[y][x];

    if (cell.isRevealed || cell.isFlagged) return;

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

    // 🔥 Detectar victoria
    if (checkVictory(newBoard)) {
      setWon(true);
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
    <main className="flex flex-col justify-center h-max max-w-4xl w-full mx-auto border-2">
      {won && (
        <div className="text-green-700 font-bold text-xl text-center">
          ¡Ganaste! 🎉
        </div>
      )}
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
    </main>
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


