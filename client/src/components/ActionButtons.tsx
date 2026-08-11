import { cheats } from "../cheats/CheatManager";
import type { CheatType } from "../cheats/CheatManager";
import { playSound } from "../sounds/SoundManager";
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
  currentAction: Action;
  currentTurn: "white" | "black";
  playerColor: "white" | "black" | null;
};


function ActionButtons({
  updateTargets,
  canAfford,
  magnetMode,
  setMagnetMode,
  dashActive,
  availableCheats,
  currentAction,
  currentTurn,
  playerColor
}: Props) {

  const isMyTurn = currentTurn === playerColor;

  return (
    <div className="action-panel">

      <h3>Cheats</h3>

      <div className="action-buttons">

        <button
          className="action-card"
          disabled={!isMyTurn}
          onClick={() => {
            playSound("buttonClick");
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
              disabled={!isMyTurn || !canAfford(cheat.id) || dashActive}
              onClick={() => {
                playSound("buttonClick");
                updateTargets(cheat.id);
              }}
            >
              <strong>{cheat.name}</strong>
              <span>{cheat.cost}</span>
            </button>
          ))}

      </div>


      {currentAction === "magnet" && (
        <div className="magnet-switch">

          <span>🧲 Pull</span>

          <button
            className={`switch ${magnetMode}`}
            onClick={() =>
              setMagnetMode(
                magnetMode === "pull"
                  ? "push"
                  : "pull"
              )
            }
          >
            <div className="knob" />
          </button>

          <span>Push</span>

        </div>
      )}

    </div>
  );
}

export default ActionButtons;