import type { Piece } from "./Piece";

export interface Move {
  from: string;
  to: string;
  piece: Piece;
  capturedPiece?: Piece | null;
  previousHasMoved: boolean;
  isDoublePawnMove: boolean;
  isEnPassant?: boolean;
}