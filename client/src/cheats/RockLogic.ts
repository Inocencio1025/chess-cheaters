import type { GameState } from "../chess/GameState";

export function placeRock(
  gameState: GameState,
  square: string
): GameState {

  return {
    ...gameState,
    terrain: {
      ...gameState.terrain,
      [square]: "rock"
    }
  };
}


export function removeRock(
  gameState: GameState,
  square: string
): GameState {

  const newTerrain = {
    ...gameState.terrain
  };

  delete newTerrain[square];

  return {
    ...gameState,
    terrain: newTerrain
  };
}


export function hasRock(
  gameState: GameState,
  square: string
): boolean {

  return gameState.terrain[square] === "rock";
}