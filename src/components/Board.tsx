import { Cell } from "./Cell";
import type GameClass from "../game/Game";
import type { Board as BoardType } from "../game/types";
import { LivesDisplay } from "./LivesDisplay";
import { useEffect, useState, useRef } from "react";

type Props = {
    board: GameClass | ReturnType<GameClass["toJSON"]>;
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

            // Calculate required width more accurately:
            // - Each cell: 40px (w-10)
            // - Gap between cells: 2px
            // - Board padding: 8px on each side (p-2 = 0.5rem = 8px)
            // Total width = (cols * 40) + ((cols - 1) * 2) + (2 * 8)
            const cellWidth = 40;
            const gapWidth = 2;
            const boardPadding = 16; // p-2 on both sides
            const boardWidth = (cols * cellWidth) + ((cols - 1) * gapWidth) + boardPadding;

            // Available width with some margin for safety
            const isMobile = window.innerWidth < 640; // sm breakpoint
            const horizontalMargin = isMobile ? 16 : 48; // Less margin on mobile
            const availableWidth = window.innerWidth - horizontalMargin;

            if (boardWidth > availableWidth) {
                // Add a small buffer to prevent edge cases
                setScale((availableWidth / boardWidth) * 0.98);
            } else {
                setScale(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [cols]);
    return (
        <div className="flex justify-center items-center p-2 sm:p-6 w-full overflow-hidden">
            <div
                ref={containerRef}
                className="relative transition-transform duration-200 origin-center"
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
