import type { GameState } from "../chess/GameState";
import { freezePiece } from "./FreezeLogic";
import { placeBomb } from "./BombLogic";
import { applyMagnet } from "./MagnetLogic";
import { applyForcePush } from "./ForcePushLogic";
import { phasePiece } from "./PhasedLogic";
import { placeRock } from "./RockLogic";

export function useGun(
  gameState: GameState,
  targetSquare: string
): GameState {

  const newBoard = { ...gameState.board };

  delete newBoard[targetSquare];

  return {
    ...gameState,
    board: newBoard
  };
}

export function useFreeze(
  gameState: GameState,
  targetSquare: string
): GameState {

  const newBoard = { ...gameState.board };

  const targetPiece = newBoard[targetSquare];

  if (targetPiece) {
    newBoard[targetSquare] = freezePiece(targetPiece);
  }


return {
  ...gameState,
  board: newBoard
};
}

export function useBomb(
  gameState: GameState,
  selectedSquare: string
): GameState {

  const piece = gameState.board[selectedSquare];

  if (!piece) {
    return gameState;
  }

  const newBoard = {
    ...gameState.board,
    [selectedSquare]: placeBomb(piece)
  };


return {
  ...gameState,
  board: newBoard
};
}
export function useRoyalDecree(
  gameState: GameState
): GameState {

  return {
    ...gameState,
    royalDecreeActive: true
  };
}

export function useDash(
  gameState: GameState
): GameState {

  return {
    ...gameState,
    activeCheat: {
      ...gameState.activeCheat,
      dashActive: true,
      dashSecondMove: false
    }
  };
}

export function useMagnet(
  gameState: GameState,
  casterSquare: string,
  targetSquare: string,
  magnetMode: "pull" | "push"
): GameState {

  const newBoard = applyMagnet(
    gameState.board,
    gameState.terrain,
    casterSquare,
    targetSquare,
    magnetMode
  );


  return {
    ...gameState,
    board: newBoard.board,
    terrain: newBoard.terrain
  };
}

export function useForcePush(
  gameState: GameState,
  casterSquare: string
): GameState {

  const newBoard = applyForcePush(
    gameState.board,
    gameState.terrain,
    casterSquare
  );


  return {
    ...gameState,
    board: newBoard.board,
    terrain: newBoard.terrain
  };
}

export function usePhase(
  gameState: GameState,
  square: string
): GameState {

  const piece = gameState.board[square];

  if (!piece) {
    return gameState;
  }

  const newBoard = {
    ...gameState.board,
    [square]: phasePiece(piece)
  };


  return {
    ...gameState,
    board: newBoard,
    activeCheat: {
      ...gameState.activeCheat,
      phaseActive: true
    }
  };
}

export function useRock(
  gameState: GameState,
  targetSquare: string
): GameState {

  return placeRock(
    gameState,
    targetSquare
  );
}