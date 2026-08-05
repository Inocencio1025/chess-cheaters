import type { GameState } from "./GameState";

export function rewardCaptureTempo(
  gameState: GameState,
  captured: boolean
): Pick<GameState, "whiteTempo" | "blackTempo" | "message"> {

  if (!captured) {
    return {
      whiteTempo: gameState.whiteTempo,
      blackTempo: gameState.blackTempo,
      message: ""
    };
  }

  return {
    whiteTempo:
      gameState.currentTurn === "white"
        ? gameState.whiteTempo + 1
        : gameState.whiteTempo,

    blackTempo:
      gameState.currentTurn === "black"
        ? gameState.blackTempo + 1
        : gameState.blackTempo,

    message: "+1 Tempo: Capture"
  };
}