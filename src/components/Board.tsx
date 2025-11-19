import { Cell } from "./Cell";
import type { Board } from "../game/types";

type Props = {
    board: Board;
    onCellClick: (x: number, y: number) => void;
    onCellRightClick: (x: number, y: number) => void;
};

export function Board({ board, onCellClick, onCellRightClick }: Props) {
    const cols = board[0].length

    return (
        <div className="flex justify-center items-center p-6">
            <div
                className="grid gap-[2px] bg-neutral-700 p-2 rounded-lg w-fit mx-auto"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
                {board.map((row, y) =>
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
        </div>
    );
}
