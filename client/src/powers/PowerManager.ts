import type { GameState } from "../chess/GameState";
import type { Piece } from "../chess/Piece";
import { getGunTargets } from "./GunLogic";
import { getFreezeTargets } from "./FreezeLogic";
import { useGun, useFreeze, useBomb, useRoyalDecree, useDash, useMagnet, usePhase, useForcePush, useRock } from "./PowerHandlers";
import { getMagnetTargets } from "./MagnetLogic";
import { isKingInCheck } from "../chess/AttackLogic";
import { endTurn } from "../chess/TurnLogic";
import { applyForcePush } from "./ForcePushLogic";
import { getLegalMoves } from "../chess/MoveLogic";

export const powers = [
  {
    id: "gun",
    name: "Gun",
    cost: 2
  },
  {
    id: "freeze",
    name: "Freeze",
    cost: 3
  },
  {
    id: "bomb",
    name: "Bomb",
    cost: 3
  },
  {
    id: "phase",
    name: "Phase",
    cost: 3
  },
  {
    id: "magnet",
    name: "Magnet",
    cost: 3
  },
  {
    id: "royal-decree",
    name: "Royal Decree",
    cost: 4
  },
  {
    id: "dash",
    name: "Dash",
    cost: 4
  },
  {
    id: "force-push",
    name: "Force Push",
    cost: 4
  },
  {
    id: "rock",
    name: "Rock",
    cost: 4
  }

] as const;

export type PowerType = typeof powers[number]["id"];


export function executePower(
  power: PowerType,
  gameState: GameState,
  targetSquare: string,
  casterSquare?: string,
  magnetMode?: "pull" | "push",
): GameState {


  let stateAfterCost = spendMomentum(
    gameState,
    getPowerCost(power)
  );


  let newState: GameState = gameState;

  switch (power) {

    case "gun":
      newState = useGun(
        stateAfterCost,
        targetSquare
      );
      break;

    case "freeze":
      newState = useFreeze(
        stateAfterCost,
        targetSquare
      );
      break;

    case "bomb":
      newState = useBomb(
        stateAfterCost,
        targetSquare
      );
      break;

    case "royal-decree":
      newState = useRoyalDecree(
        stateAfterCost
      );
      break;

    case "dash":
      newState = useDash(
        stateAfterCost
      );
      break;

    case "magnet":
      newState = useMagnet(
        stateAfterCost,
        casterSquare!,
        targetSquare,
        magnetMode!
      );
      break;

    case "force-push":
      newState = useForcePush(
        stateAfterCost,
        casterSquare!
      );
      break;

    case "rock":
      newState = useRock(
        stateAfterCost,
        targetSquare
      );
      break;

    case "phase":
      newState = usePhase(
        stateAfterCost,
        targetSquare
      );
      break;
  }

  

  if (
    isKingInCheck(
      gameState.currentTurn,
      newState.board,
      newState.terrain
    )
  ) {
    return {
      ...gameState,
      message: "Cannot use power: king would be in check"
    }
  }


  console.log(
    "before:",
    gameState.whiteMomentum,
    "after cost:",
    stateAfterCost.whiteMomentum
  );

  if (
    power === "phase" ||
    power === "royal-decree"
  ) {
    return newState;
  }

  return endTurn(
    newState,
    newState.board,
    newState.moveHistory
  );
}

export function preparePower(
  power: PowerType,
  gameState: GameState,
  square: string
): GameState {

  const cost = getPowerCost(power);

  let newState = spendMomentum(
    gameState,
    cost
  );

  switch (power) {
    case "dash":
      return useDash(
        newState
      );

    default:
      return gameState;
  }
}

export function getPowerTargets(
  power: PowerType,
  piece: Piece,
  square: string,
  gameState: GameState
): string[] {

  switch (power) {

    case "gun":
      return getGunTargets(
        piece,
        square,
        gameState.board,
        gameState.moveHistory,
        gameState.terrain
      );

    case "freeze":
      return getFreezeTargets(
        piece.color,
        gameState.board
      );

    case "bomb":
      return [
        square
      ];

    case "magnet":
      return getMagnetTargets(
        square,
        gameState
      );

    case "phase":

      const phasedPiece = {
        ...piece,
        isPhased: true
      };

      return getLegalMoves(
        phasedPiece,
        square,
        gameState.board,
        gameState.terrain,
        gameState.moveHistory,
        gameState.royalDecreeActive,
      );

    case "rock":
      return Object.keys(gameState.board).filter(
        target =>
          !gameState.board[target] &&
          !gameState.terrain[target]
      );

  }
  return [];
}

export function getPowerCost(power: PowerType): number {
  return powers.find(p => p.id === power)!.cost;
}

function spendMomentum(
  gameState: GameState,
  cost: number
): GameState {

  if (gameState.currentTurn === "white") {
    return {
      ...gameState,
      whiteMomentum: gameState.whiteMomentum - cost
    };
  }

  return {
    ...gameState,
    blackMomentum: gameState.blackMomentum - cost
  };
}
