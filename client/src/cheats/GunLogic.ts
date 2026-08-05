import type { Piece } from "../chess/Piece";
import { getLegalMoves } from "../chess/MoveLogic";
import type { Board } from "../chess/Board";

export function getGunTargets(
  piece: Piece,
  square: string,
  board: Board,
  moveHistory: any[],
  terrain: Record<string, "rock" | null>
) {
  return getLegalMoves(
    piece,
    square,
    board,
    terrain,
    moveHistory,
    false
  ).filter(targetSquare => {
    const target = board[targetSquare];


    // Only allow captures
    return target !== null &&
      target.color !== piece.color;
  });
}