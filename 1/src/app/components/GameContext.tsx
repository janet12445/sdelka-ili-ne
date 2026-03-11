import { createContext, useContext, useState, ReactNode } from 'react';

interface Box {
  id: number;
  amount: number;
  opened: boolean;
  isPlayerBox: boolean;
}

interface Player {
  id: 'player1' | 'player2';
  name: string;
  avatar: string;
}

interface GameContextType {
  boxes: Box[];
  setBoxes: (boxes: Box[]) => void;
  currentPlayer: 'player1' | 'player2';
  setCurrentPlayer: (player: 'player1' | 'player2') => void;
  playerBox: number | null;
  setPlayerBox: (box: number | null) => void;
  boxesOpenedThisRound: number;
  setBoxesOpenedThisRound: (count: number) => void;
  bankerOffer: number | null;
  setBankerOffer: (offer: number | null) => void;
  gamePhase: 'setup' | 'select' | 'opening' | 'deal' | 'final' | 'finished';
  setGamePhase: (phase: 'setup' | 'select' | 'opening' | 'deal' | 'final' | 'finished') => void;
  score: { player1: number; player2: number };
  setScore: (score: { player1: number; player2: number }) => void;
  players: { player1: Player; player2: Player };
  setPlayers: (players: { player1: Player; player2: Player }) => void;
  streak: number;
  setStreak: (streak: number) => void;
  multiplier: number;
  setMultiplier: (multiplier: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const PRIZE_AMOUNTS = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000,
  5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000
];

export function GameProvider({ children }: { children: ReactNode }) {
  const [boxes, setBoxes] = useState<Box[]>(() => {
    const shuffled = [...PRIZE_AMOUNTS].sort(() => Math.random() - 0.5);
    return shuffled.map((amount, index) => ({
      id: index + 1,
      amount,
      opened: false,
      isPlayerBox: false
    }));
  });

  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');
  const [playerBox, setPlayerBox] = useState<number | null>(null);
  const [boxesOpenedThisRound, setBoxesOpenedThisRound] = useState(0);
  const [bankerOffer, setBankerOffer] = useState<number | null>(null);
  const [gamePhase, setGamePhase] = useState<'setup' | 'select' | 'opening' | 'deal' | 'final' | 'finished'>('setup');
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [players, setPlayers] = useState({
    player1: {
      id: 'player1' as const,
      name: 'Бойко Борисов',
      avatar: 'https://cache2.24chasa.bg/Images/Cache/192/IMAGE_22424192_804_0.jpg'
    },
    player2: {
      id: 'player2' as const,
      name: 'Румен Радев',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Rumen-Radev-with-Frank-Walter-Steinmeier_%28cropped%29.jpg'
    }
  });
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  return (
    <GameContext.Provider
      value={{
        boxes,
        setBoxes,
        currentPlayer,
        setCurrentPlayer,
        playerBox,
        setPlayerBox,
        boxesOpenedThisRound,
        setBoxesOpenedThisRound,
        bankerOffer,
        setBankerOffer,
        gamePhase,
        setGamePhase,
        score,
        setScore,
        players,
        setPlayers,
        streak,
        setStreak,
        multiplier,
        setMultiplier
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}