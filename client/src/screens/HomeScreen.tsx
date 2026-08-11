import { playSound } from "../sounds/SoundManager";
import "./HomeScreen.css";

type Props = {
  onCreateMatch: () => void | Promise<void>;
};

function HomeScreen({
  onCreateMatch
}: Props) {

  return (
    <div className="home-screen">
      <div className="home-card">

        <h1>Chess Cheaters</h1>

        <p className="tagline">
          Classic chess.
          <br />
          Breaking the rules encouraged.
        </p>

        <button
          className="primary-button"
          onClick={() => {
            //playSound("gameStart");
            playSound("buttonClick");

            onCreateMatch();
          }}        >
          Create Match
        </button>

      </div>
    </div>
  );
}

export default HomeScreen;