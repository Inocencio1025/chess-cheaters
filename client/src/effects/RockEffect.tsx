import "./RockEffect.css";
import rock from "../assets/effects/rock.svg";

function RockEffect() {
  return (
    <img
      src={rock}
      className="falling-rock"
    />
  );
}

export default RockEffect;