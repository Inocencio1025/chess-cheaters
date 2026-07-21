import "./ChessBoard.css";
import { useState } from "react";
import { createGameState } from "../game/GameState";
import type { GameState } from "../game/GameState";
import type { Piece } from "../game/Piece";
import { getLegalMoves } from "../game/MoveLogic";
import { getGameStatus, movePiece } from "../game/GameLogic";

function getPieceSymbol(piece: Piece | null) {
  if (!piece) return "";

  const symbols = {
    white: {
      pawn: "♙",
      rook: "♖",
      knight: "♘",
      bishop: "♗",
      queen: "♕",
      king: "♔",
    },
    black: {
      pawn: "♟",
      rook: "♜",
      knight: "♞",
      bishop: "♝",
      queen: "♛",
      king: "♚",
    },
  };

  return symbols[piece.color][piece.type];
}

function ChessBoard() {
  const [selectedSquare, setSelectedSquare] = useState("");
  const [validMoves, setValidMoves] = useState<string[]>([]);

  const files = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8];

  const [gameState, setGameState] = useState<GameState>(
    createGameState()
  );

  function handleSquareClick(squareName: string) {
    const piece = gameState.board[squareName];

    // Moving a piece
    if (validMoves.includes(squareName)) {

      const result = movePiece(
        gameState.board,
        selectedSquare,
        squareName
      );

      const newBoard = result.board;
      const move = result.move;

      const nextTurn = gameState.currentTurn === "white"
        ? "black"
        : "white";

      const status = getGameStatus(
        nextTurn,
        newBoard,
        [...gameState.moveHistory, move]
      );

      setGameState(prev => ({
        ...prev,
        board: newBoard,
        currentTurn: nextTurn,
        moveHistory: [...prev.moveHistory, move],
        status,
        gameOver: status === "checkmate" || status === "stalemate"
      }));

      setSelectedSquare("");
      setValidMoves([]);

      if (status === "checkmate") {
        alert("Checkmate!");
      }

      return;
    }

    // Selecting a piece
    if (piece) {
      if (piece.color !== gameState.currentTurn) return;

      setSelectedSquare(squareName);
      setValidMoves(
        getLegalMoves(
          piece,
          squareName,
          gameState.board,
          gameState.moveHistory
        )
      );

      return;
    }

    // Clicking empty square
    setSelectedSquare("");
    setValidMoves([]);
  }

  return (
    <>
      <div className="chess-board">
        {[...ranks].reverse().map(rank => (
          <div className="rank" key={rank}>
            {files.map((file, fileIndex) => {
              const isLight = (rank + fileIndex) % 2 === 0;
              const squareName = `${file}${rank}`;
              const piece = gameState.board[squareName];

              return (
                <div
                  className={`
                    square 
                    ${isLight ? "light" : "dark"} 
                    ${selectedSquare === squareName ? "selected" : ""}
                    ${validMoves.includes(squareName) ? "valid-move" : ""}
                  `}
                  key={squareName}
                  onClick={() => {
                    handleSquareClick(squareName)
                  }}
                >
                  {getPieceSymbol(piece)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="selected-square">
        <p>
          {gameState.currentTurn}'s turn
        </p>

        <p>
          Status: {gameState.status}
        </p>

      </div>
    </>
  );
}

export default ChessBoard;