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

export type MagnetMode = "push" | "pull";

export type ActiveEffect = {
  id: string;
  type: EffectType;

  sourceSquare?: string;
  targetSquare?: string;

  piece?: Piece;

  duration?: number;

  status?: boolean;

  magnetMode?: MagnetMode;
};