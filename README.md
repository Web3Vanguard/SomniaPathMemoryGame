<div align="center">
  <img src="/public/logo.png" alt="Path Memory Game Logo" width="200" />
  <h1>Path Memory Game</h1>
  <p><strong>A retro-futuristic memory challenge powered by the Somnia Blockchain.</strong></p>
  
  [![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
  [![Somnia](https://img.shields.io/badge/Powered%20by-Somnia-purple.svg)](https://somnia.network/)
</div>

## 💡 Inspiration
We wanted to bring the classic "Simon Says" memory mechanic into the Web3 era, wrapping it in a nostalgic 8-bit arcade aesthetic. The goal was to create a fun, engaging way to demonstrate seamless blockchain integration without interrupting the gameplay flow. We believe that the best Web3 games use blockchain to enhance the experience, not complicate it.

## 🎮 What it does
Path Memory Game is a progressive memory challenge where players must memorize and repeat increasingly complex paths on a grid.

- **Play**: Test your memory across 15 levels of increasing difficulty.
- **Connect**: Link your Web3 wallet via WalletConnect to save your progress.
- **Compete**: Your level completion data (score, time, lives) is published directly to the **Somnia Blockchain** via data streams, creating an immutable record of your achievements.

## ⚙️ How we built it
- **Frontend**: Built with **React** and **Vite** for a fast, responsive experience.
- **Styling**: Custom CSS with a "Press Start 2P" font to nail the retro arcade vibe.
- **Blockchain**: Integrated **Somnia** data streams to publish game events.
- **Wallet**: Used **WalletConnect** and **Wagmi** for seamless wallet connection.
- **Design**: Generated custom pixel art assets to ensure a cohesive visual identity.

## 🚧 Challenges we ran into
Integrating the Somnia data streams while maintaining a smooth 60fps gameplay loop was a challenge. We had to ensure that the blockchain transactions happened asynchronously without freezing the UI or delaying the next level. Handling various wallet states (connected, disconnected, wrong network) also required careful state management to prevent user frustration.

## 🏆 Accomplishments that we're proud of
We're particularly proud of the "invisible" blockchain integration. The game feels like a classic arcade game, but every victory is recorded on-chain. The generated pixel art logo and the cohesive neon aesthetic also turned out great, creating a polished, professional feel for the prototype.

## 🧠 What we learned
We gained a deep understanding of the Somnia protocol and how to structure game data for efficient on-chain storage. We also learned a lot about optimizing React for game loops and managing complex state transitions between game logic and blockchain events.

## 🚀 What's next for Path Memory Game
- **Global Leaderboards**: Querying the Somnia chain to display top players in real-time.
- **NFT Rewards**: Minting unique pixel art NFTs for completing all 15 levels.
- **Multiplayer**: A real-time "battle mode" where players challenge each other to complete patterns faster.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- WalletConnect Project ID (get one from [WalletConnect Cloud](https://cloud.walletconnect.com))

### Installation

1. **Clone the repo and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here
   VITE_SOMNIA_ENABLED=true
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## 📜 License
This project is licensed under the Apache License 2.0.
