import type { Piece } from "../chess/Piece";

export type EffectType =
  | "gun"
  | "bomb"
  | "freeze"
  | "freeze-break"
  | "dash"
  | "magnet"
  | "force-push"
  | "phase"
  | "rock"
  | "royal-decree"
  | "capture";



export type ActiveEffect = {
  id: number;
  type: EffectType;

  sourceSquare?: string;
  targetSquare?: string;

  piece?: Piece;

  duration?: number;
  
  status?: boolean;
};