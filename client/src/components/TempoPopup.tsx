import type { TempoMessage } from "../chess/GameState";
import "./TempoPopup.css";

type Props = {
  message: TempoMessage;
};

function TempoPopup({ message }: Props) {
  return (
    <div className="tempo-popup">
      <div className="tempo-amount">
        +{message.amount} TEMPO
      </div>

      <div className="tempo-title">
        {message.title}
      </div>

      {message.description && (
        <div className="tempo-description">
          {message.description}
        </div>
      )}
    </div>
  );
}

export default TempoPopup;