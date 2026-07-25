import type { GameState } from "../chess/GameState";
import type { Piece } from "../chess/Piece";
import { getGunTargets } from "./GunLogic";
import { getFreezeTargets } from "./FreezeLogic";
import { useGun, useFreeze, useBomb, useRoyalDecree, useDash, useMagnet, usePhase, useForcePush, useRock } from "./CheatHandlers";
import { getMagnetTargets } from "./MagnetLogic";
import { isKingInCheck } from "../chess/AttackLogic";
import { endTurn } from "../chess/TurnLogic";
import { getLegalMoves } from "../chess/MoveLogic";

export const cheats = [
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

export type CheatType = typeof cheats[number]["id"];


export function executeCheat(
  cheat: CheatType,
  gameState: GameState,
  targetSquare: string,
  casterSquare?: string,
  magnetMode?: "pull" | "push",
): GameState {


  let stateAfterCost = spendTempo(
    gameState,
    getCheatCost(cheat)
  );


  let newState: GameState = gameState;

  switch (cheat) {

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
      message: "Cannot use cheat: king would be in check"
    }
  }


  console.log(
    "before:",
    gameState.whiteTempo,
    "after cost:",
    stateAfterCost.whiteTempo
  );

  if (
    cheat === "phase" ||
    cheat === "royal-decree"
  ) {
    return newState;
  }

  return endTurn(
    newState,
    newState.board,
    newState.moveHistory
  );
}

export function prepareCheat(
  cheat: CheatType,
  gameState: GameState,
  square: string
): GameState {

  const cost = getCheatCost(cheat);

  let newState = spendTempo(
    gameState,
    cost
  );

  switch (cheat) {
    case "dash":
      return useDash(
        newState
      );

    default:
      return gameState;
  }
}

export function getCheatTargets(
  cheat: CheatType,
  piece: Piece,
  square: string,
  gameState: GameState
): string[] {

  switch (cheat) {

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

export function getCheatCost(cheat: CheatType): number {
  return cheats.find(p => p.id === cheat)!.cost;
}

function spendTempo(
  gameState: GameState,
  cost: number
): GameState {

  if (gameState.currentTurn === "white") {
    return {
      ...gameState,
      whiteTempo: gameState.whiteTempo - cost
    };
  }

  return {
    ...gameState,
    blackTempo: gameState.blackTempo - cost
  };
}
