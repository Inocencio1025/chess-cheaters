import type { Piece } from "../chess/Piece";

import whitePawn from "../assets/pieces/white/pawn.svg";
import whiteRook from "../assets/pieces/white/rook.svg";
import whiteKnight from "../assets/pieces/white/knight.svg";
import whiteBishop from "../assets/pieces/white/bishop.svg";
import whiteQueen from "../assets/pieces/white/queen.svg";
import whiteKing from "../assets/pieces/white/king.svg";

import blackPawn from "../assets/pieces/black/pawn.svg";
import blackRook from "../assets/pieces/black/rook.svg";
import blackKnight from "../assets/pieces/black/knight.svg";
import blackBishop from "../assets/pieces/black/bishop.svg";
import blackQueen from "../assets/pieces/black/queen.svg";
import blackKing from "../assets/pieces/black/king.svg";


const images = {
  white: {
    pawn: whitePawn,
    rook: whiteRook,
    knight: whiteKnight,
    bishop: whiteBishop,
    queen: whiteQueen,
    king: whiteKing,
  },
  black: {
    pawn: blackPawn,
    rook: blackRook,
    knight: blackKnight,
    bishop: blackBishop,
    queen: blackQueen,
    king: blackKing,
  },
};


export default function PieceImage({ piece }: { piece: Piece }) {
  return (
    <img
      src={images[piece.color][piece.type]}
      className="piece-image"
    />
  );
}