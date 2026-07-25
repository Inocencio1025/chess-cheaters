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
  whiteMomentum: number;
  blackMomentum: number;
  royalDecreeActive: boolean;
  gameOver: boolean;
  activePower: ActivePowerState;
  message: string;
}

export function createGameState(): GameState {
  return {
    board: createStartingBoard(),
    terrain: {},
    currentTurn: "white",
    moveHistory: [],
    status: "playing",
    whiteMomentum: 0,
    blackMomentum: 0,
    royalDecreeActive: false,
    gameOver: false,
    activePower: {
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
    whiteMomentum: 100,
    blackMomentum: 100,
    royalDecreeActive: false,
    gameOver: false,
    activePower: {
      dashActive: false,
      dashSecondMove: false,
      phaseActive: false
    },
    message: ""
  };
}

export type ActivePowerState = {
  dashActive: boolean;
  dashSecondMove: boolean;
  phaseActive: boolean;
};