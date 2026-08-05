import "./FreezeBreakEffect.css";

import iceCube from "../assets/effects/ice.svg";

function FreezeBreakEffect() {
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