import type { Piece } from "./Piece";
import type { Board } from "./Board";
import { notationToPosition, } from "./Position";
import { movePiece } from "./GameLogic";
import type { Move } from "./Move";
import { getRoyalDecreeMoves, getValidBishopMoves, getValidKingMoves, getValidKnightMoves, getValidPawnMoves, getValidQueenMoves, getValidRookMoves } from "./PieceMoves";
import { isKingInCheck } from "./AttackLogic";


export function getLegalMoves(
  piece: Piece,
  square: string,
  board: Board,
  terrain: Record<string, "rock" | null>,
  moveHistory: Move[],
  royalDecreeActive: boolean,
  cannotCapture = false
): string[] {

  const pseudoMoves = getPseudoLegalMoves(
    piece,
    square,
    board,
    terrain,
    moveHistory,
    royalDecreeActive,
    cannotCapture
  );


  const filteredMoves = cannotCapture
  ? pseudoMoves.filter(move => !board[move])
  : pseudoMoves;

  return filteredMoves.filter(move => {
    const newBoard = movePiece(
      board, 
      terrain, 
      square, 
      move);

    const illegal = isKingInCheck(
      piece.color,
      newBoard.board,
      newBoard.terrain
    );

    return !illegal;
  });
}

export function getPseudoLegalMoves(
  piece: Piece,
  square: string,
  board: Board,
  terrain: Record<string, "rock" | null>,
  moveHistory: Move[],
  royalDecreeActive: boolean,
  cannotCapture = false
): string[] {

  const position = notationToPosition(square);

  switch (piece.type) {
    case "pawn":
      return getValidPawnMoves(
        piece,
        position,
        board,
        terrain,
        moveHistory
      );

    case "rook":
      return getValidRookMoves(
        piece,
        position,
        board,
        terrain
      );

    case "knight":
      return getValidKnightMoves(
        piece,
        position,
        board,
        terrain
      );

    case "bishop":
      return getValidBishopMoves(
        piece,
        position,
        board,
        terrain
      );

    case "queen":
      return getValidQueenMoves(
        piece,
        position,
        board,
        terrain
      );

    case "king":
      if (royalDecreeActive) {
        return getRoyalDecreeMoves(
          piece,
          position,
          board,
          terrain
        );
      }

      return getValidKingMoves(
        piece,
        position,
        board,
        terrain
      );

    default:
      return [];
  }
}

export function playerHasLegalMoves(
  color: "white" | "black",
  board: Board,
  moveHistory: Move[],
  royalDecreeActive: boolean,
  terrain: Record<string, "rock" | null>
): boolean {
  for (const square in board) {
    const piece = board[square];

    if (piece?.color === color) {
      const moves = getLegalMoves(
        piece,
        square,
        board,
        terrain,
        moveHistory,
        royalDecreeActive
      );

      if (moves.length > 0) {
        return true;
      }
    }
  }

  return false;
}