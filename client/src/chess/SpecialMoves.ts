import type { Board } from "./Board";
import type { Piece } from "./Piece";
import type { Move } from "./Move";
import { notationToPosition } from "./Position";
import { isKingInCheck, isSquareAttacked } from "./AttackLogic";


export function handleCastling(
  board: Board,
  piece: Piece,
  from: string,
  to: string
): Board {

  const newBoard = { ...board };

  if (
    piece.type !== "king" ||
    Math.abs(
      notationToPosition(from).file -
      notationToPosition(to).file
    ) !== 2
  ) {
    return newBoard;
  }


  // kingside
  if (to === "G1") {
    newBoard["F1"] = newBoard["H1"];
    newBoard["H1"] = null;
  }

  // queenside
  if (to === "C1") {
    newBoard["D1"] = newBoard["A1"];
    newBoard["A1"] = null;
  }

  // black kingside
  if (to === "G8") {
    newBoard["F8"] = newBoard["H8"];
    newBoard["H8"] = null;
  }

  // black queenside
  if (to === "C8") {
    newBoard["D8"] = newBoard["A8"];
    newBoard["A8"] = null;
  }

  return newBoard;
}


export function handleEnPassant(
  board: Board,
  piece: Piece,
  from: string,
  to: string,
  move: Move
): Board {

  const newBoard = { ...board };

  if (
    piece.type === "pawn" &&
    from[0] !== to[0] &&
    !board[to]
  ) {

    const capturedPawnSquare = to[0] + from[1];

    newBoard[capturedPawnSquare] = null;

    move.isEnPassant = true;
  }

  return newBoard;
}
export function getCastleMoves(
  piece: Piece,
  board: Board,
  terrain: Record<string, "rock" | null>
): string[] {

  const moves: string[] = [];


  
  if (piece.hasMoved) {
    return moves;
  }

  if (isKingInCheck(piece.color, board, terrain)) {
    return moves;
  }

  if (piece.color === "white") {

    // Kingside
    if (
      board["H1"]?.type === "rook" &&
      !board["H1"].hasMoved &&
      !board["F1"] &&
      !board["G1"] &&
      !isSquareAttacked("F1", piece.color, board, terrain) &&
      !isSquareAttacked("G1", piece.color, board, terrain)
    ) {
      moves.push("G1");
    }

    // Queenside
    if (
      board["A1"]?.type === "rook" &&
      !board["A1"].hasMoved &&
      !board["B1"] &&
      !board["C1"] &&
      !board["D1"] &&
      !isSquareAttacked("C1", piece.color, board, terrain) &&
      !isSquareAttacked("D1", piece.color, board, terrain)
    ) {
      moves.push("C1");
    }

  } else {

    // Kingside
    if (
      board["H8"]?.type === "rook" &&
      !board["H8"].hasMoved &&
      !board["F8"] &&
      !board["G8"] &&
      !isSquareAttacked("F8", piece.color, board, terrain) &&
      !isSquareAttacked("G8", piece.color, board, terrain)
    ) {
      moves.push("G8");
    }

    // Queenside
    if (
      board["A8"]?.type === "rook" &&
      !board["A8"].hasMoved &&
      !board["B8"] &&
      !board["C8"] &&
      !board["D8"] &&
      !isSquareAttacked("C8", piece.color, board, terrain) &&
      !isSquareAttacked("D8", piece.color, board, terrain)
    ) {
      moves.push("C8");
    }
  }

  return moves;
}
