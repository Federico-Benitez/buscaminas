import { useState } from "react";
import BoardClass from "./game/Board";
import { Board as BoardComponent } from "./components/Board";
// procedural functions moved into Board OOP
import LevelSelector from "./components/LevelSelector";
import { useEffect } from "react";

export default function App() {
  const [lives, setLives] = useState(0);
  const [maxLives, setMaxLives] = useState(0);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'expert' | 'custom' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Definición de niveles y sus configuraciones
  const levels = [
    { id: 'beginner', label: 'Principiante (9x9, 10 minas, 3 vidas)', rows: 9, cols: 9, mines: 10, lives: 3 },
    { id: 'intermediate', label: 'Intermedio (16x16, 40 minas, 2 vidas)', rows: 16, cols: 16, mines: 40, lives: 2 },
    { id: 'expert', label: 'Experto (30x16, 99 minas, 1 vida)', rows: 16, cols: 30, mines: 99, lives: 1 },
    { id: 'custom', label: 'Personalizado', rows: 9, cols: 9, mines: 10, lives: 1 },
  ] as const;

  const [board, setBoard] = useState(() => BoardClass.create(9, 9, 10));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  function resetGame() {
    // Reiniciar según el nivel seleccionado
    const cfg = levels.find((l) => l.id === level) ?? levels[0];
    setBoard(BoardClass.create(cfg.rows, cfg.cols, cfg.mines));
    setLives(cfg.lives);
    setMaxLives(cfg.lives);
    setGameOver(false);
    setWon(false);
    setMessage(null);
    setLevel(null);
  }

  // Auto-clear message after a short duration
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const handleLeftClick = (x: number, y: number) => {
    if (gameOver || won) return;

    // Clear message on new interaction
    if (message) setMessage(null);

    const newBoard = board.revealAt(x, y);
    const clickedCell = newBoard.grid[y]?.[x];

    if (clickedCell?.isMine && clickedCell?.isRevealed) {
      if (lives > 1) {
        setLives(l => l - 1);
        setMessage("¡Cuidado! Perdiste una vida 💔");
        // We keep the mine revealed but don't end the game
      } else {
        setLives(0);
        setGameOver(true);
        newBoard.revealAllMines();
      }
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
      setLives(1); // Custom level gets 1 life by default
      setMaxLives(1);
      setGameOver(false);
      setWon(false);
      setMessage(null);
      return;
    }

    // Nivel normal
    setLevel(id);
    setBoard(BoardClass.create(cfg.rows, cfg.cols, cfg.mines));
    setLives(cfg.lives);
    setMaxLives(cfg.lives);
    setGameOver(false);
    setWon(false);
    setMessage(null);
  }

  return (
    <main className="flex flex-col justify-center items-center min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {level === null ? (
        <LevelSelector levels={levels.map((l) => ({ id: l.id, label: l.label }))} onSelect={handleSelectLevel} />
      ) : (
        <>
          <div className="flex justify-center px-6 py-2 min-h-[40px]">
            {message && <div className="text-orange-600 font-bold animate-pulse">{message}</div>}
          </div>

          {won && (
            <div className="text-green-700 dark:text-green-300 font-bold text-xl text-center">
              ¡Ganaste! 🎉
            </div>
          )}
          {gameOver && (
            <div className="text-red-700 dark:text-red-300 font-bold text-xl text-center">
              ¡Perdiste! 💥
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
            lives={lives}
            maxLives={maxLives}
            onCellClick={handleLeftClick}
            onCellRightClick={handleRightClick}
          />

        </>
      )}
    </main>
  );
}


// revealAllMines moved to Board.revealAllMines()


