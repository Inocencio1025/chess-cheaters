import type { Board } from "./Board";
import type { Piece } from "./Piece";
import { getPawnAttackSquares, getValidBishopMoves, getValidKingMoves, getValidKnightMoves, getValidQueenMoves, getValidRookMoves } from "./PieceMoves";
import { notationToPosition } from "./Position";

function getAttackSquares(
  piece: Piece,
  square: string,
  board: Board
): string[] {

  const position = notationToPosition(square);

  switch (piece.type) {

    case "pawn":
      return getPawnAttackSquares(piece, position);

    case "king":
      return getValidKingMoves(piece, position, board, false);

    case "rook":
      return getValidRookMoves(piece, position, board);

    case "bishop":
      return getValidBishopMoves(piece, position, board);

    case "queen":
      return getValidQueenMoves(piece, position, board);

    case "knight":
      return getValidKnightMoves(piece, position, board);

    default:
      return [];
  }
}

function findKing(color: "white" | "black", board: Board): string | null {
  for (const square in board) {
    const piece = board[square];

    if (
      piece &&
      piece.type === "king" &&
      piece.color === color
    ) {
      return square;
    }
  }

  return null;
}

export function isKingInCheck(
  color: "white" | "black",
  board: Board
): boolean {
  const kingSquare = findKing(color, board);

  if (!kingSquare) {
    return false;
  }

  for (const square in board) {
    const piece = board[square];

    if (!piece || piece.color === color) {
      continue;
    }

    const attacks = getAttackSquares(piece, square, board);

    if (attacks.includes(kingSquare)) {
      return true;
    }
  }

  return false;
}

export function isSquareAttacked(
  square: string,
  color: "white" | "black",
  board: Board
): boolean {

  for (const position in board) {
    const piece = board[position];

    if (!piece || piece.color === color) {
      continue;
    }

    const attacks = getAttackSquares(piece, position, board);

    if (attacks.includes(square)) {
      return true;
    }
  }

  return false;
}