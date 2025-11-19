import { Cell } from "./Cell";
import type { Board } from "../game/types";

type Props = {
  board: Board;
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (x: number, y: number) => void;
};

export function Board({ board, onCellClick, onCellRightClick }: Props) {
  return (
    <div className="inline-block">
      {board.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <Cell
              key={x}
              cell={cell}
              onClick={() => onCellClick(x, y)}
              onRightClick={(e) => {
                e.preventDefault();
                onCellRightClick(x, y);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
