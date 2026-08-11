import { useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import MatchLobbyScreen from "./screens/MatchLobbyScreen";
import CheatSelectScreen from "./screens/CheatSelectScreen";
import ChessBoard from "./components/ChessBoard";
import type { CheatType } from "./cheats/CheatManager";
import GameOverScreen from "./screens/GameOverScreen";
import {
  connectToGame,
  createGame,
  joinGame,
  onMatchStarted,
  playerReady,
  onPlayerColorAssigned,
} from "./multiplayer/GameConnection";

type Screen =
  | "home"
  | "cheat-select"
  | "lobby"
  | "game"
  | "game-over";


function App() {

  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(null);
  const [screen, setScreen] = useState<Screen>(
    window.location.pathname.split("/")[2]
      ? "cheat-select"
      : "home"
  ); const [selectedCheats, setSelectedCheats] = useState<CheatType[]>([]);
  const [winner, setWinner] = useState<"white" | "black" | null>(null);
  const [gameLink, setGameLink] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [gameId, setGameId] = useState<string | null>(
    window.location.pathname.split("/")[2] ?? null
  );
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    setIsConnecting(true);

    connectToGame()
      .then(async () => {
        const gameId = window.location.pathname.split("/")[2];

        if (gameId) {
          await joinGame(gameId);
          setScreen("cheat-select");
        }
      })
      .finally(() => {
        setIsConnecting(false);
      });

    onMatchStarted(() => {
      setScreen("game");
    });

    onPlayerColorAssigned((color) => {
      setPlayerColor(color);
    });
  }, []);

  if (isConnecting) {
    return (
      <div className="connecting-screen">
        <h2>Connecting to server...</h2>
        <p>The server may take a moment to wake up.</p>
      </div>
    );
  }

  return (
    <>
      {screen === "home" && (
        <HomeScreen
          onCreateMatch={async () => {
            setIsHost(true);

            const link = await createGame();
            const id = link.split("/").pop()!;

            setGameId(id);
            setGameLink(link);
            setScreen("cheat-select");
          }}
        />
      )}

      {screen === "cheat-select" && (
        <CheatSelectScreen
          onStart={async (cheats) => {
            setSelectedCheats(cheats);
            setScreen("lobby");

            if (gameId) {
              await playerReady(gameId);
            }
          }}
        />
      )}
      {screen === "lobby" && (
        <MatchLobbyScreen
          gameLink={gameLink}
          onStartGame={() => {
            setScreen("game");
          }}
        />
      )}

      {screen === "game" && (
        <ChessBoard
          gameId={gameId}
          playerColor={playerColor}
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