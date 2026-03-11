import { useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { StartScreen } from './components/StartScreen';
import { GameProvider } from './components/GameContext';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 overflow-hidden">
        {!gameStarted ? (
          <StartScreen onStart={() => setGameStarted(true)} />
        ) : (
          <GameBoard />
        )}
      </div>
    </GameProvider>
  );
}
