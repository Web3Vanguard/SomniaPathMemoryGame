# Path Memory Game

A memory-based path game built with React + Vite, featuring Web3 wallet integration via WalletConnect.

## Features

- 🎮 Interactive memory game with increasing difficulty
- 🔗 Web3 wallet connection via WalletConnect
- 🎨 Modern, responsive UI
- 🎵 Sound effects for game interactions
- 📱 Mobile-friendly design

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- WalletConnect Project ID (get one from [WalletConnect Cloud](https://cloud.walletconnect.com))

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here
   VITE_SOMNIA_ENABLED=true
   ```
   
   Get your Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)
   
   **Note:** Somnia data streams integration is optional. Set `VITE_SOMNIA_ENABLED=true` to enable publishing level completion data to Somnia blockchain.

3. **Move assets to public directory:**
   ```bash
   mkdir -p public/fonts
   cp fonts/PressStart2P-Regular.ttf public/fonts/
   ```

4. **Update CSS font path:**
   The font path in `src/index.css` should point to `/fonts/PressStart2P-Regular.ttf`

## Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Building

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
PathMemoryGame/
├── public/              # Static assets
│   └── fonts/          # Font files
├── src/
│   ├── components/     # React components
│   │   ├── WalletConnect.tsx
│   │   ├── MenuScreen.tsx
│   │   ├── HowToPlayScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── LevelCompleteScreen.tsx
│   │   └── GameOverScreen.tsx
│   ├── config/         # Configuration files
│   │   └── walletConfig.ts
│   ├── hooks/          # Custom React hooks
│   │   └── useGame.ts
│   ├── utils/          # Utility functions
│   │   └── audio.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── package.json
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## Game Rules

1. Watch the path shown by highlighted tiles
2. Remember the sequence
3. Repeat the path by clicking tiles in order
4. Complete all levels to win!
5. You have 3 lives - make a mistake and lose a life

## Wallet Integration

The game includes WalletConnect integration, allowing players to connect their Web3 wallets. The wallet connection is optional and doesn't affect gameplay - it's ready for future blockchain features.

Supported wallets:
- MetaMask
- WalletConnect
- Coinbase Wallet
- And more via WalletConnect protocol

## Technologies Used

- React 18
- TypeScript
- Vite
- Wagmi v2
- Web3Modal v4
- WalletConnect

## License

This project is licensed under the Apache License 2.0.
