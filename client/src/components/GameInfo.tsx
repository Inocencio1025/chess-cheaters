type Props = {
  currentTurn: "white" | "black";
  status: string;
  currentAction: string;
  whiteMomentum: number;
  blackMomentum: number;
  autoFlip: boolean;
  setAutoFlip: React.Dispatch<React.SetStateAction<boolean>>
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>
};


function GameInfo({
  currentTurn,
  status,
  currentAction,
  whiteMomentum,
  blackMomentum,
  autoFlip,
  setAutoFlip,
  message
}: Props) {

  return (
    <div className="game-info">

      <div className="selected-square">

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


      <p>
        White Momentum: {whiteMomentum}
      </p>

      <p>
        Black Momentum: {blackMomentum}
      </p>

      <p>
        Message: {message}
      </p>

    </div>
  );
}

export default GameInfo;