import type { Board } from "../chess/Board";
import type { Piece } from "../chess/Piece";


export function phasePiece(piece: Piece): Piece {
  return {
    ...piece,
    isPhased: true
  };
}


export function removePhase(board: Board): Board {

  const newBoard = { ...board };


  for (const square in newBoard) {

    const piece = newBoard[square];

    if (piece?.isPhased) {
      newBoard[square] = {
        ...piece,
        isPhased: false
      };
    }
  }


  return newBoard;
}