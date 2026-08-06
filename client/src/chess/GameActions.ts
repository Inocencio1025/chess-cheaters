import type { GameState } from "./GameState";
import { getGameStatus, movePiece } from "./GameLogic";
import { endTurn } from "./TurnLogic";
import { calculateTempoRewards } from "./TempoLogic";
import { getCurrentOpening } from "./OpeningLogic";


export function makeMove(
  gameState: GameState,
  from: string,
  to: string,
  endPlayerTurn = true
): GameState {

  const result = movePiece(
    gameState.board,
    gameState.terrain,
    from,
    to
  );

  const move = result.move;

  const opening = getCurrentOpening([
    ...gameState.moveHistory,
    move
  ]);

  const openingReward =
    opening &&
      !gameState.openingTempoAwarded.includes(opening.name)
      ? opening.reward
      : 0;

  const responseBonus =
    opening &&
      !gameState.openingTempoAwarded.includes(opening.name) &&
      opening.responseBonus
      ? opening.responseBonus
      : 0;

  console.log("Opening:", opening);
  console.log(
    "Opening reward:",
    openingReward,
    "Response bonus:",
    responseBonus
  );
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

  const tempoReward = calculateTempoRewards(
    gameState,
    move,
    statusAfterMove === "check"
  );

  const totalTempo =
    tempoReward.amount +
    openingReward +
    responseBonus;

  console.log(
    "MOVE HISTORY:",
    [
      ...gameState.moveHistory,
      move
    ].map(move => `${move.from}-${move.to}`)
  );

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
          ...(responseBonus ? ["Response Bonus"] : [])].join(" + ")
        }`
        : "",

    lastCheckTempoAwardedTo:
      statusAfterMove === "check" &&
        tempoReward.reasons.includes("Check")
        ? gameState.currentTurn
        : gameState.lastCheckTempoAwardedTo,
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