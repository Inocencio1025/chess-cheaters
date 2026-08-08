import { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import MatchLobbyScreen from "./screens/MatchLobbyScreen";
import CheatSelectScreen from "./screens/CheatSelectScreen";
import ChessBoard from "./components/ChessBoard";
import type { CheatType } from "./cheats/CheatManager";
import GameOverScreen from "./screens/GameOverScreen";

type Screen =
  | "home"
  | "cheat-select"
  | "lobby"
  | "game"
  | "game-over";


function App() {

  const [screen, setScreen] = useState<Screen>("home");
  const [selectedCheats, setSelectedCheats] = useState<CheatType[]>([]);
  const [winner, setWinner] = useState<"white" | "black" | null>(null);

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
            setScreen("lobby");
          }}
        />
      )}
      {screen === "lobby" && (
        <MatchLobbyScreen
          onStartGame={() => {
            setScreen("game");
          }}
        />
      )}

      {screen === "game" && (
        <ChessBoard
          availableCheats={selectedCheats}
          onGameOver={(winner) => {
            setWinner(winner);
            setScreen("game-over");
          }}
        />
      )}

      {screen === "game-over" && winner && (
        <GameOverScreen
          winner={winner}
          onReturnHome={() => {
            setWinner(null);
            setScreen("home");
          }}
        />
      )}
    </>
  );
}

export default App;