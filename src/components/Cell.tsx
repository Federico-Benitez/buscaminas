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
        w-10 h-10 border flex items-center justify-center select-none
        transition-all duration-150
        ${cell.isRevealed
                    ? "bg-gray-300 scale-100"
                    : "bg-gray-500 hover:bg-gray-400 active:scale-90"
                }
        ${cell.isRevealed ? "animate-reveal" : ""}
      `}
        >
            {content}
        </button>
    );
}
