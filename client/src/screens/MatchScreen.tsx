import "./MatchScreen.css";

type Props = {
  onStartGame: () => void;
};

function MatchScreen({
  onStartGame
}: Props) {

  return (
    <div className="match-screen">

      <div className="match-card">

        <h1>Match Created</h1>

        <p>
          Share this code with a friend:
        </p>

        <div className="match-link">
          chesscheaters.com/join/ABC123
        </div>

        <button
          className="copy-button"
          onClick={() => navigator.clipboard.writeText(
            "chesscheaters.com/join/ABC123"
          )}
        >
          Copy Link
        </button>

        <p>
          Waiting for opponent...
        </p>


        <button
          className="primary-button"
          onClick={onStartGame}
        >
          Start Test Match
        </button>

      </div>

    </div>
  );
}

export default MatchScreen;