import type { ActiveEffect } from "./ActiveEffect";
import "./EffectOverlay.css";
import GunEffect from "./GunEffect";
import {
  notationToPosition,
  positionToPixels
} from "../chess/Position";
import CaptureEffect from "./CaptureEffect";
import BombEffect from "./BombEffect";
import FreezeEffect from "./FreezeEffect";
import FreezeBreakEffect from "./FreezeBreakEffect";
import DashEffect from "./DashEffect";
import ForcePushEffect from "./ForcePushEffect";
import RockEffect from "./RockEffect";
import MagnetEffect from "./MagnetEffect";

type Props = {
  effects: ActiveEffect[];
  playEffect: (effect: ActiveEffect, duration?: number) => void;
  fireGun: (effect: ActiveEffect) => void;
  flipped: boolean;
};




function EffectOverlay({
  effects,
  playEffect,
  fireGun,
  flipped
}: Props) {

  return (
    <>
      {effects.map(effect => {

        const square =
          effect.type === "gun" ||
            effect.type === "magnet"
            ? effect.sourceSquare
            : effect.targetSquare ?? effect.sourceSquare;

        if (!square) return null;

        return (
          <div
            key={effect.id}
            className="effect"
            style={
              positionToPixels(
                notationToPosition(square),
                80,
                flipped
              )
            }
          >

            {effect.type === "gun" && (
              <GunEffect
                source={effect.sourceSquare}
                target={effect.targetSquare}
                onFire={() => fireGun(effect)}
                flipped={flipped}
              />
            )}

            {effect.type === "capture" && (
              <CaptureEffect piece={effect.piece} />
            )}

            {effect.type === "bomb" && (
              <BombEffect />
            )}
            {effect.type === "freeze" && (
              <FreezeEffect />
            )}
            {effect.type === "freeze-break" && (
              <FreezeBreakEffect />
            )}
            {effect.type === "dash" && (
              <DashEffect />
            )}
            {effect.type === "force-push" && (
              <ForcePushEffect />
            )}
            {effect.type === "rock" && (
              <RockEffect />
            )}
            {effect.type === "magnet" && (
              <MagnetEffect
                source={effect.sourceSquare}
                target={effect.targetSquare}
                mode={effect.magnetMode}
                flipped={flipped}
              />
            )}
          </div>
        );

      })}
    </>
  );
}

export default EffectOverlay;