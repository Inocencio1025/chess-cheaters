import type { Move } from "./Move";
import { openings } from "./Openings";


function moveToKey(move: Move): string {
  return `${move.from}-${move.to}`;
}


export function getCurrentOpening(
  moveHistory: Move[]
): {
  name: string;
  type: "setup" | "opening";
  reward: number;
} | null {

  const whiteMoves = moveHistory
    .filter(move => move.piece.color === "white")
    .map(moveToKey);

  const blackMoves = moveHistory
    .filter(move => move.piece.color === "black")
    .map(moveToKey);

  //console.log("White moves:", whiteMoves);
  //console.log("Black moves:", blackMoves);

  let bestMatch: {
    name: string;
    type: "setup" | "opening";
    reward: number;
  } | null = null;

  let longestMatch = 0;

  for (const opening of openings) {

    const playerMoves =
      opening.color === "white"
        ? whiteMoves
        : blackMoves;


    let moveIndex = 0;

    const matches = opening.moves.every(openingMove => {

      while (moveIndex < playerMoves.length) {

        if (playerMoves[moveIndex] === openingMove) {
          moveIndex++;
          return true;
        }

        moveIndex++;
      }

      return false;
    });

    const lastMoveColor =
  moveHistory[moveHistory.length - 1].piece.color;

if (
  matches &&
  opening.color === lastMoveColor &&
  opening.moves.length > longestMatch
)      
      {
      bestMatch = {
        name: opening.name,
        type: opening.type,
        reward: opening.reward
      };

      longestMatch = opening.moves.length;
    }
  }

  return bestMatch;
}