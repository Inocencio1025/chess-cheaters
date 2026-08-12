import { HubConnectionBuilder } from "@microsoft/signalr";
import type { GameState } from "../chess/GameState";

export const gameConnection = new HubConnectionBuilder()
  .withUrl("https://chess-cheaters-server.onrender.com/game")
  .withAutomaticReconnect()
  .build();

export async function connectToGame() {
  try {
    gameConnection.off("ReceiveMessage");

    gameConnection.on("ReceiveMessage", (message: string) => {
      console.log("Server message:", message);
    });

    gameConnection.on("PlayerJoined", () => {
      console.log("A player joined the game!");
    });

    gameConnection.on("MatchReady", () => {
      console.log("Match is ready!");
    });

    if (gameConnection.state === "Disconnected") {
      await gameConnection.start();
    }

    while (gameConnection.state !== "Connected") {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log("Connected to game server!");
  } catch (error) {
    console.error("Failed to connect:", error);
  }
}

export async function createGame(): Promise<string> {
  const gameId = await gameConnection.invoke<string>("CreateGame");

  return `${window.location.origin}/game/${gameId}`;
}

export async function joinGame(gameId: string): Promise<boolean> {
  return await gameConnection.invoke<boolean>("JoinGame", gameId);
}

export async function playerReady(gameId: string) {
  await gameConnection.invoke("PlayerReady", gameId);
}

export function onMatchReady(callback: () => void) {
  gameConnection.on("MatchReady", callback);
}

export function onMatchStarted(callback: () => void) {
  gameConnection.on("MatchStarted", callback);
}

gameConnection.on("MatchStarted", () => {
  console.log("Match started!");
});

export function onPlayerColorAssigned(
  callback: (color: "white" | "black") => void
) {
  gameConnection.on("PlayerColorAssigned", callback);
}

export async function sendMessage(message: string) {
  await gameConnection.invoke("SendMessage", message);
}

export async function sendGameState(
  gameId: string,
  gameState: GameState
) {
  await gameConnection.invoke("UpdateGameState", gameId, gameState);
}

export function onGameStateUpdated(
  callback: (gameState: GameState) => void
) {
  gameConnection.on("GameStateUpdated", callback);
}