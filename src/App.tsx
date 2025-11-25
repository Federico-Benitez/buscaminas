import { useState } from "react";
import BoardClass from "./game/Board";
import { Board as BoardComponent } from "./components/Board";
// procedural functions moved into Board OOP
import LevelSelector from "./components/LevelSelector";

export default function App() {
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'expert' | 'custom' | null>(null);
  // Definición de niveles y sus configuraciones
  const levels = [
    { id: 'beginner', label: 'Principiante (9x9, 10 minas)', rows: 9, cols: 9, mines: 10 },
    { id: 'intermediate', label: 'Intermedio (16x16, 40 minas)', rows: 16, cols: 16, mines: 40 },
    { id: 'expert', label: 'Experto (30x16, 99 minas)', rows: 16, cols: 30, mines: 99 },
    { id: 'custom', label: 'Personalizado', rows: 9, cols: 9, mines: 10 },
  ] as const;

  const [board, setBoard] = useState(() => BoardClass.create(9, 9, 10));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  function resetGame() {
    // Reiniciar según el nivel seleccionado
    const cfg = levels.find((l) => l.id === level) ?? levels[0];
    setBoard(BoardClass.create(cfg.rows, cfg.cols, cfg.mines));
    setGameOver(false);
    setWon(false);
    setLevel(null);
  }



  const handleLeftClick = (x: number, y: number) => {
    if (gameOver || won) return;
    const newBoard = board.revealAt(x, y);
    const clickedCell = newBoard.grid[y]?.[x];
    if (clickedCell?.isMine && clickedCell?.isRevealed) {
      setGameOver(true);
    }
    if (newBoard.checkVictory()) setWon(true);
    setBoard(newBoard);
  };

  const handleRightClick = (x: number, y: number) => {
    if (gameOver) return;
    const newBoard = board.toggleFlagAt(x, y);
    setBoard(newBoard);
  };

  function handleSelectLevel(id: typeof levels[number]['id']) {
    // Buscar configuración
    const cfg = levels.find((l) => l.id === id)!;

    if (id === 'custom') {
      // Pedir al usuario valores personalizados (simple prompt).
      const r = parseInt(window.prompt('Filas (rows) — e.g. 9') ?? String(cfg.rows), 10);
      const c = parseInt(window.prompt('Columnas (cols) — e.g. 9') ?? String(cfg.cols), 10);
      const m = parseInt(window.prompt('Minas (mines) — e.g. 10') ?? String(cfg.mines), 10);

      const rows = Number.isNaN(r) ? cfg.rows : Math.max(1, r);
      const cols = Number.isNaN(c) ? cfg.cols : Math.max(1, c);
      const mines = Number.isNaN(m) ? cfg.mines : Math.max(0, Math.min(rows * cols - 1, m));

      setLevel('custom');
      setBoard(BoardClass.create(rows, cols, mines));
      setGameOver(false);
      setWon(false);
      return;
    }

    // Nivel normal
    setLevel(id);
    setBoard(BoardClass.create(cfg.rows, cfg.cols, cfg.mines));
    setGameOver(false);
    setWon(false);
  }



  return (
    <main className="flex flex-col justify-center h-max max-w-4xl w-full mx-auto border-2">

      {level === null ? (
        <LevelSelector levels={levels.map((l) => ({ id: l.id, label: l.label }))} onSelect={handleSelectLevel} />
      ) : (
        <>
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

        </>
      )}
    </main>
  );

}

// revealAllMines moved to Board.revealAllMines()


