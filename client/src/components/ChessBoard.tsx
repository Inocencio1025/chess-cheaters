import "./ChessBoard.css";
import { useState, useEffect } from "react";
import { createGameState } from "../chess/GameState";
// createTestGameState
import type { GameState } from "../chess/GameState";
import { files, ranks } from "../chess/BoardConstants";
import { executeCheat, type CheatType } from "../cheats/CheatManager";
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
  handleCheatClick,
  executeSelectedCheat
} from "../chess/GameController";
import type { Piece } from "../chess/Piece";
import type { ActiveEffect } from "../effects/ActiveEffect";
import EffectOverlay from "../effects/EffectOverlay";
import { createEffect } from "../effects/EffectManager";
import bomb from "../assets/effects/bomb.svg"
import iceCube from "../assets/effects/ice.svg";
import rock from "../assets/effects/rock.svg"
import crown from "../assets/effects/crown.svg"
import { notationToPosition, positionToPixels } from "../chess/Position";
import { getLegalMoves } from "../chess/MoveLogic";
import TempoDisplay from "./TempoDisplay";
//import A from "../assets/sounds/A.mp3";
import { sendGameState, onGameStateUpdated } from "../multiplayer/GameConnection";

type Props = {
  gameId: string | null;
  playerColor: "white" | "black" | null;
  availableCheats: CheatType[];
  onGameOver: (winner: "white" | "black") => void;
};

function ChessBoard({
  gameId,
  playerColor,
  availableCheats,
  onGameOver
}: Props) {
  const [autoFlip, setAutoFlip] = useState(false);
  const [magnetMode, setMagnetMode] = useState<"pull" | "push">("pull");
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [selection, setSelection] = useState({
    selectedSquare: "",
    validMoves: [] as string[],
    currentAction: "move" as "move" | CheatType
  });

  const [gameState, setGameState] = useState<GameState>(
    createGameState()
    //createTestGameState()
  );

  useEffect(() => {
    const handleGameStateUpdated = (newState: GameState) => {
      setGameState(newState);
      clearSelection();
    };

    onGameStateUpdated(handleGameStateUpdated);

    return () => {
      // We'll clean this listener up properly later.
    };
  }, []);

  useEffect(() => {
    if (!gameState.tempoMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        tempoMessage: null
      }));
    }, 2500);

    return () => clearTimeout(timer);

  }, [gameState.tempoMessage]);

  /* background music 
  useEffect(() => {
    const music = new Audio(A);
    music.loop = true;
    music.volume = 0.3;

    music.play().catch(() => { });

    return () => {
      music.pause();
      music.currentTime = 0;
    };
  }, []);
  */

  const [movingPiece, setMovingPiece] = useState<{
    piece: Piece;
    from: string;
    to: string;
  } | null>(null);

  const [movingPiecePosition, setMovingPiecePosition] = useState<{
    left: string;
    top: string;
  } | null>(null);

  const [movingPieces, setMovingPieces] = useState<{
    piece: Piece;
    from: string;
    to: string;
  }[]>([]);

  const [movingPiecePositions, setMovingPiecePositions] = useState<
    Record<string, { left: string; top: string }>
  >({});


  const [capturingSquare, setCapturingSquare] = useState<string | null>(null);

  const flipped = playerColor === "black";
  const [shaking, setShaking] = useState(false);

  const GUN_FIRE_DELAY = 700;
  const CAPTURE_ANIMATION_TIME = 600;
  const MESSAGE_HANG_TIME = 1500;

  function playEffect(
    effect: ActiveEffect,
    duration = 500
  ) {
    setActiveEffects(prev => [
      ...prev,
      effect
    ]);


    setTimeout(() => {
      setActiveEffects(prev =>
        prev.filter(e => e.id !== effect.id)
      );
    }, duration);
  }

  function processSquareClick(squareName: string) {

    if (selection.validMoves.includes(squareName)) {

      if (selection.currentAction !== "move") {

        if (selection.currentAction === "gun") {

          playEffect(
            createEffect(
              "gun",
              selection.selectedSquare,
              squareName
            ),
            1500
          );

          setTimeout(async () => {
            const newState = executeSelectedCheat(
              gameState,
              "gun",
              selection.selectedSquare,
              squareName,
              magnetMode
            );

            if (newState) {
              await applyNewGameState(newState);
              clearSelection();
            }

          }, GUN_FIRE_DELAY + CAPTURE_ANIMATION_TIME);

          return;
        }

        if (selection.currentAction === "freeze") {
          playEffect(
            createEffect(
              "freeze",
              undefined,
              squareName
            ),
            600
          );
        }


        if (selection.currentAction === "dash") {
          const newState = executeCheat(
            "dash",
            gameState,
            squareName,
            squareName,
            magnetMode
          );

          applyNewGameState(newState);

          setSelection({
            selectedSquare: squareName,
            validMoves: getLegalMoves(
              newState.board[squareName]!,
              squareName,
              newState.board,
              newState.terrain,
              newState.moveHistory,
              newState.royalDecreeActive
            ),
            currentAction: "move"
          });

          return;
        }

        if (selection.currentAction === "force-push") {

          playEffect(
            createEffect(
              "force-push",
              undefined,
              selection.selectedSquare
            ),
            500
          );
          triggerShake();

          setTimeout(() => {

            const newState = handleCheatClick(
              gameState,
              selection,
              squareName,
              magnetMode
            );

            if (newState) {
              setMovingPieces(newState.pushedPieces ?? []);

              const startPositions: Record<string, { left: string; top: string }> = {};

              (newState.pushedPieces ?? []).forEach((p) => {
                startPositions[p.from] = positionToPixels(
                  notationToPosition(p.from),
                  80,
                  flipped
                );
              });

              setMovingPiecePositions(startPositions);


              setTimeout(() => {
                const endPositions: Record<string, { left: string; top: string }> = {};

                (newState.pushedPieces ?? []).forEach((p) => {
                  endPositions[p.from] = positionToPixels(
                    notationToPosition(p.to),
                    80,
                    flipped
                  );
                });

                setMovingPiecePositions(endPositions);

              }, 20);

              setTimeout(async () => {
                await applyNewGameState(newState);
                clearSelection();
              }, 200);

              setTimeout(() => {
                setMovingPieces([]);
                setMovingPiecePositions({});
              }, 500);
            }

          }, 300);;

          return;
        }

        if (selection.currentAction === "magnet") {

          playEffect(
            {
              ...createEffect(
                "magnet",
                selection.selectedSquare,
                squareName,
              ),
              magnetMode: magnetMode
            },
            1500
          );

          setTimeout(() => {

            const newState = executeSelectedCheat(
              gameState,
              "magnet",
              selection.selectedSquare,
              squareName,
              magnetMode
            );

            if (newState) {

              setMovingPieces(newState.movedPieces ?? []);

              const startPositions: Record<string, { left: string; top: string }> = {};

              (newState.movedPieces ?? []).forEach((p) => {
                startPositions[p.from] = positionToPixels(
                  notationToPosition(p.from),
                  80,
                  flipped
                );
              });

              setMovingPiecePositions(startPositions);


              setTimeout(() => {
                const endPositions: Record<string, { left: string; top: string }> = {};

                (newState.movedPieces ?? []).forEach((p) => {
                  endPositions[p.from] = positionToPixels(
                    notationToPosition(p.to),
                    80,
                    flipped
                  );
                });

                setMovingPiecePositions(endPositions);

              }, 20);


              setTimeout(async () => {
                await applyNewGameState(newState);
                clearSelection();
              }, 200);


              setTimeout(() => {
                setMovingPieces([]);
                setMovingPiecePositions({});
              }, 500);
            }

          }, 900);

          return;
        }


        if (selection.currentAction === "rock") {

          playEffect(
            createEffect(
              "rock",
              undefined,
              squareName
            ),
            500
          );

          setTimeout(async () => {

            const newState = executeSelectedCheat(
              gameState,
              "rock",
              squareName,
              squareName,
              magnetMode
            );

            if (newState) {
              await applyNewGameState(newState);
              clearSelection();
            }

          }, 400);

          return;
        }

        const newState = handleCheatClick(
          gameState,
          selection,
          squareName,
          magnetMode
        );

        if (newState) {
          applyNewGameState(newState);
          clearSelection();
        }

        return;
      }

      // Apply phase before move
      const stateToMove = applyPhaseBeforeMove(
        gameState,
        selection.selectedSquare
      );

      const movingPiece = stateToMove.board[selection.selectedSquare];

      if (movingPiece) {

        setMovingPiece({
          piece: movingPiece,
          from: selection.selectedSquare,
          to: squareName
        });

        setMovingPiecePosition(
          positionToPixels(
            notationToPosition(selection.selectedSquare),
            80,
            flipped
          )
        );

        setTimeout(() => {
          setMovingPiecePosition(
            positionToPixels(
              notationToPosition(squareName),
              80,
              flipped
            )
          );
        }, 10);
      }
      const capturedPiece = stateToMove.board[squareName];

      if (capturedPiece) {
        setCapturingSquare(squareName);

        if (capturedPiece.freezeTurns > 0) {
          playEffect(
            createEffect(
              "freeze-break",
              undefined,
              squareName
            ),
            CAPTURE_ANIMATION_TIME
          );
        }
        else {
          playEffect(
            createEffect(
              "capture",
              undefined,
              squareName,
              capturedPiece
            ),
            CAPTURE_ANIMATION_TIME
          );
        }
      }
      setTimeout(async () => {

        const moveResult = moveSelectedPiece(
          stateToMove,
          selection.selectedSquare,
          squareName
        );

        const newState = moveResult.state;

        const targetPiece = stateToMove.board[squareName];

        const wasBombExplosion =
          targetPiece &&
          (targetPiece.hasBomb || stateToMove.board[selection.selectedSquare]?.hasBomb);

        if (wasBombExplosion) {
          playEffect(
            createEffect(
              "bomb",
              undefined,
              squareName
            ),
            500
          );

          triggerShake();
        }

        // Dash second move
        const dashResult = handleDashSecondMove(
          stateToMove,
          newState,
          squareName
        );



        if (dashResult) {

          if (dashResult.finished) {
            setGameState(dashResult.state);
            clearSelection();

            setMovingPiece(null);
            setMovingPiecePosition(null);
            setCapturingSquare(null);

            return;
          }

          setGameState(dashResult.state);
          setSelection(prev => ({
            ...prev,
            selectedSquare: dashResult.selectedSquare,
            validMoves: dashResult.validMoves
          }));

          setMovingPiece(null);
          setMovingPiecePosition(null);
          setCapturingSquare(null);

          return;
        }


        // Normal ending
        const finishedState = finishMove(newState);

        setGameState({
          ...finishedState,
        });

        if (gameId) {
          await sendGameState(gameId, finishedState);
        }

        if (finishedState.message) {
          setTimeout(() => {
            setGameState(prev => ({
              ...prev,
              message: ""
            }));
          }, MESSAGE_HANG_TIME);
        } clearSelection();

        setMovingPiece(null);
        setMovingPiecePosition(null);
        setCapturingSquare(null);

        // Check for checkmate
        if (finishedState.status === "checkmate") {
          onGameOver(
            finishedState.currentTurn === "white"
              ? "black"
              : "white"
          );
        }



        setMovingPiece(null);
      }, 200);

      return;
    }



    // Selecting piece

    const clickedPiece = gameState.board[squareName];

    if (clickedPiece && clickedPiece.color !== playerColor) {
      clearSelection();
      return;
    }

    const result = selectPiece(gameState, squareName);

    if (result) {

      if (
        gameState.activeCheat.dashSecondMove &&
        squareName !== gameState.activeCheat.dashSquare
      ) {
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

  function getSquareMarker(
    squareName: string,
    piece: Piece | null,
    action: string
  ) {

    if (!selection.validMoves.includes(squareName)) {
      return null;
    }


    if (action === "gun") {
      return <div className="gun-marker">🎯</div>;
    }


    if (action === "freeze") {
      return <div className="freeze-marker">❄</div>;
    }


    if (piece) {
      return <div className="capture-marker">✕</div>;
    }


    return <div className="move-marker"></div>;
  }

  function clearSelection() {
    setSelection(resetSelection());
  }

  function handleUpdateTargets(action: "move" | CheatType) {

    if (
      action === "bomb" &&
      selection.selectedSquare
    ) {
      const newState = executeSelectedCheat(
        gameState,
        "bomb",
        selection.selectedSquare,
        selection.selectedSquare,
        magnetMode
      );

      if (newState) {
        applyNewGameState(newState);
        clearSelection();
      }

      return;
    }


    const result = updateTargets(
      action,
      gameState,
      selection.selectedSquare
    );

    setSelection({
      selectedSquare: action === "rock"
        ? ""
        : selection.selectedSquare,
      currentAction: result.currentAction,
      validMoves: result.validMoves
    });
  }

  function fireGun(effect: ActiveEffect) {
    const target = effect.targetSquare;

    if (!target) return;

    const piece = gameState.board[target];

    if (!piece) return;

    setGameState(prev => {
      const updatedPiece = {
        ...piece,
        capturing: true
      };


      return {
        ...prev,
        board: {
          ...prev.board,
          [target]: updatedPiece
        }
      };
    });

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        board: {
          ...prev.board,
          [target]: null
        }
      }));
    }, 700);
  }
  /*
    function showTempoMessage(message: string) {
      setGameState(prev => ({
        ...prev,
        message
      }));
  
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          message: ""
        }));
      }, 3000);
    }
      */

  function triggerShake() {
    setShaking(true);

    setTimeout(() => {
      setShaking(false);
    }, 150);
  }

  async function applyNewGameState(newState: GameState) {
    setGameState(newState);

    if (gameId) {
      await sendGameState(gameId, newState);
    }
  }

  return (
    <>
      <div className="game-container">
        <GameInfo
          currentTurn={gameState.currentTurn}
          status={gameState.status}
          currentAction={selection.currentAction}
          whiteTempo={gameState.whiteTempo}
          blackTempo={gameState.blackTempo}
          autoFlip={autoFlip}
          setAutoFlip={setAutoFlip}
          message={gameState.message}

        />


        <div className={`board-wrapper ${shaking ? "shake" : ""}`}>
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
                      ${gameState.terrain[squareName] === "rock" ? "rock-square" : ""}
                      `}
                      key={squareName}
                      onClick={() => processSquareClick(squareName)}
                    >

                      {piece &&
                        !(movingPiece?.from === squareName) &&
                        !(movingPieces.some(p => p.from === squareName)) &&
                        !(capturingSquare === squareName) && (
                          <>
                            <PieceImage
                              piece={piece}
                              className={[
                                gameState.activeCheat.dashActive &&
                                  gameState.activeCheat.dashSquare === squareName
                                  ? "dash-piece"
                                  : "",

                                gameState.activeCheat.phaseActive &&
                                  piece.isPhased
                                  ? "phased-piece"
                                  : "",

                                gameState.royalDecreeActive &&
                                  piece.type === "king" &&
                                  piece.color === gameState.currentTurn
                                  ? "royal-piece"
                                  : ""

                              ].join(" ")}
                            />
                            {piece.hasBomb && (
                              <img
                                src={bomb}
                                className="bomb-attached"
                              />
                            )}
                            {gameState.royalDecreeActive &&
                              piece.type === "king" &&
                              piece.color === gameState.currentTurn && (
                                <img
                                  src={crown}
                                  className="crown-overlay"
                                />
                              )}
                            {piece.freezeTurns > 0 && (
                              <img
                                src={iceCube}
                                className="ice-overlay"
                              />
                            )}
                          </>
                        )}

                      {gameState.terrain[squareName] === "rock" && (
                        <img
                          src={rock}
                          className="placed-rock"
                        />
                      )}
                      {getSquareMarker(
                        squareName,
                        piece,
                        selection.currentAction
                      )}
                    </div>
                  );

                })}

              </div>

            ))}

          </div>



          {movingPiece && movingPiecePosition && (
            <div
              className={`moving-piece ${gameState.activeCheat.dashActive
                ? "dash-moving"
                : ""
                } ${gameState.royalDecreeActive &&
                  movingPiece.piece.type === "king"
                  ? "royal-moving"
                  : ""
                }`}
              style={movingPiecePosition}
            >
              <PieceImage piece={movingPiece.piece} />
            </div>
          )}

          {movingPieces.map((p) => (
            <div
              key={p.from}
              className="moving-piece"
              style={movingPiecePositions[p.from]}
            >
              <PieceImage piece={p.piece} />
            </div>
          ))}

          <EffectOverlay
            effects={activeEffects}
            playEffect={playEffect}
            fireGun={fireGun}
            flipped={flipped}
          />

        </div>

        <TempoDisplay
          whiteTempo={gameState.whiteTempo}
          blackTempo={gameState.blackTempo}
        />





        <ActionButtons
          updateTargets={handleUpdateTargets}
          canAfford={(cheat) => canAfford(gameState, cheat)}
          magnetMode={magnetMode}
          setMagnetMode={setMagnetMode}
          dashActive={gameState.activeCheat.dashActive}
          availableCheats={availableCheats}
          currentAction={selection.currentAction}
          currentTurn={gameState.currentTurn}
          playerColor={playerColor}
        />

      </div>
    </>
  );
}

export default ChessBoard;