export type Position = {
  file: number;
  rank: number;
};

export function notationToPosition(square: string): Position {
  return {
    file: square.toUpperCase().charCodeAt(0) - "A".charCodeAt(0),
    rank: Number(square[1]) - 1
  };
}

export function positionToNotation(position: Position): string {
  return `${String.fromCharCode(
    "A".charCodeAt(0) + position.file
  )}${position.rank + 1}`;
}

export function positionToPixels(
  position: Position,
  squareSize = 80,
  flipped = false
) {
  const file = flipped ? 7 - position.file : position.file;
  const rank = flipped ? position.rank : 7 - position.rank;

  return {
    left: `${file * squareSize + squareSize / 2}px`,
    top: `${rank * squareSize + squareSize / 2}px`
  };
}