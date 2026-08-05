import type { Board } from "../chess/Board";
import type { GameState } from "../chess/GameState";
import type { Piece } from "../chess/Piece";

export function getMagnetTargets(
  square: string,
  gameState: GameState
): string[] {

  const file = square.charCodeAt(0);
  const rank = Number(square[1]);

  const targets: string[] = [];

  const directions = [
    [0, 1],   // up
    [0, -1],  // down
    [1, 0],   // right
    [-1, 0]   // left
  ];


  for (const [fileChange, rankChange] of directions) {

    const newFile =
      String.fromCharCode(file + fileChange);

    const newRank =
      rank + rankChange;


    const target = `${newFile}${newRank}`;


    if (
      newFile >= "A" &&
      newFile <= "H" &&
      newRank >= 1 &&
      newRank <= 8
    ) {
      targets.push(target);
    }
  }


  return targets;
}


export function applyMagnet(
  board: Board,
  terrain: Record<string, "rock" | null>,
  casterSquare: string,
  directionSquare: string,
  magnetMode: "pull" | "push"
): {
  board: Board;
  terrain: Record<string, "rock" | null>;
  movedPieces: {
    piece: Piece;
    from: string;
    to: string;
  }[];
} {

  const newBoard = { ...board };
  const newTerrain = { ...terrain };


  const fileDelta =
    directionSquare.charCodeAt(0) -
    casterSquare.charCodeAt(0);

  const rankDelta =
    Number(directionSquare[1]) -
    Number(casterSquare[1]);


  // Find the direction (-1, 0, 1)
  const dx = Math.sign(fileDelta);
  const dy = Math.sign(rankDelta);


  const pieces: string[] = [];
  const movedPieces: {
    piece: Piece;
    from: string;
    to: string;
  }[] = [];

  // Start one square away from caster
  let file = casterSquare.charCodeAt(0) + dx;
  let rank = Number(casterSquare[1]) + dy;


  while (
    file >= "A".charCodeAt(0) &&
    file <= "H".charCodeAt(0) &&
    rank >= 1 &&
    rank <= 8
  ) {

    const square =
      `${String.fromCharCode(file)}${rank}`;


    if (board[square]) {
      pieces.push(square);
    }


    file += dx;
    rank += dy;
  }


  const directionMultiplier =
    magnetMode === "pull" ? -1 : 1;


  // Pull: closest → farthest
  // Push: farthest → closest
  const orderedPieces =
    magnetMode === "pull"
      ? pieces
      : [...pieces].reverse();


  for (const square of orderedPieces) {

    const destination =
      `${String.fromCharCode(
        square.charCodeAt(0) + (dx * directionMultiplier)
      )}${Number(square[1]) + (dy * directionMultiplier)}`;

    const destinationFile = destination.charCodeAt(0);
    const destinationRank = Number(destination[1]);

    if (
      destinationFile < "A".charCodeAt(0) ||
      destinationFile > "H".charCodeAt(0) ||
      destinationRank < 1 ||
      destinationRank > 8
    ) {
      continue;
    }
    if (newBoard[destination]) {
      continue;
    }


    if (newTerrain[destination] === "rock") {
      newTerrain[destination] = null;
    }

    if (newBoard[square]) {
      movedPieces.push({
        piece: newBoard[square]!,
        from: square,
        to: destination
      });
    }

    newBoard[destination] = newBoard[square];
    newBoard[square] = null;
  }


  return {
    board: newBoard,
    terrain: newTerrain,
    movedPieces
  };
}