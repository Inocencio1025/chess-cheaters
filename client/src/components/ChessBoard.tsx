import "./ChessBoard.css";
import { useState } from "react";
import { createGameState, createTestGameState } from "../chess/GameState";
import type { GameState } from "../chess/GameState";
import { files, ranks } from "../chess/BoardConstants";
import { type PowerType } from "../powers/PowerManager";
import PieceImage from "./PieceImage";
import ActionButtons from "./ActionButtons";
import GameInfo from "./GameInfo";
import {
  applyPhaseBeforeMove,
  canAfford,
  finishMove,
  handleDashSecondMove,
  selectPiece,
  moveSelectedPiece,
  resetSelection,
  updateTargets,
  handlePowerClick
} from "../chess/GameController";

function ChessBoard() {
  const [autoFlip, setAutoFlip] = useState(false);
  const [magnetMode, setMagnetMode] = useState<"pull" | "push">("pull");
  const [message, setMessage] = useState("");
  const [selection, setSelection] = useState({
    selectedSquare: "",
    validMoves: [] as string[],
    currentAction: "move" as "move" | PowerType
  });
  const [gameState, setGameState] = useState<GameState>(
    //createGameState()
    createTestGameState()
  );

  const flipped = autoFlip && gameState.currentTurn === "black";

  function processSquareClick(squareName: string) {

    if (selection.validMoves.includes(squareName)) {

      if (selection.currentAction !== "move") {

        console.log(selection.currentAction, squareName);

        const newState = handlePowerClick(
          gameState,
          selection,
          squareName,
          magnetMode
        );

        if (newState) {
          setGameState(newState);
          clearSelection();
        }

        return;
      }

      // Apply phase before move
      const stateToMove = applyPhaseBeforeMove(
        gameState,
        selection.selectedSquare
      );

      const newState = moveSelectedPiece(
        stateToMove,
        selection.selectedSquare,
        squareName
      );


      // Dash second move
      const dashResult = handleDashSecondMove(
        gameState,
        newState,
        squareName
      );

      if (dashResult) {

        if (dashResult.finished) {
          setGameState(dashResult.state);
          clearSelection();
          return;
        }

        setGameState(dashResult.state);
        setSelection(prev => ({
          ...prev,
          selectedSquare: dashResult.selectedSquare,
          validMoves: dashResult.validMoves
        }));

        return;
      }


      // Normal ending
      const finishedState = finishMove(newState);
      setGameState(finishedState);
      clearSelection();

      // Check for checkmate
      if (finishedState.status === "checkmate") {
        alert("Checkmate!");
      }

      return;
    }



    // Selecting piece
    const result = selectPiece(gameState, squareName);

    if (result) {

      if (gameState.activePower.dashSecondMove) {
        return;
      }

      setSelection(prev => ({
        ...prev,
        selectedSquare: result.selectedSquare,
        validMoves: result.validMoves
      }));
      return;
    }

    clearSelection();
  }

  function clearSelection() {
    setSelection(resetSelection());
  }

  function handleUpdateTargets(action: "move" | PowerType) {
    const result = updateTargets(
      action,
      gameState,
      selection.selectedSquare
    );

    setGameState(result.gameState);

    setSelection({
      selectedSquare: selection.selectedSquare,
      currentAction: result.currentAction,
      validMoves: result.validMoves
    });
  }

  return (
    <>
      <div className="game-container">

        <div className="chess-board">

          {(flipped ? ranks : [...ranks].reverse()).map(rank => (

            <div className="rank" key={rank}>

              {(flipped ? [...files].reverse() : files).map((file, fileIndex) => {

                const isLight = (rank + fileIndex) % 2 === 0;
                const squareName = `${file}${rank}`;
                const piece = gameState.board[squareName];


                return (
                  <div
                    className={`
                    square
                    ${isLight ? "light" : "dark"}
                    ${selection.selectedSquare === squareName ? "selected" : ""}
                    ${selection.validMoves.includes(squareName) ? "valid-move" : ""}
                    ${(piece?.freezeTurns ?? 0) > 0 ? "frozen-square" : ""}
                    ${piece?.hasBomb ? "bomb-square" : ""}
                    ${gameState.activePower.dashActive && selection.selectedSquare === squareName ? "dash-square" : ""}
                    ${gameState.terrain[squareName] === "rock" ? "rock-square" : ""}
                    `}
                    key={squareName}
                    onClick={() => processSquareClick(squareName)}
                  >

                    {piece && <PieceImage piece={piece} />}

                  </div>
                );

              })}

            </div>

          ))}

        </div>


        <GameInfo
          currentTurn={gameState.currentTurn}
          status={gameState.status}
          currentAction={selection.currentAction}
          whiteMomentum={gameState.whiteMomentum}
          blackMomentum={gameState.blackMomentum}
          autoFlip={autoFlip}
          setAutoFlip={setAutoFlip}
          message={message}
          setMessage={setMessage}
        />


        <ActionButtons
          updateTargets={handleUpdateTargets}
          canAfford={(power) => canAfford(gameState, power)}
          magnetMode={magnetMode}
          setMagnetMode={setMagnetMode}
          dashActive={gameState.activePower.dashActive}
        />

      </div>
    </>
  );
}

export default ChessBoard;