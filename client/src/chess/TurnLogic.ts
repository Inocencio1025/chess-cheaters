import type { Color } from "./Piece";
import type { GameState } from "./GameState";
import { getGameStatus } from "./GameLogic";
import { updateFreezeTurns } from "../cheats/FreezeLogic";
import { removePhase } from "../cheats/PhasedLogic";

export function getNextTurn(currentTurn: Color): Color {
  return currentTurn === "white"
    ? "black"
    : "white";
}

export function endTurn(
  gameState: GameState,
  board: GameState["board"],
  history = gameState.moveHistory
): GameState {

  const nextTurn = getNextTurn(
    gameState.currentTurn
  );

  let updatedBoard = updateFreezeTurns(
    board
  );

  updatedBoard = removePhase(
    updatedBoard
  );

  const status = getGameStatus(
    nextTurn,
    updatedBoard,
    gameState.terrain,
    history,
    gameState.royalDecreeActive
  );

  //console.log("Tempo message:", gameState.message);

  return {
    ...gameState,
    board: updatedBoard,
    currentTurn: nextTurn,
    status,
    gameOver:
      status === "checkmate" ||
      status === "stalemate",
    royalDecreeActive: false,
    activeCheat: {
      dashActive: false,
      dashSecondMove: false,
      phaseActive: false
    }
  };
}