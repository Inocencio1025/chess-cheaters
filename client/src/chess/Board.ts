import type { Piece } from "./Piece";

export type Board = Record<string, Piece | null>;

function createPiece(
  type: Piece["type"],
  color: Piece["color"]
): Piece {
  return {
    type,
    color,
    hasMoved: false,
    freezeTurns: 0,
    hasBomb: false,
    isPhased: false
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
    // White
    E1: createPiece("king", "white"),
    D1: createPiece("queen", "white"),
    A1: createPiece("rook", "white"),
    F1: createPiece("rook", "white"),

    C4: createPiece("bishop", "white"),
    G2: createPiece("bishop", "white"),

    C3: createPiece("knight", "white"),
    F3: createPiece("knight", "white"),

    A2: createPiece("pawn", "white"),
    B2: createPiece("pawn", "white"),
    C2: createPiece("pawn", "white"),
    D4: createPiece("pawn", "white"),
    E4: createPiece("pawn", "white"),
    F2: createPiece("pawn", "white"),
    G3: createPiece("pawn", "white"),
    H2: createPiece("pawn", "white"),

    // Black
    E8: createPiece("king", "black"),
    D8: createPiece("queen", "black"),
    A8: createPiece("rook", "black"),
    F8: createPiece("rook", "black"),

    C5: createPiece("bishop", "black"),
    G7: createPiece("bishop", "black"),

    C6: createPiece("knight", "black"),
    F6: createPiece("knight", "black"),

    A7: createPiece("pawn", "black"),
    B7: createPiece("pawn", "black"),
    C7: createPiece("pawn", "black"),
    D5: createPiece("pawn", "black"),
    E5: createPiece("pawn", "black"),
    F7: createPiece("pawn", "black"),
    G6: createPiece("pawn", "black"),
    H7: createPiece("pawn", "black"),
  };
}