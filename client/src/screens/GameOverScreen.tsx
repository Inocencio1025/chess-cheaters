import { useEffect } from "react";
import { playSound } from "../sounds/SoundManager";

type Props = {
  winner: "white" | "black";
  onReturnHome: () => void;
};

function GameOverScreen({
  winner,
  onReturnHome
}: Props) {

  useEffect(() => {
    playSound("gameWin");
  }, []);

  return (
    <div className="game-over-screen">
      <div className="game-over-card">
        <h1>Checkmate!</h1>

        <p>
          {winner === "white" ? "White" : "Black"} wins!
        </p>

        <button
          className="primary-button"
          onClick={onReturnHome}
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

export default GameOverScreen;