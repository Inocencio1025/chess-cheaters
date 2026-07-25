import { useState } from "react";
import CheatSelectScreen from "./CheatSelectScreen";

function HomeScreen() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <CheatSelectScreen />;
  }

  return (
    <div>
      <h1>Chess Cheaters</h1>
      <p>Chess with cheats</p>

      <button onClick={() => setStarted(true)}>
        Create Match
      </button>
    </div>
  );
}

export default HomeScreen;