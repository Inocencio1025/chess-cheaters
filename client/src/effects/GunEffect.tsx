import {
  notationToPosition,
  positionToPixels
} from "../chess/Position";

import gun from "../assets/effects/gun.svg";
import "./GunEffect.css";
import { useEffect, useRef } from "react";

type Props = {
  source?: string;
  target?: string;
  onFire?: () => void;
};


function GunEffect({
  source,
  target,
  onFire
}: Props) {

  const fired = useRef(false);

  if (!source || !target) {
    return null;
  }

  const angle = getAngle(source, target);
  const facingLeft = angle > 90 || angle < -90;
  const start = notationToPosition(source);
  const end = notationToPosition(target);

  const dx = end.file - start.file;
  const dy = end.rank - start.rank;

  const distance = Math.sqrt(dx * dx + dy * dy);

  const gunOffset = 30;

  const offsetX = (dx / distance) * gunOffset;
  const offsetY = -(dy / distance) * gunOffset;

  useEffect(() => {

    const timer = setTimeout(() => {

      if (fired.current) {
        return;
      }

      fired.current = true;
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
  target: string
) {
  const start = positionToPixels(notationToPosition(source));
  const end = positionToPixels(notationToPosition(target));

  const dx = parseFloat(end.left) - parseFloat(start.left);
  const dy = parseFloat(end.top) - parseFloat(start.top);

  return Math.atan2(dy, dx) * (180 / Math.PI);
}


export default GunEffect;