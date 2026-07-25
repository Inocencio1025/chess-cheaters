import { powers } from "../powers/PowerManager";
import type { PowerType } from "../powers/PowerManager";

type Action =
  | "move"
  | PowerType;


type Props = {
  updateTargets: (action: Action) => void;
  canAfford: (power: PowerType) => boolean;
  magnetMode: "pull" | "push";
  setMagnetMode: (mode: "pull" | "push") => void;
  dashActive: boolean;
};


function ActionButtons({
  updateTargets,
  canAfford,
  magnetMode,
  setMagnetMode,
  dashActive
}: Props) {

  return (
    <div className="action-buttons">

      <button
        onClick={() => {
          updateTargets("move");
        }}
      >
        Move
      </button>

      {powers.map((power) => (
        <button
          key={power.id}
          disabled={!canAfford(power.id) || dashActive}
          onClick={() => {
            updateTargets(power.id);
          }}
        >
          {power.name} ({power.cost})
        </button>
      ))}

      {powers.some(power => power.id === "magnet") && (
        <div>
          <button
            onClick={() => setMagnetMode("pull")}
            disabled={magnetMode === "pull"}
          >
            Pull
          </button>

          <button
            onClick={() => setMagnetMode("push")}
            disabled={magnetMode === "push"}
          >
            Push
          </button>
        </div>
      )}

    </div>
  );
}

export default ActionButtons;