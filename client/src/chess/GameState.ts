import { createStartingBoard, createTestBoard } from "./Board";
import type { Board } from "./Board";
import type { Move } from "./Move";

export type GameStatus =
  | "playing"
  | "check"
  | "checkmate"
  | "stalemate";

export type Color = "white" | "black";
export type Terrain = "rock";

export interface GameState {
  board: Board;
  terrain: Record<string, Terrain | null>;
  currentTurn: Color;
  moveHistory: Move[];
  status: GameStatus;
  whiteTempo: number;
  blackTempo: number;
  royalDecreeActive: boolean;
  gameOver: boolean;
  activeCheat: ActiveCheatState;
  message: string;
}

export function createGameState(): GameState {
  return {
    board: createStartingBoard(),
    terrain: {},
    currentTurn: "white",
    moveHistory: [],
    status: "playing",
    whiteTempo: 0,
    blackTempo: 0,
    royalDecreeActive: false,
    gameOver: false,
    activeCheat: {
      dashActive: false,
      dashSecondMove: false,
      phaseActive: false
    },
    message: ""
  };
}

export function createTestGameState(): GameState {
  return {
    board: createTestBoard(),
    terrain: {},
    currentTurn: "white",
    moveHistory: [],
    status: "playing",
    whiteTempo: 100,
    blackTempo: 100,
    royalDecreeActive: false,
    gameOver: false,
    activeCheat: {
      dashActive: false,
      dashSecondMove: false,
      phaseActive: false
    },
    message: ""
  };
}

export type ActiveCheatState = {
  dashActive: boolean;
  dashSecondMove: boolean;
  phaseActive: boolean;
};