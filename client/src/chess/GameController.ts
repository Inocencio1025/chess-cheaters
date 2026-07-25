import type { GameState } from "./GameState";
import { getLegalMoves } from "./MoveLogic";
import { getPowerCost, executePower, getPowerTargets, preparePower, type PowerType } from "../powers/PowerManager";
import { makeMove } from "./GameActions";
import { endTurn } from "./TurnLogic";
import { files, ranks } from "./BoardConstants";
import { usePhase } from "../powers/PowerHandlers";

export type ActionType = "move" | PowerType;

export type SelectionState = {
  selectedSquare: string;
  validMoves: string[];
  currentAction: ActionType;
};



export function handlePowerClick(
  gameState: GameState,
  selection: SelectionState,
  squareName: string,
  magnetMode: "pull" | "push"
): GameState | null {
  const newState = executeSelectedPower(
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
  power: PowerType
): boolean {

  const momentum =
    gameState.currentTurn === "white"
      ? gameState.whiteMomentum
      : gameState.blackMomentum;

  return momentum >= getPowerCost(power);
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

  const selectedPiece = gameState.board[selectedSquare];

  if (!selectedPiece) {
    return {
      gameState,
      currentAction: action,
      validMoves: []
    };
  }

  if (action === "dash") {

    if (gameState.activePower.dashActive) {

      const selectedPiece = gameState.board[selectedSquare];

      if (!selectedPiece) {
        return {
          gameState,
          currentAction: "move",
          validMoves: []
        };
      }

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
          false
        )
      };
    }

    const newState = preparePower(
      "dash",
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
        newState.royalDecreeActive,
      )
    };
  }


  if (action === "royal-decree") {
    const newState = executePower(
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
      gameState: executePower(
        "force-push",
        gameState,
        "",
        selectedSquare
      ),
      currentAction: "move",
      validMoves: []
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


  return {
    gameState,
    currentAction: action,
    validMoves: getPowerTargets(
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

export function executeSelectedPower(
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
    return executePower(
      "rock",
      gameState,
      targetSquare
    );
  }

  if (action === "freeze") {
    return executePower(
      "freeze",
      gameState,
      targetSquare
    );
  }

  if (action === "phase") {

    const phasedState = executePower(
      "phase",
      gameState,
      selectedSquare
    );

    return makeMove(
      phasedState,
      selectedSquare,
      targetSquare
    );
  }


  return executePower(
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
): GameState {

  return makeMove(
    gameState,
    from,
    to,
    false
  );
}

export function applyPhaseBeforeMove(
  gameState: GameState,
  square: string
): GameState {

  if (!gameState.activePower.phaseActive) {
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
    !gameState.activePower.dashActive
  ) {
    return null;
  }

  if (gameState.activePower.dashSecondMove) {
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
    activePower: {
      ...newState.activePower,
      dashSecondMove: true
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
          activePower: {
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

  console.log("finishMove", gameState.activePower);

  return endTurn(
    {
      ...gameState,
      activePower: {
        dashActive: false,
        dashSecondMove: false,
        phaseActive: false
      }
    },
    gameState.board,
    gameState.moveHistory
  );
}
