import type { GameState } from "./GameState";
import type { Move } from "./Move";

export function calculateTempoRewards(
  gameState: GameState,
  move: Move,
  isCheck: boolean
) {
  let amount = 0;
  const reasons: string[] = [];

  // Capture
  if (move.capturedPiece != null) {
    amount += 1;
    reasons.push("Capture");
  }

  // Castle
  if (
    move.piece.type === "king" &&
    Math.abs(move.from.charCodeAt(0) - move.to.charCodeAt(0)) === 2
  ) {
    amount += 2;
    reasons.push("Castling");
  }

  // Check (no back-to-back farming)
  if (
    isCheck &&
    gameState.lastCheckTempoAwardedTo !== gameState.currentTurn
  ) {
    amount += 1;
    reasons.push("Check");
  }

  return {
    amount,
    reasons
  };
}