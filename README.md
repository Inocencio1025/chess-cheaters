# Chess Cheaters

## Live Demo

[Play Chess Cheaters](https://chess-cheaters-indol.vercel.app)

## About

Chess Cheaters is a real-time multiplayer arcade chess game where players compete in traditional chess while using unique cheats and abilities to disrupt the game.

The project was built from the ground up with a custom chess engine, multiplayer synchronization, and custom gameplay mechanics.

## Features

- Real-time online multiplayer
- Custom chess engine and game rules
- 9 unique cheats with different abilities
- Tempo system for earning and spending cheats
- Custom visual effects and animations
- Match creation and shareable game links
  
## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- C#
- .NET 9
- ASP.NET Core
- SignalR

### Deployment
- Vercel — Frontend
- Render — Backend
- GitHub — Source Control

## Architecture

The application is split into a React/TypeScript frontend and an ASP.NET Core backend.

- The frontend handles the UI, chess board, game logic, cheats, animations, and player interactions.
- The backend uses SignalR to manage real-time communication between players.
- Players connect to the same game session using a unique match ID.
- Game events are synchronized between connected clients through the SignalR hub.

```text
Player 1 ──┐
           ├── SignalR ──> ASP.NET Core Server
Player 2 ──┘                    │
                                ↓
                           Game Session
```

## Cheats

Players earn Tempo by making progress during the game and can spend it to activate special cheats.

| Cheat | Cost | Description |
|---|---:|---|
| 🔫 Gun | 2 | Capture an opposing piece from a distance without moving. The piece pulls out a gun and fires at the target. |
| 💣 Bomb | 3 | Attach a bomb to one of your pieces. If another piece makes contact with it, both pieces are destroyed. |
| ❄️ Freeze | 3 | Freeze a piece, preventing it from moving for a turn. Frozen pieces can still be captured or shattered. |
| 👻 Phase | 3 | Move a piece through other pieces without capturing them. |
| 🧲 Magnet | 3 | Push or pull all nearby pieces one square in a chosen direction. |
| 👑 Royal Decree | 4 | Allows the King to move like a Queen for one turn. |
| ⚡ Dash | 4 | Move a piece twice in a single turn, but the second move cannot capture. |
| 💨 Force Push | 4 | The King pushes all surrounding pieces away from it by one square. |
| 🪨 Rock | 4 | Creates an obstacle that pieces cannot move through. A piece can land on the Rock and then move forward on its next turn. |

## 📸 Screenshots

### Home Screen
![Home Screen](<img width="1920" height="916" alt="Screenshot (661)" src="https://github.com/user-attachments/assets/858b8380-e2bf-41d2-858d-bb719a71b0d6" />
)

### Cheat Selection
![Cheat Selection](<img width="1920" height="913" alt="Screenshot (662)" src="https://github.com/user-attachments/assets/b56f0312-62d3-430e-b0d4-6481944207a8" />
)

### Match Lobby
![Match Lobby](<img width="783" height="575" alt="Screenshot (663)" src="https://github.com/user-attachments/assets/ba1aa3b9-85f9-41e6-8b30-060bef01d48c" />
)

### Gameplay
![Gameplay](<img width="828" height="927" alt="Screenshot (664)" src="https://github.com/user-attachments/assets/289d1742-dee0-440d-aa38-32b9cda1f442" />
)
![Gun Cheat](<img width="286" height="233" alt="Screenshot (665)" src="https://github.com/user-attachments/assets/1ae68ed6-b0be-4a8b-9694-c6ba3aee8919" />
)


## Running Locally

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
dotnet run
```

## Challenges & What I Learned

- Designed and implemented a custom chess engine and game-state system.
- Sychronnize multiplayer communication using ASP.NET Core SignalR.
- Designed a modular cheat system that integrates with traditional chess rules.
- Learned how to deploy a React frontend and .NET backend as separate production services.
- Configured CORS and client/server communication across Vercel and Render.
- Designed a tempo-based resource system to balance the game's special abilities.

## Future Improvements

- More bugs than a Sahara, need to fix lol
- Mobile version is in dire need of polish 
- More 'cheats'
- More Board variety
- Various polish and fixes
- At first when i started this project, I had plans for a singleplayer mode, inspired by classic megaman. The idea is to have 8 opponents (bosses) to pick from in any order, and when you play again them the boss will start using 'cheats' of a certain theme. When you defeated the boss, you would obtain their cheat ability to use against other bosses. Ideally, in classic megaman fashion, has each 'cheat' be the weakness of another boss. In the end, you would have accumulated all the cheat abilities. This idea, however, would involve a lot of time in the AI and singleplayer aspects, and for the sake of time I create sort of a player vs player prototype to playtest the abilities first, and here we are. As many ideas as i had plan, I wont be developing the singleplayer until I get traction or good reception on the version I have now.

## Author

Rolando Inocencio

- GitHub: [YOUR_GITHUB_USERNAME](https://github.com/Inocencio1025/chess-cheaters)
- Live Demo: [Chess Cheaters](https://chess-cheaters-indol.vercel.app)
