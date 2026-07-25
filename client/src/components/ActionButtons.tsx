import { cheats } from "../cheats/CheatManager";
import type { CheatType } from "../cheats/CheatManager";

type Action =
  | "move"
  | CheatType;


type Props = {
  updateTargets: (action: Action) => void;
  canAfford: (cheat: CheatType) => boolean;
  magnetMode: "pull" | "push";
  setMagnetMode: (mode: "pull" | "push") => void;
  dashActive: boolean;
  availableCheats: CheatType[];
};


function ActionButtons({
  updateTargets,
  canAfford,
  magnetMode,
  setMagnetMode,
  dashActive,
  availableCheats
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

      {cheats
        .filter(cheat => availableCheats.includes(cheat.id))
        .map((cheat) => (
          <button
            key={cheat.id}
            disabled={!canAfford(cheat.id) || dashActive}
            onClick={() => {
              updateTargets(cheat.id);
            }}
          >
            {cheat.name} ({cheat.cost})
          </button>
        ))}

      {availableCheats.includes("magnet") && (
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