import "./BombEffect.css";
import explosion from "../assets/effects/explosion.svg";
import { playSound } from "../sounds/SoundManager";
import { useEffect } from "react";

function BombEffect() {

  useEffect(() => {
    playSound("bombExplosion");
  }, []);
  
  return (
    <div className="explosion">
      <div className="explosion-flash" />
      <div className="explosion-ring" />
      <img
        src={explosion}
        className="explosion-core"
      />
    </div>
  );
}

export default BombEffect;