import "./GameInfo.css";

type Props = {
  currentTurn: "white" | "black";
  status: string;
  currentAction: string;
  whiteTempo: number;
  blackTempo: number;
  autoFlip: boolean;
  setAutoFlip: React.Dispatch<React.SetStateAction<boolean>>
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>
};


function GameInfo({
  currentTurn,
  status,
  currentAction,
  whiteTempo: whiteTempo,
  blackTempo: blackTempo,
  autoFlip,
  setAutoFlip,
  message
}: Props) {

  return (
    <div className="game-info">

      <div className="game-status">

        <p>
          {currentTurn}'s turn
        </p>

        <p>
          {status}
        </p>

        <p>
          {currentAction}
        </p>

      </div>


      <button
        onClick={() => setAutoFlip(prev => !prev)}
      >
        {autoFlip ? "Disable Auto Flip" : "Enable Auto Flip"}
      </button>


      <div className="tempo-display">
        <p>
          ⚪ {whiteTempo}
        </p>

        <p>
          ⚫ {blackTempo}
        </p>
      </div>

      <p className="game-message">
        {message}
      </p>

    </div>
  );
}

export default GameInfo;