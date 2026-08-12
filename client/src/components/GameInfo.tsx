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
};


function GameInfo({
  currentTurn,
  status,
  message
}: Props) {

  return (
    <div className="game-info">

      <div className="game-status">
        <p>
          {message
            ? message.split(/(tempo)/gi).map((part, index) =>
              part.toLowerCase() === "tempo" ? (
                <span key={index} className="tempo-word">
                  {part}
                </span>
              ) : (
                part
              )
            )
            : `${currentTurn}'s turn: ${status}`}
        </p>
      </div>

    </div>
  );
}

export default GameInfo;