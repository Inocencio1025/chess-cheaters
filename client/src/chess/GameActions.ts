import type { GameState } from "./GameState";
import { movePiece } from "./GameLogic";
import { endTurn } from "./TurnLogic";

export function makeMove(
  gameState: GameState,
  from: string,
  to: string,
  endPlayerTurn = true
): GameState {

  const result = movePiece(
    gameState.board,
    gameState.terrain,
    from,
    to
  );

  const move = result.move;
  const captured = move.capturedPiece;

  const stateAfterMove = {
    ...gameState,
    board: result.board,
    terrain: result.terrain,
    moveHistory: [
      ...gameState.moveHistory,
      move
    ],

    whiteTempo:
      captured && gameState.currentTurn === "white"
        ? gameState.whiteTempo + 1
        : gameState.whiteTempo,

    blackTempo:
      captured && gameState.currentTurn === "black"
        ? gameState.blackTempo + 1
        : gameState.blackTempo
  };

  if (!endPlayerTurn) {
    return stateAfterMove;
  }

  return endTurn(
    stateAfterMove,
    result.board,
    stateAfterMove.moveHistory
  );
}