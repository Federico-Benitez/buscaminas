import type { Cell as CellType } from "../game/types";
import { Bomb, Flag } from "lucide-react";

type Props = {
  cell: CellType;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
};

export function Cell({ cell, onClick, onRightClick }: Props) {
  return (
    <button
      onClick={onClick}
      onContextMenu={onRightClick}
      className={`
        w-10 h-10 flex items-center justify-center
        select-none transition-transform duration-150

        border border-gray-700 
        text-lg font-bold

        ${cell.isRevealed
          ? "bg-gray-300 text-black"
          : "bg-gray-500 hover:bg-gray-400 active:scale-[0.97] text-white"
        }

        ${cell.isRevealed ? "animate-reveal" : ""}
      `}
    >
      <span className="flex items-center justify-center w-full h-full">
        {cell.isRevealed && cell.isMine && (
          <span className="flex items-center justify-center">
            <Bomb size={24} className="text-black fill-red-600" />
          </span>
        )}
        {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && (
          cell.neighborMines
        )}
        {!cell.isRevealed && cell.isFlagged && (
          <span className="flex items-center justify-center">
            <Flag size={20} className="text-red-600 fill-red-600" />
          </span>
        )}
      </span>
    </button>
  );
}
