import { useState } from "react";
import GameClass from "./game/Game";
import { Board as BoardComponent } from "./components/Board";
// procedural functions moved into Board OOP
import LevelSelector from "./components/LevelSelector";
import { useEffect } from "react";

export default function App() {
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'expert' | 'custom' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Definición de niveles y sus configuraciones
  const levels = [
    { id: 'beginner', label: 'Principiante (9x9, 10 minas, 3 vidas)', rows: 9, cols: 9, mines: 10, lives: 3, hiddenLives: 1 },
    { id: 'intermediate', label: 'Intermedio (16x16, 40 minas, 2 vidas)', rows: 16, cols: 16, mines: 40, lives: 2, hiddenLives: 2 },
    { id: 'expert', label: 'Experto (30x16, 99 minas, 1 vida)', rows: 16, cols: 30, mines: 99, lives: 1, hiddenLives: 3 },
    { id: 'custom', label: 'Personalizado', rows: 9, cols: 9, mines: 10, lives: 1, hiddenLives: 0 },
  ] as const;

  const [game, setGame] = useState(() => GameClass.create(9, 9, 10, 3));

  function resetGame() {
    // Reiniciar según el nivel seleccionado
    const cfg = levels.find((l) => l.id === level) ?? levels[0];
    setGame(GameClass.create(cfg.rows, cfg.cols, cfg.mines, cfg.lives, cfg.hiddenLives));
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
    if (game.gameState !== 'playing') return;

    // Clear message on new interaction
    if (message) setMessage(null);

    const oldLives = game.lives.count;
    const newGame = game.revealAt(x, y);

    if (newGame.lives.count > oldLives) {
      setMessage("¡Encontraste una vida extra! ❤️");
    } else if (newGame.lives.count < oldLives && newGame.gameState === 'playing') {
      setMessage("¡Cuidado! Perdiste una vida 💔");
    }

    setGame(newGame);
  };

  const handleRightClick = (x: number, y: number) => {
    if (game.gameState !== 'playing') return;
    const newGame = game.toggleFlagAt(x, y);
    setGame(newGame);
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
      setGame(GameClass.create(rows, cols, mines, 1)); // Custom level gets 1 life by default
      setMessage(null);
      return;
    }

    // Nivel normal
    // Nivel normal
    setLevel(id);
    setGame(GameClass.create(cfg.rows, cfg.cols, cfg.mines, cfg.lives, cfg.hiddenLives));
    setMessage(null);
  }

  return (
    <main className="flex flex-col justify-center items-center min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {level === null ? (
        <LevelSelector levels={levels.map((l) => ({ id: l.id, label: l.label }))} onSelect={handleSelectLevel} />
      ) : (
        <>
          <div className="flex justify-center px-6 py-2 min-h-[40px]">
            {message && (
              <div className="font-mono font-bold text-orange-500 animate-pulse tracking-wider drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">
                {message}
              </div>
            )}
          </div>

          {game.gameState === 'won' && (
            <div className="
              font-mono font-bold text-3xl text-center uppercase tracking-[0.2em]
              text-green-400 drop-shadow-[3px_3px_0_#14532d]
              animate-bounce
              mb-4
            ">
              ¡Ganaste! 🎉
            </div>
          )}
          {game.gameState === 'lost' && (
            <div className="
              font-mono font-bold text-3xl text-center uppercase tracking-[0.2em]
              text-red-500 drop-shadow-[3px_3px_0_#7f1d1d]
              mb-4
            ">
              ¡Perdiste! 💥
            </div>
          )}
          <button
            onClick={resetGame}
            className="
              px-6 py-3 mt-4 mb-2
              font-mono font-bold uppercase tracking-widest
              bg-gray-900 text-green-400
              border-4 border-green-400
              shadow-[4px_4px_0_0_#4ade80]
              hover:translate-x-[2px] hover:translate-y-[2px]
              hover:shadow-[2px_2px_0_0_#4ade80]
              active:translate-x-[4px] active:translate-y-[4px]
              active:shadow-none
              transition-all duration-75
            "
          >
            Reiniciar partida
          </button>
          <BoardComponent
            board={game}
            lives={game.lives.count}
            maxLives={game.lives.maxLives}
            onCellClick={handleLeftClick}
            onCellRightClick={handleRightClick}
          />

        </>
      )}
    </main>
  );
}


// revealAllMines moved to Board.revealAllMines()


