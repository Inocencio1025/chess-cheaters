import type { Piece } from "../chess/Piece";
import type { ActiveEffect, EffectType } from "./ActiveEffect";


export function createEffect(
  type: EffectType,
  sourceSquare?: string,
  targetSquare?: string,
  piece?: Piece
): ActiveEffect {

  return {
    id: Date.now(),
    type,
    sourceSquare,
    targetSquare,
    piece
  };
}