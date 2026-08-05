import type { GameState } from "./GameState";
import { movePiece } from "./GameLogic";
import { endTurn } from "./TurnLogic";
import { rewardCaptureTempo } from "./TempoLogic";


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

  const tempoReward = rewardCaptureTempo(
    gameState,
    move.capturedPiece !== undefined
  );

  const stateAfterMove = {
    ...gameState,
    board: result.board,
    terrain: result.terrain,
    moveHistory: [
      ...gameState.moveHistory,
      move
    ],

    whiteTempo: tempoReward.whiteTempo,
    blackTempo: tempoReward.blackTempo,
    message: tempoReward.message
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