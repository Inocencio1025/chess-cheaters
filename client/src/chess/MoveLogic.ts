import type { Piece } from "./Piece";
import type { Board } from "./Board";
import { notationToPosition, positionToNotation, type Position } from "./Position";
import { movePiece } from "./GameLogic";
import type { Move } from "./Move";
import { getValidBishopMoves, getValidKingMoves, getValidKnightMoves, getValidPawnMoves, getValidQueenMoves, getValidRookMoves } from "./PieceMoves";
import { isKingInCheck } from "./AttackLogic";


export function getLegalMoves(
  piece: Piece,
  square: string,
  board: Board,
  moveHistory: Move[]
): string[] {

  const pseudoMoves = getPseudoLegalMoves(
    piece, 
    square, 
    board,
    moveHistory);

  return pseudoMoves.filter(move => {
    const newBoard = movePiece(board, square, move);

    const illegal = isKingInCheck(piece.color, newBoard.board);

    /*
    if (illegal) {
        console.log(`${piece.type} ${square}->${move} removed`);
    }
    */

    return !illegal;
});
}

export function getPseudoLegalMoves(
  piece: Piece,
  notation: string,
  board: Board,
  moveHistory: Move[]
): string[] {
  const position = notationToPosition(notation);

  switch (piece.type) {
    case "pawn":
      return getValidPawnMoves(piece, position, board, moveHistory);

    case "rook":
      return getValidRookMoves(piece, position, board);

    case "knight":
      return getValidKnightMoves(piece, position, board);

    case "bishop":
      return getValidBishopMoves(piece, position, board);

    case "queen":
      return getValidQueenMoves(piece, position, board);

    case "king":
      return getValidKingMoves(piece, position, board);

    default:
      return [];
  }
}

export function playerHasLegalMoves(
  color: "white" | "black",
  board: Board, 
  moveHistory: Move[]
): boolean{
    for (const square in board) {
      const piece = board[square];

      if (piece?.color === color) {
          const moves = getLegalMoves(piece, square, board, moveHistory);

          if (moves.length > 0) {
              return true;
          }
      }
  }
  return false;
}