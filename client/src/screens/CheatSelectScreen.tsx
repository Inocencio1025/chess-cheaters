import { useState } from "react";
import { cheats, type CheatType } from "../cheats/CheatManager";
import "./CheatSelectScreen.css";
import { playSound } from "../sounds/SoundManager";

type Props = {
  onStart: (cheats: CheatType[]) => void;
};

function CheatSelectScreen({
  onStart
}: Props) {

  const [selectedCheats, setSelectedCheats] = useState<CheatType[]>([]);
  const [viewingCheat, setViewingCheat] = useState<CheatType | null>(null);

  function toggleCheat(cheat: CheatType) {

    if (selectedCheats.includes(cheat)) {
      setSelectedCheats(
        selectedCheats.filter(c => c !== cheat)
      );
      return;
    }

    if (selectedCheats.length < 3) {
      setSelectedCheats([
        ...selectedCheats,
        cheat
      ]);
    }
  }

  return (
    <div className="cheat-screen">

      <div className="cheat-top">

        <h1>
          Choose Your Cheats
        </h1>


        <div className="cheat-description-panel">

          {viewingCheat ? (

            (() => {
              const cheat = cheats.find(
                c => c.id === viewingCheat
              );

              if (!cheat) return null;

              return (
                <>
                  <div className="description-icon">
                    {cheat.icon}
                  </div>

                  <h2>
                    {cheat.name}
                  </h2>

                  <p>
                    {cheat.description}
                  </p>

                  <span>
                    Cost: {cheat.cost} tempo
                  </span>
                </>
              );

            })()

          ) : (

            <>
              <h2>
                Build Your Loadout
              </h2>

              <p>
                Select 3 cheats for your match.
              </p>

              <p>
                Cheats cost tempo to use.
              </p>
            </>

          )}

        </div>

      </div>


      <div className="cheat-container">


        <div className="cheat-grid">

          {cheats.map(cheat => (

            <button
              key={cheat.id}
              className={
                selectedCheats.includes(cheat.id)
                  ? "cheat-card selected"
                  : "cheat-card"
              }
              onClick={() => {
                playSound("buttonClick");
                toggleCheat(cheat.id);
                setViewingCheat(cheat.id);
              }}
            >

              <div className="cheat-icon">
                {cheat.icon}
              </div>

              <h2>
                {cheat.name}
              </h2>

              <p className="cheat-cost">
                {cheat.cost} tempo
              </p>

            </button>

          ))}

        </div>


        <p>
          Selected: {selectedCheats.length}/3
        </p>


        <button
          className="primary-button"
          disabled={selectedCheats.length !== 3}
          onClick={() => {
            playSound("buttonClick");
            onStart(selectedCheats);
          }}        >
          Start Match
        </button>


      </div>

    </div>
  );
}

export default CheatSelectScreen;