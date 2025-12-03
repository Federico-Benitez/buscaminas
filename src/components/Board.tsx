import { Cell } from "./Cell";
import type GameClass from "../game/Game";
import type { Board as BoardType } from "../game/types";
import { LivesDisplay } from "./LivesDisplay";
import { ScoreDisplay } from "./ScoreDisplay";
import { useEffect, useState, useRef } from "react";


type Props = {
    board: GameClass | ReturnType<GameClass["toJSON"]>;
    onCellClick: (x: number, y: number) => void;
    onCellRightClick: (x: number, y: number) => void;
    lives: number;
    maxLives: number;
    score: number;
};

function isBoardWithToJSON(v: unknown): v is { toJSON: () => BoardType } {
    return typeof v === 'object' && v !== null && 'toJSON' in (v as object) && typeof ((v as { toJSON?: unknown }).toJSON) === 'function';
}

export function Board({ board, onCellClick, onCellRightClick, lives, maxLives, score }: Props) {
    const boardGrid: BoardType = isBoardWithToJSON(board) ? board.toJSON() : (board as BoardType);
    const cols = boardGrid[0].length;
    const containerRef = useRef<HTMLDivElement>(null);
    const isBigBoard = cols > 9;
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (isBigBoard) {
            return;
        }

        const handleResize = () => {
            if (!containerRef.current) return;

            const boardEl = containerRef.current.querySelector('.board-grid') as HTMLElement;
            if (!boardEl) return;

            const boardWidth = boardEl.offsetWidth;

            const margin = 24; // small safety margin
            const available = window.innerWidth - margin;

            if (boardWidth > available) {
                setScale((available / boardWidth) * 0.98);
            } else {
                setScale(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [cols, isBigBoard]);


    return (
        <div className={"flex items-center p-2 sm:p-6 w-full" + (isBigBoard ? "overflow-x-auto justify-start" : "justify-center overflow-hidden")}>
            <div
                ref={containerRef}
                className="transition-transform duration-200 origin-top mx-auto"
                style={{ transform: `scale(${isBigBoard ? 1 : scale})` }}
            >
                <div
                    className={`
  board-grid grid gap-[2px] bg-neutral-700 p-2 rounded-lg mx-auto
  ${!isBigBoard ? "max-w-[360px] w-full sm:max-w-[480px] md:max-w-full" : ""}
  ${isBigBoard ? "w-max" : ""}
`}
                    style={{
                        gridTemplateColumns: `repeat(${cols}, minmax(18px, 1fr))`,
                    }}
                >
                    {boardGrid.map((row, y) =>
                        row.map((cell, x) => (
                            <Cell
                                key={`${x}-${y}`}
                                cell={cell}
                                onClick={() => onCellClick(x, y)}
                                onRightClick={(e) => {
                                    e.preventDefault();
                                    onCellRightClick(x, y);
                                }}
                            />
                        ))
                    )}
                </div>
                <div className="flex items-center justify-between gap-4 w-full">
                    <ScoreDisplay score={score} />
                    <LivesDisplay lives={lives} maxLives={maxLives} />
                </div>
            </div>
        </div >
    );
}
