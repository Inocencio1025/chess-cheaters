import { isKingInCheck } from "./AttackLogic";
import type { Board } from "./Board";
import type { GameStatus } from "./GameState";
import type { Move } from "./Move";
import { playerHasLegalMoves } from "./MoveLogic";
import {  handleCastling,  handleEnPassant} from "./SpecialMoves";


export function getGameStatus(
  color: "white" | "black",
  board: Board,
  moveHistory: Move[]
): GameStatus {

  const inCheck = isKingInCheck(color, board);
  const hasMoves = playerHasLegalMoves(color, board, moveHistory);

  if (inCheck && !hasMoves) {
    return "checkmate";
  }

  if (!inCheck && !hasMoves) {
    return "stalemate";
  }

  if (inCheck) {
    return "check";
  }

  return "playing";
}
export function movePiece(
  board: Board,
  from: string,
  to: string,
): { board: Board; move: Move } {

  let newBoard = { ...board };

  const piece = board[from];

  if (!piece) {
    throw new Error("No piece at source square");
  }

  const move: Move = {
    from,
    to,
    piece,
    capturedPiece: board[to],
    previousHasMoved: piece.hasMoved,
    isDoublePawnMove:
      piece.type === "pawn" &&
      Math.abs(Number(from[1]) - Number(to[1])) === 2
  };

  newBoard[to] = {
    ...piece,
    hasMoved: true
  };

  newBoard[from] = null;

  newBoard = handleCastling(
    newBoard,
    piece,
    from,
    to
  );

  newBoard = handleEnPassant(
    newBoard,
    piece,
    from,
    to,
    move
  );

  newBoard = promotePawn(newBoard, to);

  return {
    board: newBoard,
    move
  };
}

function promotePawn(board: Board, square: string): Board {
  const newBoard = { ...board };

  const piece = newBoard[square];

  if (!piece || piece.type !== "pawn") {
    return newBoard;
  }

  const rank = Number(square[1]);

  if (
    piece.color === "white" && rank === 8 ||
    piece.color === "black" && rank === 1
  ) {
    newBoard[square] = {
      ...piece,
      type: "queen"
    };
  }

  return newBoard;
}

