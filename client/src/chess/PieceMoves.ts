import type { Board } from "./Board";
import type { Move } from "./Move";
import type { Piece } from "./Piece";
import { notationToPosition, positionToNotation, type Position } from "./Position";
import { getCastleMoves } from "./SpecialMoves";

export function getValidPawnMoves(
  piece: Piece,
  position: Position,
  board: Board,
  moveHistory: Move[]
): string[] {
  const moves: string[] = [];

  const file = position.file;
  const rank = position.rank;

  const direction = piece.color === "white" ? 1 : -1;

  const oneForward = positionToNotation({
    file,
    rank: rank + direction
  });

  if (!board[oneForward]) {
    moves.push(oneForward);

    if (!piece.hasMoved) {
      const twoForward = positionToNotation({
        file,
        rank: rank + (2 * direction)
      });

      if (!board[twoForward]) {
        moves.push(twoForward);
      }
    }
  }

  const diagonal1 = positionToNotation({
    file: file + 1,
    rank: rank + direction
  });

  const diagonal2 = positionToNotation({
    file: file - 1,
    rank: rank + direction
  });

  if (board[diagonal1]) {
    if (board[diagonal1].color !== piece.color) {
      moves.push(diagonal1);
    }
  }

  if (board[diagonal2]) {
    if (board[diagonal2].color !== piece.color) {
      moves.push(diagonal2);
    }
  }


  // En passant
  const lastMove = moveHistory[moveHistory.length - 1];

  if (
    lastMove &&
    lastMove.piece.type === "pawn" &&
    lastMove.isDoublePawnMove
  ) {
    const lastPawnSquare = lastMove.to;
    const lastPawn = board[lastPawnSquare];

    if (
      lastPawn &&
      lastPawn.color !== piece.color
    ) {
      const lastPawnPosition = notationToPosition(lastPawnSquare);

      // Enemy pawn must be beside this pawn
      if (
        Math.abs(lastPawnPosition.file - file) === 1 &&
        lastPawnPosition.rank === rank
      ) {
        const captureSquare = positionToNotation({
          file: lastPawnPosition.file,
          rank: rank + direction
        });

        moves.push(captureSquare);
      }
    }
  }


  return moves;
}

export function getPawnAttackSquares(
  piece: Piece,
  position: Position
): string[] {
  const direction = piece.color === "white" ? 1 : -1;

  return [
    positionToNotation({
      file: position.file + 1,
      rank: position.rank + direction
    }),
    positionToNotation({
      file: position.file - 1,
      rank: position.rank + direction
    })
  ];
}

export function getValidRookMoves(
  piece: Piece,
  position: Position,
  board: Board
): string[] {
  return getSlidingMoves(
    piece,
    position,
    board,
    [
      [1, 0],  // right
      [-1, 0], // left
      [0, 1],  // up
      [0, -1]  // down
    ]
  );
}


export function getValidKnightMoves(
  piece: Piece,
  position: Position,
  board: Board
): string[] {
  const knightOffsets = [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2]
  ];

  return getOffsetMoves(piece, position, board, knightOffsets);
}


export function getValidBishopMoves(
  piece: Piece,
  position: Position,
  board: Board
): string[] {  

  return getSlidingMoves(
    piece,
    position,
    board,
    [
      [1, 1],   // up-right
      [-1, 1],  // up-left
      [1, -1],  // down-right
      [-1, -1]  // down-left
    ]
  );
}


export function getValidQueenMoves(
  piece: Piece,
  position: Position,
  board: Board
): string[] {
  
  return getSlidingMoves(
    piece,
    position,
    board,
    [
      [1, 0], // right
      [-1, 0], // left
      [0, 1], // up
      [0, -1], // down
      [1, 1], // up-right
      [-1, 1], // up-left
      [1, -1], // down-right
      [-1, -1]  // down-left
    ]
  );
}


export function getValidKingMoves(
  piece: Piece,
  position: Position,
  board: Board,
  includeCastling = true
): string[] {
  const kingOffsets = [
    [1, 0],  // right
    [-1, 0], // left
    [0, 1],  // up
    [0, -1], // down
    [1, 1],   // up-right
    [-1, 1],  // up-left
    [1, -1],  // down-right
    [-1, -1]  // down-left
  ];

  const moves = getOffsetMoves(piece, position, board, kingOffsets);

  if (includeCastling) {
    //const castleMoves = getCastleMoves(piece, board);
    //console.log("Castle moves:", castleMoves);
    moves.push(...getCastleMoves(piece, board));
  }

  return moves;
}
function getSlidingMoves(
  piece: Piece,
  position: Position,
  board: Board,
  directions: number[][]
): string[] {
  const moves: string[] = [];

  for (const [fileDirection, rankDirection] of directions) {
    let file = position.file + fileDirection;
    let rank = position.rank + rankDirection;

    while (
      file >= 0 &&
      file <= 7 &&
      rank >= 0 &&
      rank <= 7
    ) {
      const square = positionToNotation({ file, rank });

      if (board[square]) {
        if (board[square].color !== piece.color) {
          moves.push(square);
        }
        break;
      }

      moves.push(square);

      file += fileDirection;
      rank += rankDirection;
    }
  }

  return moves;
}

function getOffsetMoves(
  piece: Piece,
  position: Position,
  board: Board,
  offsets: number[][]
): string[] {
  const moves: string[] = [];

  for (const [fileOffset, rankOffset] of offsets) {
    const newPosition = {
      file: position.file + fileOffset,
      rank: position.rank + rankOffset
    };

    // outside the board
    if (
      newPosition.file < 0 ||
      newPosition.file > 7 ||
      newPosition.rank < 0 ||
      newPosition.rank > 7
    ) {
      continue;
    }

    const square = positionToNotation(newPosition);
    const pieceAtSquare = board[square];

    if (!pieceAtSquare) {
      moves.push(square);
    }

    if (pieceAtSquare && pieceAtSquare.color !== piece.color) {
      moves.push(square);
    }

  }

  return moves;
}