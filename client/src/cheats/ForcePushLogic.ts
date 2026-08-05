import type { Board } from "../chess/Board";
import type { Piece } from "../chess/Piece";


export function applyForcePush(
  board: Board,
  terrain: Record<string, "rock" | null>,
  casterSquare: string
): {
  board: Board;
  terrain: Record<string, "rock" | null>;
} {

  const newBoard = { ...board };
  const newTerrain = { ...terrain };

  const casterFile = casterSquare.charCodeAt(0);
  const casterRank = Number(casterSquare[1]);


  const affectedSquares: string[] = [];
  const pushedPieces: {
    piece: Piece;
    from: string;
    to: string;
  }[] = [];


  for (let fileChange = -1; fileChange <= 1; fileChange++) {
    for (let rankChange = -1; rankChange <= 1; rankChange++) {

      if (fileChange === 0 && rankChange === 0) {
        continue;
      }


      const file =
        String.fromCharCode(casterFile + fileChange);

      const rank =
        casterRank + rankChange;


      if (
        file >= "A" &&
        file <= "H" &&
        rank >= 1 &&
        rank <= 8
      ) {
        affectedSquares.push(
          `${file}${rank}`
        );
      }
    }
  }


  for (const square of affectedSquares) {

    const piece = board[square];

    if (!piece) {
      continue;
    }


    // king immunity
    if (piece.type === "king") {
      continue;
    }


    const dx =
      Math.sign(
        square.charCodeAt(0) - casterFile
      );

    const dy =
      Math.sign(
        Number(square[1]) - casterRank
      );


    const destination = getPushDestination(
      square,
      dx,
      dy,
      newBoard
    );


    if (!destination) {
      continue;
    }


    // off board
    if (
      destination.charCodeAt(0) < "A".charCodeAt(0) ||
      destination.charCodeAt(0) > "H".charCodeAt(0) ||
      Number(destination[1]) < 1 ||
      Number(destination[1]) > 8
    ) {
      continue;
    }


    // blocked by piece
    if (newBoard[destination]) {
      continue;
    }

    // break rock
    if (newTerrain[destination] === "rock") {

      // bombed piece dies with the rock
      if (piece.hasBomb) {
        newBoard[square] = null;
      }

      newTerrain[destination] = null;
      continue;
    }

    pushedPieces.push({
      piece,
      from: square,
      to: destination
    });

    newBoard[destination] = piece;
    newBoard[square] = null;
  }

  return {
    board: newBoard,
    terrain: newTerrain
  };

}

function getPushDestination(
  square: string,
  dx: number,
  dy: number,
  board: Board
): string | null {

  const file = square.charCodeAt(0);
  const rank = Number(square[1]);


  const options = [
    [dx, dy], // normal diagonal/horizontal/vertical
    [0, dy],  // vertical fallback
    [dx, 0]   // horizontal fallback
  ];


  for (const [x, y] of options) {

    const newFile = file + x;
    const newRank = rank + y;


    if (
      newFile < "A".charCodeAt(0) ||
      newFile > "H".charCodeAt(0) ||
      newRank < 1 ||
      newRank > 8
    ) {
      continue;
    }


    const destination =
      `${String.fromCharCode(newFile)}${newRank}`;


    if (!board[destination]) {
      return destination;
    }
  }


  return null;
}