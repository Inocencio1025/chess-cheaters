import type { Piece } from "../chess/Piece";
import type { ActiveEffect, EffectType } from "./ActiveEffect";


export function createEffect(
  type: EffectType,
  sourceSquare?: string,
  targetSquare?: string,
  piece?: Piece
): ActiveEffect {

  return {
    id: crypto.randomUUID(),
    type,
    sourceSquare,
    targetSquare,
    piece
  };
}