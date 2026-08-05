import "./TempoDisplay.css"

type Props = {
  whiteTempo: number;
  blackTempo: number;
};

function TempoDisplay({ whiteTempo, blackTempo }: Props) {
  return (
    <div className="tempo-display">
      <div>
        <p>WHITE TEMPO</p>
        <strong className="tempo-number">
          {whiteTempo}
        </strong>
      </div>

      <div>
        <p>BLACK TEMPO</p>
        <strong className="tempo-number">
          {blackTempo}
        </strong>
      </div>
    </div>
  );
}

export default TempoDisplay;