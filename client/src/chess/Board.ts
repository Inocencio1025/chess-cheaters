import type { Piece } from "./Piece";

export type Board = Record<string, Piece | null>;

function createPiece(
  type: Piece["type"],
  color: Piece["color"]
): Piece {
  return {
    type,
    color,
    hasMoved: false
  };
}

export function createStartingBoard(): Board {
  return {
    A1: createPiece("rook", "white"),
    B1: createPiece("knight", "white"),
    C1: createPiece("bishop", "white"),
    D1: createPiece("queen", "white"),
    E1: createPiece("king", "white"),
    F1: createPiece("bishop", "white"),
    G1: createPiece("knight", "white"),
    H1: createPiece("rook", "white"),

    A2: createPiece("pawn", "white"),
    B2: createPiece("pawn", "white"),
    C2: createPiece("pawn", "white"),
    D2: createPiece("pawn", "white"),
    E2: createPiece("pawn", "white"),
    F2: createPiece("pawn", "white"),
    G2: createPiece("pawn", "white"),
    H2: createPiece("pawn", "white"),

    A8: createPiece("rook", "black"),
    B8: createPiece("knight", "black"),
    C8: createPiece("bishop", "black"),
    D8: createPiece("queen", "black"),
    E8: createPiece("king", "black"),
    F8: createPiece("bishop", "black"),
    G8: createPiece("knight", "black"),
    H8: createPiece("rook", "black"),

    A7: createPiece("pawn", "black"),
    B7: createPiece("pawn", "black"),
    C7: createPiece("pawn", "black"),
    D7: createPiece("pawn", "black"),
    E7: createPiece("pawn", "black"),
    F7: createPiece("pawn", "black"),
    G7: createPiece("pawn", "black"),
    H7: createPiece("pawn", "black"),
  };
}

export function createTestBoard(): Board {
  return {
    A1: createPiece("rook", "white"),
    D1: createPiece("queen", "white"),
    E1: createPiece("king", "white"),
    H1: createPiece("rook", "white"),

    A8: createPiece("rook", "black"),
    D8: createPiece("queen", "black"),
    E8: createPiece("king", "black"),
    H8: createPiece("rook", "black"),  };
}