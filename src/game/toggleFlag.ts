import type { Board } from "./types";
import BoardClass from './Board';

export function toggleFlag(board: Board | InstanceType<typeof BoardClass>, x: number, y: number) {
	if (board instanceof BoardClass) {
		const b = board.toggleFlagAt(x, y);
		return b.toJSON();
	}

	// fallback for plain grid
	const newBoard = structuredClone(board as Board);
	const cell = newBoard[y][x];
	if (!cell || cell.isRevealed) return newBoard;
	cell.isFlagged = !cell.isFlagged;
	return newBoard;
}

