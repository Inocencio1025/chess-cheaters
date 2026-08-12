import type { GameState } from "./GameState";
import { getLegalMoves } from "./MoveLogic";
import { getCheatCost, executeCheat, getCheatTargets, type CheatType as CheatType } from "../cheats/CheatManager";
import { makeMove } from "./GameActions";
import { endTurn } from "./TurnLogic";
import { files, ranks } from "./BoardConstants";

export type ActionType = "move" | CheatType;

export type SelectionState = {
  selectedSquare: string;
  validMoves: string[];
  currentAction: ActionType;
};



export function handleCheatClick(
  gameState: GameState,
  selection: SelectionState,
  squareName: string,
  magnetMode: "pull" | "push"
): GameState | null {
  const newState = executeSelectedCheat(
    gameState,
    selection.currentAction,
    selection.selectedSquare,
    squareName,
    magnetMode
  );

  return newState;
}

export function resetSelection(): SelectionState {
  return {
    selectedSquare: "",
    validMoves: [],
    currentAction: "move"
  };
}

export function canAfford(
  gameState: GameState,
  cheat: CheatType
): boolean {

  const tempo =
    gameState.currentTurn === "white"
      ? gameState.whiteTempo
      : gameState.blackTempo;

  return tempo >= getCheatCost(cheat);
}

export function updateTargets(
  action: ActionType,
  gameState: GameState,
  selectedSquare: string
): {
  gameState: GameState;
  currentAction: ActionType;
  validMoves: string[];
} {


  if (action === "rock") {
    return {
      gameState,
      currentAction: action,
      validMoves: ranks.flatMap(rank =>
        files
          .map(file => `${file}${rank}`)
          .filter(square =>
            !gameState.board[square] &&
            !gameState.terrain[square]
          )
      )
    };
  }

  if (action === "freeze") {
    return {
      gameState,
      currentAction: action,
      validMoves: Object.keys(gameState.board).filter(square => {
        const piece = gameState.board[square];

        return piece !== null &&
          piece.color !== gameState.currentTurn;
      })
    };
  }

  if (action === "bomb" && !selectedSquare) {
    return {
      gameState,
      currentAction: action,
      validMoves: Object.keys(gameState.board).filter(square => {
        const piece = gameState.board[square];

        return piece !== null &&
          piece.color === gameState.currentTurn;
      })
    };
  }

  if (action === "dash" && !selectedSquare) {
    return {
      gameState,
      currentAction: action,
      validMoves: Object.keys(gameState.board).filter(square => {
        const piece = gameState.board[square];

        return piece !== null &&
          piece.color === gameState.currentTurn;
      })
    };
  }

  if (action === "phase" && !selectedSquare) {

    const validMoves = Object.keys(gameState.board).filter(square => {
      const piece = gameState.board[square];

      return piece !== null &&
        piece.color === gameState.currentTurn;
    });


    return {
      gameState,
      currentAction: action,
      validMoves
    };
  }

  const selectedPiece = gameState.board[selectedSquare];

  if (!selectedPiece) {
    return {
      gameState,
      currentAction: action,
      validMoves: []
    };
  }

  if (action === "phase" && selectedSquare) {

    const newState = executeCheat(
      "phase",
      gameState,
      selectedSquare
    );

    return {
      gameState: newState,
      currentAction: "move",
      validMoves: getLegalMoves(
        newState.board[selectedSquare]!,
        selectedSquare,
        newState.board,
        newState.terrain,
        newState.moveHistory,
        newState.royalDecreeActive
      )
    };
  }






  if (action === "royal-decree") {
    const newState = executeCheat(
      "royal-decree",
      gameState,
      ""
    );

    return {
      gameState: newState,
      currentAction: "move",
      validMoves: getLegalMoves(
        selectedPiece,
        selectedSquare,
        newState.board,
        newState.terrain,
        newState.moveHistory,
        true,
      )
    };
  }


  if (action === "force-push") {
    if (selectedPiece.type !== "king") {
      return {
        gameState,
        currentAction: action,
        validMoves: []
      };
    }

    return {
      gameState,
      currentAction: action,
      validMoves: [selectedSquare]
    };
  }


  if (action === "move") {
    return {
      gameState,
      currentAction: "move",
      validMoves: getLegalMoves(
        selectedPiece,
        selectedSquare,
        gameState.board,
        gameState.terrain,
        gameState.moveHistory,
        gameState.royalDecreeActive,
      )
    };
  }

  if (action === "dash" && selectedSquare) {
    return {
      gameState: executeCheat(
        "dash",
        gameState,
        selectedSquare,
        selectedSquare
      ),
      currentAction: "move",
      validMoves: getLegalMoves(
        selectedPiece,
        selectedSquare,
        gameState.board,
        gameState.terrain,
        gameState.moveHistory,
        gameState.royalDecreeActive
      )
    };
  }

  return {
    gameState,
    currentAction: action,
    validMoves: getCheatTargets(
      action,
      selectedPiece,
      selectedSquare,
      gameState
    )
  };
}

export function selectPiece(
  gameState: GameState,
  squareName: string
) {
  const piece = gameState.board[squareName];

  // Selecting piece
  if (piece) {

    if (piece.color !== gameState.currentTurn) {
      return null;
    }

    if (piece.freezeTurns > 0) {
      return null;
    }

    return {
      selectedSquare: squareName,
      validMoves: getLegalMoves(
        piece,
        squareName,
        gameState.board,
        gameState.terrain,
        gameState.moveHistory,
        gameState.royalDecreeActive,
      )
    };
  }

  return null;
}

export function executeSelectedCheat(
  gameState: GameState,
  action: ActionType,
  selectedSquare: string,
  targetSquare: string,
  magnetMode: "pull" | "push"
) {

  if (action === "move") {
    return null;
  }
  if (action === "rock") {
    return executeCheat(
      "rock",
      gameState,
      targetSquare
    );
  }

  if (action === "freeze") {
    return executeCheat(
      "freeze",
      gameState,
      targetSquare
    );
  }

  if (action === "phase") {

    const square = selectedSquare || targetSquare;

    return executeCheat(
      "phase",
      gameState,
      square
    );
  }



  return executeCheat(
    action,
    gameState,
    targetSquare,
    selectedSquare,
    magnetMode
  );
}

export function moveSelectedPiece(
  gameState: GameState,
  from: string,
  to: string
) {

  const capturedPiece = gameState.board[to];

  const result = makeMove(
    gameState,
    from,
    to,
    false
  );

  return {
    state: result,
    capturedPiece,
    capturedSquare: capturedPiece ? to : null
  };
}

export function applyPhaseBeforeMove(
  gameState: GameState,
  square: string
): GameState {

  if (!gameState.activeCheat.phaseActive) {
    return gameState;
  }

  return {
    ...gameState,
    board: {
      ...gameState.board,
      [square]: {
        ...gameState.board[square]!,
        isPhased: true
      }
    }
  };
}

export function handleDashSecondMove(
  gameState: GameState,
  newState: GameState,
  squareName: string
) {

  if (
    !gameState.activeCheat.dashActive
  ) {
    return null;
  }

  if (gameState.activeCheat.dashSecondMove) {
    return {
      finished: true as const,
      state: endTurn(
        newState,
        newState.board,
        newState.moveHistory
      )
    };
  }

  const dashState = {
    ...newState,
    activeCheat: {
      ...newState.activeCheat,
      dashSecondMove: true,
      dashSquare: squareName
    }
  };

  const movedPiece = dashState.board[squareName];

  if (!movedPiece) {
    return null;
  }

  const moves = getLegalMoves(
    movedPiece,
    squareName,
    dashState.board,
    dashState.terrain,
    dashState.moveHistory,
    dashState.royalDecreeActive,
    true
  );

  if (moves.length === 0) {
    return {
      finished: true as const,
      state: endTurn(
        {
          ...dashState,
          activeCheat: {
            dashActive: false,
            dashSecondMove: false,
            phaseActive: false
          }
        },
        dashState.board,
        dashState.moveHistory
      )
    };
  }

  return {
    finished: false as const,
    state: dashState,
    selectedSquare: squareName,
    validMoves: moves
  };
}

export function finishMove(
  gameState: GameState
): GameState {

  return endTurn(
    {
      ...gameState,
      activeCheat: {
        dashActive: false,
        dashSecondMove: false,
        phaseActive: false
      }
    },
    gameState.board,
    gameState.moveHistory
  );
}
