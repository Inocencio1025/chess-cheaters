import { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import MatchScreen from "./screens/MatchScreen";
import CheatSelectScreen from "./screens/CheatSelectScreen";
import ChessBoard from "./components/ChessBoard";
import type { CheatType } from "./cheats/CheatManager";

type Screen =
  | "home"
  | "cheat-select"
  | "match"
  | "game";


function App() {

  const [screen, setScreen] = useState<Screen>("home");
  const [selectedCheats, setSelectedCheats] = useState<CheatType[]>([]);


  return (
    <>
      {screen === "home" && (
        <HomeScreen
          onCreateMatch={() => setScreen("cheat-select")}
        />
      )}

      {screen === "cheat-select" && (
        <CheatSelectScreen
          onStart={(cheats) => {
            setSelectedCheats(cheats);
            setScreen("match");
          }}
        />
      )}
      {screen === "match" && (
        <MatchScreen
          onStartGame={() => {
            setScreen("game");
          }}
        />
      )}

      {screen === "game" && (
        <ChessBoard
          availableCheats={selectedCheats}
        />
      )}
    </>
  );
}

export default App;