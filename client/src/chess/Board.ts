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

function createEmptyBoard(): Board {
  const board = {} as Board;

  for (const file of ["A", "B", "C", "D", "E", "F", "G", "H"]) {
    for (let rank = 1; rank <= 8; rank++) {
      board[`${file}${rank}`] = null;
    }
  }

  return board;
}

export function createStartingBoard(): Board {
  const board = createEmptyBoard();

  board.A1 = createPiece("rook", "white");
  board.B1 = createPiece("knight", "white");
  board.C1 = createPiece("bishop", "white");
  board.D1 = createPiece("queen", "white");
  board.E1 = createPiece("king", "white");
  board.F1 = createPiece("bishop", "white");
  board.G1 = createPiece("knight", "white");
  board.H1 = createPiece("rook", "white");

  board.A2 = createPiece("pawn", "white");
  board.B2 = createPiece("pawn", "white");
  board.C2 = createPiece("pawn", "white");
  board.D2 = createPiece("pawn", "white");
  board.E2 = createPiece("pawn", "white");
  board.F2 = createPiece("pawn", "white");
  board.G2 = createPiece("pawn", "white");
  board.H2 = createPiece("pawn", "white");

  board.A8 = createPiece("rook", "black");
  board.B8 = createPiece("knight", "black");
  board.C8 = createPiece("bishop", "black");
  board.D8 = createPiece("queen", "black");
  board.E8 = createPiece("king", "black");
  board.F8 = createPiece("bishop", "black");
  board.G8 = createPiece("knight", "black");
  board.H8 = createPiece("rook", "black");

  board.A7 = createPiece("pawn", "black");
  board.B7 = createPiece("pawn", "black");
  board.C7 = createPiece("pawn", "black");
  board.D7 = createPiece("pawn", "black");
  board.E7 = createPiece("pawn", "black");
  board.F7 = createPiece("pawn", "black");
  board.G7 = createPiece("pawn", "black");
  board.H7 = createPiece("pawn", "black");

  return board;
}

export function createTestBoard(): Board {
  const board = createEmptyBoard();
  // White
  board.E1 = createPiece("king", "white");
  board.D1 = createPiece("queen", "white");
  board.A1 = createPiece("rook", "white");
  board.F1 = createPiece("rook", "white");

  board.C4 = createPiece("bishop", "white");
  board.G2 = createPiece("bishop", "white");

  board.C3 = createPiece("knight", "white");
  board.F3 = createPiece("knight", "white");

  board.A2 = createPiece("pawn", "white");
  board.B2 = createPiece("pawn", "white");
  board.C2 = createPiece("pawn", "white");
  board.D4 = createPiece("pawn", "white");
  board.E4 = createPiece("pawn", "white");
  board.F2 = createPiece("pawn", "white");
  board.G3 = createPiece("pawn", "white");
  board.H2 = createPiece("pawn", "white");

  // Black
  board.E8 = createPiece("king", "black");
  board.D8 = createPiece("queen", "black");
  board.A8 = createPiece("rook", "black");
  board.F8 = createPiece("rook", "black");

  board.C5 = createPiece("bishop", "black");
  board.G7 = createPiece("bishop", "black");

  board.C6 = createPiece("knight", "black");
  board.F6 = createPiece("knight", "black");

  board.A7 = createPiece("pawn", "black");
  board.B7 = createPiece("pawn", "black");
  board.C7 = createPiece("pawn", "black");
  board.D5 = createPiece("pawn", "black");
  board.E5 = createPiece("pawn", "black");
  board.F7 = createPiece("pawn", "black");
  board.G6 = createPiece("pawn", "black");
  board.H7 = createPiece("pawn", "black");

  return board;
}