import type { Cell as CellType } from "../game/types";

type Props = {
  cell: CellType;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
};

export function Cell({ cell, onClick, onRightClick }: Props) {
  let content = "";

  if (cell.isRevealed) {
    if (cell.isMine) {
      content = "💣";
    } else if (cell.neighborMines > 0) {
      content = String(cell.neighborMines);
    }
  } else if (cell.isFlagged) {
    content = "🚩";
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
          ? "bg-gray-300"
          : "bg-gray-500 hover:bg-gray-400 active:scale-[0.97]"
        }

        ${cell.isRevealed ? "animate-reveal" : ""}
      `}
    >
      {content}
    </button>
  );
}
