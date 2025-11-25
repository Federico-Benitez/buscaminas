import type { Board } from "./types";
import BoardClass from './Board';

export function revealCell(board: Board | InstanceType<typeof BoardClass>, x: number, y: number) {
	if (board instanceof BoardClass) {
		const b = board.revealAt(x, y);
		return b.toJSON();
	}

	// fallback for plain grid
	const newBoard = structuredClone(board as Board);
	const cell = newBoard[y][x];
	if (!cell || cell.isRevealed || cell.isFlagged) return newBoard;
	if (cell.isMine) {
		// reveal all mines
		newBoard.forEach(row => row.forEach(c => { if (c.isMine) c.isRevealed = true; }));
		return newBoard;
	}
	if (cell.neighborMines === 0) {
		// manual flood fill (simple fallback)
		const stack = [{ x, y }];
		while (stack.length) {
			const { x, y } = stack.pop()!;
			const c = newBoard[y]?.[x];
			if (!c || c.isRevealed || c.isFlagged) continue;
			c.isRevealed = true;
			if (c.neighborMines > 0) continue;
			for (let dy = -1; dy <= 1; dy++) {
				for (let dx = -1; dx <= 1; dx++) {
					if (dx === 0 && dy === 0) continue;
					stack.push({ x: x + dx, y: y + dy });
				}
			}
		}
	} else {
		cell.isRevealed = true;
	}
	return newBoard;
}

