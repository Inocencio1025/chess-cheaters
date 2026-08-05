import "./BombEffect.css";
import explosion from "../assets/effects/explosion.svg";

function BombEffect() {
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