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
): string[] {

  const moves: string[] = [];

  /*
  console.log("king moved?", piece.hasMoved);
  console.log("king check?", isKingInCheck(piece.color, board, moveHistory));
  console.log(board);
  */
  
  if (piece.hasMoved) {
    return moves;
  }

  if (isKingInCheck(piece.color, board)) {
    return moves;
  }

  if (piece.color === "white") {

    // Kingside
    if (
      board["H1"]?.type === "rook" &&
      !board["H1"].hasMoved &&
      !board["F1"] &&
      !board["G1"] &&
      !isSquareAttacked("F1", piece.color, board) &&
      !isSquareAttacked("G1", piece.color, board)
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
      !isSquareAttacked("C1", piece.color, board) &&
      !isSquareAttacked("D1", piece.color, board)
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
      !isSquareAttacked("F8", piece.color, board) &&
      !isSquareAttacked("G8", piece.color, board)
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
      !isSquareAttacked("C8", piece.color, board) &&
      !isSquareAttacked("D8", piece.color, board)
    ) {
      moves.push("C8");
    }
  }

  return moves;
}
