export type Position = {
  file: number; // 0-7 (A-H)
  rank: number; // 0-7 (1-8)
};

export function notationToPosition(square: string): Position {
  return {
    file: square.charCodeAt(0) - "A".charCodeAt(0),
    rank: Number(square[1]) - 1
  };
}

export function positionToNotation(position: Position): string {
  return `${String.fromCharCode(
    "A".charCodeAt(0) + position.file
  )}${position.rank + 1}`;
}