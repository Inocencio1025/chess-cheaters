using Microsoft.AspNetCore.SignalR;

namespace server.Hubs;

public class GameHub : Hub
{
  private static readonly Dictionary<string, HashSet<string>> readyPlayers = new();
  private static readonly Dictionary<string, string> playerColors = new();
  private static readonly Dictionary<string, string> gameHosts = new();

  private static readonly Random random = new();

  public async Task<string> CreateGame()
  {
    string gameId = Guid.NewGuid().ToString();

    await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

    string hostColor = random.Next(2) == 0 ? "white" : "black";

    playerColors[Context.ConnectionId] = hostColor;
    gameHosts[gameId] = Context.ConnectionId;

    await Clients.Caller.SendAsync(
        "PlayerColorAssigned",
        hostColor
    );

    return gameId;
  }

  public async Task<bool> JoinGame(string gameId)
  {
    await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

    if (!gameHosts.TryGetValue(gameId, out var hostConnectionId))
      return false;

    string hostColor = playerColors[hostConnectionId];

    string playerColor =
        hostColor == "white" ? "black" : "white";

    playerColors[Context.ConnectionId] = playerColor;

    await Clients.Group(gameId).SendAsync("MatchReady");

    await Clients.Caller.SendAsync(
        "PlayerColorAssigned",
        playerColor
    );

    return true;
  }

  public async Task PlayerReady(string gameId)
  {
    if (!readyPlayers.ContainsKey(gameId))
      readyPlayers[gameId] = new HashSet<string>();

    readyPlayers[gameId].Add(Context.ConnectionId);

    if (readyPlayers[gameId].Count >= 2)
    {
      await Clients.Group(gameId).SendAsync("MatchStarted");
      readyPlayers.Remove(gameId);
    }
  }

  public async Task UpdateGameState(string gameId, object gameState)
  {
    await Clients.Group(gameId).SendAsync(
        "GameStateUpdated",
        gameState
    );
  }
}