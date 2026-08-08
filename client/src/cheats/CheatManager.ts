import type { GameState } from "../chess/GameState";
import type { Piece } from "../chess/Piece";
import { getGunTargets } from "./GunLogic";
import { getFreezeTargets } from "./FreezeLogic";
import { useGun, useFreeze, useBomb, useRoyalDecree, useDash, useMagnet, usePhase, useForcePush, useRock } from "./CheatHandlers";
import { getMagnetTargets } from "./MagnetLogic";
import { isKingInCheck } from "../chess/AttackLogic";
import { endTurn } from "../chess/TurnLogic";
import { getLegalMoves } from "../chess/MoveLogic";
import { playSound } from "../sounds/SoundManager";

export const cheats = [
  {
    id: "gun",
    name: "Gun",
    icon: "🔫",
    cost: 2,
    description: "Attack from a distance without leaving your square."
  },
  {
    id: "bomb",
    name: "Bomb",
    icon: "💣",
    cost: 3,
    description: "Attach a bomb to a piece. Any contact with another piece destroys both."
  },
  {
    id: "freeze",
    name: "Freeze",
    icon: "❄️",
    cost: 3,
    description: "Freeze an enemy piece, preventing it from moving temporarily."
  },
  {
    id: "dash",
    name: "Dash",
    icon: "⚡",
    cost: 4,
    description: "Move a piece twice in one turn, but the second move cannot capture."
  },
  {
    id: "phase",
    name: "Phase",
    icon: "👻",
    cost: 3,
    description: "Move through pieces and obstacles, but cannot capture while phased."
  },
  {
    id: "magnet",
    name: "Magnet",
    icon: "🧲",
    cost: 3,
    description: "Push or pull pieces in a chosen direction."
  },
  {
    id: "force-push",
    name: "Force Push",
    icon: "💨",
    cost: 4,
    description: "Repel nearby pieces away from your king with a powerful force."
  },
  {
    id: "rock",
    name: "Rock",
    icon: "🪨",
    cost: 4,
    description: "Place an obstacle on the board that blocks movement."
  },
  {
    id: "royal-decree",
    name: "Royal Decree",
    icon: "👑",
    cost: 4,
    description: "For one turn, your king gains the movement of a queen."
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
      playSound("gun");
      newState = useGun(
        stateAfterCost,
        targetSquare
      );
      break;

    case "freeze":
      playSound("freeze");
      newState = useFreeze(
        stateAfterCost,
        targetSquare
      );
      break;

    case "bomb":
      playSound("bomb");
      newState = useBomb(
        stateAfterCost,
        targetSquare
      );
      break;

    case "royal-decree":
      playSound("royalDecreeActivation");
      newState = useRoyalDecree(
        stateAfterCost
      );
      break;

    case "dash":
      playSound("dashActivation");
      newState = useDash(
        stateAfterCost,
        casterSquare!
      );
      break;

    case "magnet":
      playSound("magnet");
      newState = useMagnet(
        stateAfterCost,
        casterSquare!,
        targetSquare,
        magnetMode!
      );
      break;

    case "force-push":
      playSound("forcePush");
      newState = useForcePush(
        stateAfterCost,
        casterSquare!
      );
      break;

    case "rock":
      playSound("rock");
      newState = useRock(
        stateAfterCost,
        targetSquare
      );
      break;

    case "phase":
      playSound("phaseActivation");
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

  if (
    cheat === "phase" ||
    cheat === "royal-decree" ||
    cheat === "dash"
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
        newState,
        square
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
