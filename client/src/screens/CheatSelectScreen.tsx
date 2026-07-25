import { useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { cheats, type CheatType } from "../cheats/CheatManager";

function CheatSelectScreen() {
  const [selectedCheats, setSelectedCheats] = useState<CheatType[]>([]);
  const [started, setStarted] = useState(false);

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

  if (started) {
    return <ChessBoard availableCheats={selectedCheats} />;
  }

  return (
    <div>
      <h1>Choose 3 Cheats</h1>

      {cheats.map(cheat => (
        <button
          key={cheat.id}
          onClick={() => toggleCheat(cheat.id)}
        >
          {cheat.name}
          {" "}
          ({cheat.cost} tempo)
          {selectedCheats.includes(cheat.id) && " ✓"}
        </button>
      ))}

      <p>
        Selected: {selectedCheats.length}/3
      </p>

      <button
        disabled={selectedCheats.length !== 3}
        onClick={() => setStarted(true)}
      >
        Start Match
      </button>
    </div>
  );
}

export default CheatSelectScreen;