import type { GameState } from "./GameState";
import { getGameStatus, movePiece } from "./GameLogic";
import { endTurn } from "./TurnLogic";
import { calculateTempoRewards } from "./TempoLogic";
import { getCurrentOpening } from "./OpeningLogic";
import { hasUnderdogBonus } from "./MaterialLogic";
import { playSound } from "../sounds/SoundManager";


export function makeMove(
  gameState: GameState,
  from: string,
  to: string,
  endPlayerTurn = true
): GameState {

  const OPENING_TEMPO_LIMIT = 5;

  const result = movePiece(
    gameState.board,
    gameState.terrain,
    from,
    to
  );

  const move = result.move;


  const isCastle =
    move.piece.type === "king" &&
    Math.abs(
      Number(from.charCodeAt(0)) -
      Number(to.charCodeAt(0))
    ) === 2;

  if (isCastle) {
    playSound("castle");
  } else if (move.capturedPiece) {
    playSound("capture");
  } else {
    playSound("move");
  }


  const currentTurnNumber =
    Math.floor(gameState.moveHistory.length / 2) + 1;

  const opening = getCurrentOpening([
    ...gameState.moveHistory,
    move
  ]);

  const openingReward =
    opening &&
      currentTurnNumber <= OPENING_TEMPO_LIMIT &&
      !gameState.openingTempoAwarded.includes(opening.name)
      ? opening.reward
      : 0;

  console.log("Opening:", opening);
  console.log("Opening reward:", openingReward);

  const statusAfterMove = getGameStatus(
    gameState.currentTurn === "white" ? "black" : "white",
    result.board,
    result.terrain,
    [
      ...gameState.moveHistory,
      move
    ],
    gameState.royalDecreeActive
  );

  if (statusAfterMove === "checkmate") {
    playSound("check");
    playSound("gameWin");
  } else if (statusAfterMove === "check") {
    playSound("check");
  }

  const tempoReward = calculateTempoRewards(
    gameState,
    move,
    statusAfterMove === "check"
  );

  const underdog = hasUnderdogBonus(
    gameState.capturedWhitePieces,
    gameState.capturedBlackPieces
  );

  const underdogBonus =
    underdog === gameState.currentTurn &&
      (tempoReward.amount + openingReward) > 0
      ? 1
      : 0;

  const totalTempo =
    tempoReward.amount +
    openingReward +
    underdogBonus;
  console.log(
    "MOVE HISTORY:",
    [
      ...gameState.moveHistory,
      move
    ].map(move => `${move.from}-${move.to}`)
  );

  if (totalTempo > 0) {
    playSound("tempoGain");
  }

  const stateAfterMove = {
    ...gameState,
    openingTempoAwarded:
      opening && openingReward
        ? [
          ...gameState.openingTempoAwarded,
          opening.name
        ]
        : gameState.openingTempoAwarded,
    board: result.board,
    terrain: result.terrain,
    moveHistory: [
      ...gameState.moveHistory,
      move
    ],

    whiteTempo:
      gameState.currentTurn === "white"
        ? gameState.whiteTempo + totalTempo
        : gameState.whiteTempo,

    blackTempo:
      gameState.currentTurn === "black"
        ? gameState.blackTempo + totalTempo
        : gameState.blackTempo,

    message:
      totalTempo > 0
        ? `+${totalTempo} Tempo: ${[
          ...tempoReward.reasons,
          ...(openingReward ? [opening!.name] : []),
          ...(underdogBonus ? ["Underdog"] : [])
        ].join(" + ")
        }`
        : "",

    lastCheckTempoAwardedTo:
      statusAfterMove === "check" &&
        tempoReward.reasons.includes("Check")
        ? gameState.currentTurn
        : gameState.lastCheckTempoAwardedTo,

    capturedWhitePieces:
      move.capturedPiece?.color === "white"
        ? [
          ...gameState.capturedWhitePieces,
          move.capturedPiece
        ]
        : gameState.capturedWhitePieces,

    capturedBlackPieces:
      move.capturedPiece?.color === "black"
        ? [
          ...gameState.capturedBlackPieces,
          move.capturedPiece
        ]
        : gameState.capturedBlackPieces,
  };

  if (!endPlayerTurn) {
    return stateAfterMove;
  }

  const finalState = endTurn(
    stateAfterMove,
    result.board,
    stateAfterMove.moveHistory
  );

  return {
    ...finalState,
    message: stateAfterMove.message
  };
}