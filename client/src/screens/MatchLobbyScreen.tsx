import { useState } from "react";
import "./MatchLobbyScreen.css";

type Props = {
  gameLink: string | null;
  onStartGame: () => void;
};

function MatchLobbyScreen({
  gameLink
}: Props) {

  const [copied, setCopied] = useState(false);

  return (
    <div className="match-screen">

      <div className="match-card">

        <h1>Match Created</h1>

        <p>
          Share this code with a friend:
        </p>

        <div className="match-link">
          {gameLink}
        </div>

        <button
          className="copy-button"
          onClick={async () => {
            if (gameLink) {
              await navigator.clipboard.writeText(gameLink);
              setCopied(true);

              setTimeout(() => {
                setCopied(false);
              }, 1500);
            }
          }}
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>

        <p>
          Waiting for opponent...
        </p>

      </div>

    </div>
  );
}

export default MatchLobbyScreen;