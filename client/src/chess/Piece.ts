export type Color = "white" | "black";

export type Piece = {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  color: Color;
  hasMoved: boolean;
  freezeTurns: number;
  hasBomb: boolean;
  isPhased: boolean;
};