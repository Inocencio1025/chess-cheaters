import {
  notationToPosition,
  positionToPixels
} from "../chess/Position";

import gun from "../assets/effects/gun.svg";
import "./GunEffect.css";
import { useEffect, useRef } from "react";
import { playSound } from "../sounds/SoundManager";

type Props = {
  source?: string;
  target?: string;
  onFire?: () => void;
  flipped: boolean;
};

function GunEffect({
  source,
  target,
  onFire,
  flipped
}: Props) {

  const fired = useRef(false);

  if (!source || !target) {
    return null;
  }

  const angle = getAngle(source, target, flipped);
  const facingLeft = angle > 90 || angle < -90;

  const start = notationToPosition(source);
  const end = notationToPosition(target);

  // Use the actual displayed board coordinates
  const startPixels = positionToPixels(
    start,
    80,
    flipped
  );

  const endPixels = positionToPixels(
    end,
    80,
    flipped
  );

  const dx =
    parseFloat(endPixels.left) -
    parseFloat(startPixels.left);

  const dy =
    parseFloat(endPixels.top) -
    parseFloat(startPixels.top);

  const distance = Math.sqrt(dx * dx + dy * dy);

  const gunOffset = 30;

  const offsetX = (dx / distance) * gunOffset;
  const offsetY = (dy / distance) * gunOffset;

  useEffect(() => {

    const timer = setTimeout(() => {

      if (fired.current) {
        return;
      }

      fired.current = true;

      playSound("gunfire");
      onFire?.();

    }, 600);

    return () => clearTimeout(timer);

  }, [onFire]);

  return (
    <div className="gun-effect">

      <div
        className="gun-wrapper"
        style={{
          transform: `
            translate(${offsetX}px, ${offsetY}px)
            rotate(${angle}deg)
            ${facingLeft ? "scaleY(-1)" : ""}
          `
        }}
      >
        <img
          src={gun}
          className="gun"
        />

        <div className="muzzle-flash" />

      </div>

    </div>
  );
}

function getAngle(
  source: string,
  target: string,
  flipped: boolean
) {

  const start = positionToPixels(
    notationToPosition(source),
    80,
    flipped
  );

  const end = positionToPixels(
    notationToPosition(target),
    80,
    flipped
  );

  const dx =
    parseFloat(end.left) -
    parseFloat(start.left);

  const dy =
    parseFloat(end.top) -
    parseFloat(start.top);

  return Math.atan2(dy, dx) * (180 / Math.PI);
}

export default GunEffect;