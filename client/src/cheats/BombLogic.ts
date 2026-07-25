import type { Piece } from "../chess/Piece";

export function placeBomb(piece: Piece) {
  return {
    ...piece,
    hasBomb: true
  };
}