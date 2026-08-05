import type { Piece } from "../chess/Piece";
import PieceImage from "../components/PieceImage";

type Props = {
  piece?: Piece;
};

function CaptureEffect({ piece }: Props) {

  if (!piece) {
    return null;
  }

  return (
    <div className="capture-effect">
      <PieceImage 
        piece={piece}
        className="capturing-piece"
      />
    </div>
  );
}

export default CaptureEffect;