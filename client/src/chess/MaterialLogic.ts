import type { Piece } from "./Piece";

function getPieceValue(piece: Piece): number {
  switch (piece.type) {
    case "pawn":
      return 1;
    case "knight":
    case "bishop":
      return 3;
    case "rook":
      return 5;
    case "queen":
      return 9;
    default:
      return 0;
  }
}

export function getMaterialValue(pieces: Piece[]): number {
  return pieces.reduce(
    (total, piece) => total + getPieceValue(piece),
    0
  );
}

export function hasUnderdogBonus(
  whiteCaptured: Piece[],
  blackCaptured: Piece[]
): "white" | "black" | null {

  const whiteLost = getMaterialValue(whiteCaptured);
  const blackLost = getMaterialValue(blackCaptured);

  if (whiteLost - blackLost >= 5) {
    return "white";
  }

  if (blackLost - whiteLost >= 5) {
    return "black";
  }

  return null;
}