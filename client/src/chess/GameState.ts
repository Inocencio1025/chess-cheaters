import { createStartingBoard } from "./Board";
import type { Board } from "./Board";
import type { Move } from "./Move";

export type GameStatus =
  | "playing"
  | "check"
  | "checkmate"
  | "stalemate";

export type Color = "white" | "black";

export interface GameState {
  board: Board;
  currentTurn: Color;
  moveHistory: Move[];
  status: GameStatus;
  gameOver: boolean;
}

export function createGameState(): GameState {
  return {
    board: createStartingBoard(),
    currentTurn: "white",
    moveHistory: [],
    status: "playing",
    gameOver: false
  };
}