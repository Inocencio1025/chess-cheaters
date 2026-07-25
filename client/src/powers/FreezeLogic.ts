import type { Piece } from "../chess/Piece";

export function getFreezeTargets(
  color: "white" | "black",
  board: Record<string, Piece | null>
) {
  return Object.keys(board).filter(square => {
    const target = board[square];

    return target !== null &&
      target.color !== color;
  });
}

export function freezePiece(piece: Piece) {
  return {
    ...piece,
    freezeTurns: 4
  };
}

export function updateFreezeTurns(board: Record<string, Piece | null>) {
  const newBoard = { ...board };

  for (const square in newBoard) {
    const piece = newBoard[square];

    if (piece && piece.freezeTurns > 0) {
      newBoard[square] = {
        ...piece,
        freezeTurns: piece.freezeTurns - 1
      };
    }
  }

  return newBoard;
}