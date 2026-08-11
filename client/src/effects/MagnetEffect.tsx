import {
  notationToPosition,
  positionToPixels
} from "../chess/Position";

import magnet from "../assets/effects/magnet.svg";
import "./MagnetEffect.css";


type Props = {
  source?: string;
  target?: string;
  mode?: "push" | "pull";
  flipped: boolean;
};


function MagnetEffect({
  source,
  target,
  mode = "push",
  flipped
}: Props) {

  if (!source || !target) {
    return null;
  }


  const angle = getAngle(source, target, flipped);

  const offset = 40;

  const offsetX =
    Math.cos((angle * Math.PI) / 180) * offset;

  const offsetY =
    Math.sin((angle * Math.PI) / 180) * offset;


  const waveOffset = -25;


  return (
    <div className="magnet-effect">

      <img
        src={magnet}
        className="magnet-image"
        style={{
          transform: `
            translate(${offsetX}px, ${offsetY}px)
            rotate(${angle + 90}deg)
          `
        }}
      />


      <div
        className={`magnet-waves ${mode}`}
        style={{
          transform: `
            translate(${offsetX}px, ${offsetY}px)
            rotate(${angle}deg)
            translateY(${waveOffset}px)
          `
        }}
      >
        <span />
        <span />
        <span />
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

  const dx = parseFloat(end.left) - parseFloat(start.left);
  const dy = parseFloat(end.top) - parseFloat(start.top);

  return Math.atan2(dy, dx) * (180 / Math.PI);
}


export default MagnetEffect;