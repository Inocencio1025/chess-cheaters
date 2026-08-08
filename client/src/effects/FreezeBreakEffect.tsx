import "./FreezeBreakEffect.css";

import iceCube from "../assets/effects/ice.svg";
import { playSound } from "../sounds/SoundManager";
import { useEffect } from "react";

function FreezeBreakEffect() {

  useEffect(() => {
    playSound("iceBreak");
  }, []);

  return (
    <div className="freeze-break">
      {[...Array(6)].map((_, i) => (
        <img
          key={i}
          src={iceCube}
          className={`ice-shard shard-${i}`}
        />
      ))}
    </div>
  );
}
export default FreezeBreakEffect;