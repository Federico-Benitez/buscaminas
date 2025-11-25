import type { Cell as CellType } from "../game/types";
import { Bomb, Flag } from "lucide-react";

type Props = {
  cell: CellType;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
};

export function Cell({ cell, onClick, onRightClick }: Props) {
  let content: React.ReactNode = "";

  if (cell.isRevealed) {
    if (cell.isMine) {
      content = <Bomb className="w-6 h-6 text-black fill-red-500" />;
    } else if (cell.neighborMines > 0) {
      content = String(cell.neighborMines);
    }
  } else if (cell.isFlagged) {
    content = <Flag className="w-5 h-5 text-red-500 fill-red-500" />;
  }

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
      {content}
    </button>
  );
}
