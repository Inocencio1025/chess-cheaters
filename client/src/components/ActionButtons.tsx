import { cheats } from "../cheats/CheatManager";
import type { CheatType } from "../cheats/CheatManager";
import "./ActionButtons.css";

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
    <div className="action-panel">

      <h3>Cheats</h3>

      <div className="action-buttons">

        <button
          className="action-card"
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
              className="action-card"
              key={cheat.id}
              disabled={!canAfford(cheat.id) || dashActive}
              onClick={() => {
                updateTargets(cheat.id);
              }}
            >
              <strong>{cheat.name}</strong>
              <span>{cheat.cost}</span>
            </button>
          ))}

      </div>


      {availableCheats.includes("magnet") && (
        <div className="magnet-controls">

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