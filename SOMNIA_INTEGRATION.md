# Somnia Data Streams Integration

This document describes the incremental integration of Somnia data streams for publishing level completion results.

## Chunk 1: Setup and Configuration ✅

### Files Changed:
- `package.json` - Added `@somnia-chain/streams` dependency
- `src/config/somniaChain.ts` - Created Dream chain configuration
- `src/types/somnia.ts` - Created TypeScript types for Somnia data
- `src/vite-env.d.ts` - Added `VITE_SOMNIA_ENABLED` environment variable
- `README.md` - Updated with Somnia setup instructions

### What to commit:
```bash
git add package.json src/config/somniaChain.ts src/types/somnia.ts src/vite-env.d.ts README.md
git commit -m "feat: Add Somnia data streams configuration (Chunk 1)"
```

### Description:
- Installed Somnia SDK dependency
- Created Dream chain configuration
- Added TypeScript types for level completion data
- Added environment variable for enabling/disabling Somnia
- Updated README with setup instructions

---

## Chunk 2: Somnia Service Utility ✅

### Files Changed:
- `src/services/somniaService.ts` - Created Somnia service class
- `src/hooks/useSomnia.ts` - Created React hook for Somnia integration

### What to commit:
```bash
git add src/services/somniaService.ts src/hooks/useSomnia.ts
git commit -m "feat: Add Somnia service and React hook (Chunk 2)"
```

### Description:
- Created `SomniaService` class to handle schema registration and data publishing
- Created `useSomnia` hook to integrate Somnia with React components
- Handles wallet connection and initialization
- Provides publishing functionality with error handling

### Features:
- Schema registration on Somnia blockchain
- Data encoding and publishing
- Wallet client integration
- Error handling and state management

---

## Chunk 3: Game Integration ✅

### Files Changed:
- `src/hooks/useGame.ts` - Added level timing tracking and completion callback
- `src/App.tsx` - Integrated Somnia publishing on level completion

### What to commit:
```bash
git add src/hooks/useGame.ts src/App.tsx
git commit -m "feat: Integrate Somnia publishing on level completion (Chunk 3)"
```

### Description:
- Added level start/end time tracking
- Added callback system for level completion events
- Integrated Somnia publishing when level is completed
- Publishes: playerAddress, levelCompleted, startTime, endTime, score, livesRemaining

### Features:
- Tracks level start time (when player can start interacting)
- Tracks level end time (when level is completed)
- Automatically publishes to Somnia when level completes
- Works with wallet connection status

---

## Chunk 4: UI Feedback and Error Handling ✅

### Files Changed:
- `src/components/LevelCompleteScreen.tsx` - Added Somnia publishing status display
- `src/index.css` - Added styles for Somnia status indicators
- `src/hooks/useSomnia.ts` - Improved error handling and state tracking

### What to commit:
```bash
git add src/components/LevelCompleteScreen.tsx src/index.css src/hooks/useSomnia.ts
git commit -m "feat: Add UI feedback and error handling for Somnia (Chunk 4)"
```

### Description:
- Added visual feedback for Somnia publishing status
- Shows publishing, success, and error states
- Improved error messages and handling
- Added loading states and user feedback

### Features:
- Visual indicators for publishing status
- Error messages with tooltips
- Success confirmation
- Disables "Next Level" button while publishing
- Handles wallet disconnection gracefully

---

## Environment Setup

Create a `.env` file in the root directory:

```env
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here
VITE_SOMNIA_ENABLED=true
```

## Usage

1. **Enable Somnia**: Set `VITE_SOMNIA_ENABLED=true` in `.env`
2. **Connect Wallet**: User must connect wallet to enable Somnia publishing
3. **Play Game**: Complete levels normally
4. **Automatic Publishing**: Level completion data is automatically published to Somnia blockchain
5. **View Status**: Check level complete screen for publishing status

## Data Schema

The following data is published to Somnia for each level completion:

```typescript
{
  playerAddress: string,      // Wallet address of the player
  levelCompleted: number,     // Level number (1-15)
  startTime: number,          // Unix timestamp (seconds) when level started
  endTime: number,            // Unix timestamp (seconds) when level completed
  score: number,              // Total score after level completion
  livesRemaining: number      // Number of lives remaining
}
```

## Error Handling

- **Wallet not connected**: Publishing is skipped silently
- **Somnia disabled**: Publishing is skipped silently
- **Publishing failed**: Error message is displayed to user
- **Transaction failed**: Error message with details is shown
- **Network issues**: Error is caught and displayed

## Testing

1. Connect wallet
2. Complete a level
3. Check console for publishing logs
4. Verify transaction on Somnia blockchain
5. Check level complete screen for status

## Future Enhancements

- Add transaction hash display
- Add link to view transaction on blockchain explorer
- Add retry mechanism for failed publishes
- Add batch publishing for multiple levels
- Add analytics dashboard for level completions

