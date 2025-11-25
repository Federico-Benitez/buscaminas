import { Cell } from "./Cell";
import type BoardClass from "../game/Board";
import type { Board as BoardType } from "../game/types";
import { LivesDisplay } from "./LivesDisplay";
import { useEffect, useState, useRef } from "react";

type Props = {
    board: BoardClass | ReturnType<BoardClass["toJSON"]>;
    onCellClick: (x: number, y: number) => void;
    onCellRightClick: (x: number, y: number) => void;
    lives: number;
    maxLives: number;
};

function isBoardWithToJSON(v: unknown): v is { toJSON: () => BoardType } {
    return typeof v === 'object' && v !== null && 'toJSON' in (v as object) && typeof ((v as { toJSON?: unknown }).toJSON) === 'function';
}

export function Board({ board, onCellClick, onCellRightClick, lives, maxLives }: Props) {
    const boardGrid: BoardType = isBoardWithToJSON(board) ? board.toJSON() : (board as BoardType);
    const cols = boardGrid[0].length;
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;

            // Calculate required width: cols * 40px (cell) + (cols-1) * 2px (gap) + 16px (padding)
            // Actually simpler: measure the board's natural width or estimate it.
            // Cell is w-10 (40px) + gap-[2px].
            const boardWidth = cols * 42;
            const availableWidth = window.innerWidth - 32; // 16px padding on each side

            if (boardWidth > availableWidth) {
                setScale(availableWidth / boardWidth);
            } else {
                setScale(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [cols]);

    return (
        <div className="flex justify-center items-center p-6 w-full overflow-hidden">
            <div
                ref={containerRef}
                className="relative transition-transform duration-200 origin-top"
                style={{ transform: `scale(${scale})` }}
            >
                <div
                    className="grid gap-[2px] bg-neutral-700 p-2 rounded-lg w-fit mx-auto"
                    style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
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
                <LivesDisplay lives={lives} maxLives={maxLives} />
            </div>
        </div>
    );
}
