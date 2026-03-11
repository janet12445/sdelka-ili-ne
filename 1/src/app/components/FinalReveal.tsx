import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from './GameContext';
import { Trophy, RotateCcw } from 'lucide-react';

export function FinalReveal() {
  const {
    boxes,
    playerBox,
    currentPlayer,
    gamePhase,
    bankerOffer,
    score,
    setScore,
    setBoxes,
    setPlayerBox,
    setBoxesOpenedThisRound,
    setBankerOffer,
    setGamePhase,
    setCurrentPlayer,
    players,
  } = useGame();

  const [revealed, setRevealed] = useState(false);
  const [showSwap, setShowSwap] = useState(gamePhase === 'final');
  const [swapped, setSwapped] = useState(false);

  const playerBoxData = boxes.find(b => b.id === playerBox);
  const remainingBox = boxes.find(b => !b.opened && b.id !== playerBox);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('bg-BG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleSwap = () => {
    if (remainingBox && playerBoxData) {
      // Swap the boxes
      const newBoxes = boxes.map(b => {
        if (b.id === playerBox) {
          return { ...b, isPlayerBox: false };
        }
        if (b.id === remainingBox.id) {
          return { ...b, isPlayerBox: true };
        }
        return b;
      });
      setBoxes(newBoxes);
      setPlayerBox(remainingBox.id);
      setSwapped(true);
      setShowSwap(false);
    }
  };

  const handleKeep = () => {
    setShowSwap(false);
  };

  const handleReveal = () => {
    setRevealed(true);
    
    // Update score
    setTimeout(() => {
      if (gamePhase === 'finished') {
        // Player took the deal
        const newScore = { ...score };
        if (currentPlayer === 'player1') {
          newScore.player1 += bankerOffer || 0;
        } else {
          newScore.player2 += bankerOffer || 0;
        }
        setScore(newScore);
      } else if (playerBoxData) {
        // Player didn't take the deal, reveal their box
        const newScore = { ...score };
        if (currentPlayer === 'player1') {
          newScore.player1 += playerBoxData.amount;
        } else {
          newScore.player2 += playerBoxData.amount;
        }
        setScore(newScore);
      }
    }, 2000);
  };

  const handlePlayAgain = () => {
    // Reset game for next player
    const PRIZE_AMOUNTS = [
      0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000,
      5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000
    ];
    
    const shuffled = [...PRIZE_AMOUNTS].sort(() => Math.random() - 0.5);
    const newBoxes = shuffled.map((amount, index) => ({
      id: index + 1,
      amount,
      opened: false,
      isPlayerBox: false
    }));
    
    setBoxes(newBoxes);
    setPlayerBox(null);
    setBoxesOpenedThisRound(0);
    setBankerOffer(null);
    setGamePhase('select');
    setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
    setRevealed(false);
    setShowSwap(true);
    setSwapped(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0, rotateY: -180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ type: "spring", duration: 1 }}
        className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 max-w-4xl w-full shadow-2xl border-4 border-yellow-400 relative overflow-hidden"
      >
        {/* Confetti animation */}
        {revealed && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#FFD700', '#FF69B4', '#9D4EDD', '#00D9FF'][Math.floor(Math.random() * 4)],
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: Math.random() * 720,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-5xl font-black text-white mb-2">
              {gamePhase === 'finished' ? '💰 СДЕЛКА ПРИЕТА!' : '🎁 ФИНАЛЕН МОМЕНТ!'}
            </h2>
            <p className="text-2xl text-yellow-300 font-bold">
              {players[currentPlayer].name}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {showSwap && remainingBox && (
              <motion.div
                key="swap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mb-8"
              >
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-6 border-2 border-white/50">
                  <p className="text-white text-2xl font-bold mb-6">
                    Искаш ли да разменишкутията си с последната останала?
                  </p>

                  <div className="flex gap-8 justify-center mb-6">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-4xl font-black mb-2 shadow-xl">
                        {playerBox}
                      </div>
                      <p className="text-yellow-200 font-bold">ТВОЯТА</p>
                    </div>

                    <motion.div
                      animate={{ x: [0, 20, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="self-center text-5xl"
                    >
                      ↔️
                    </motion.div>

                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-black mb-2 shadow-xl">
                        {remainingBox.id}
                      </div>
                      <p className="text-pink-200 font-bold">ПОСЛЕДНАТА</p>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSwap}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full text-xl font-black shadow-xl"
                    >
                      ДА, РАЗМЕНЯМЕ! 🔄
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleKeep}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full text-xl font-black shadow-xl"
                    >
                      НЕ, ЗАДЪРЖАМ! 🛡️
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {!showSwap && !revealed && (
              <motion.div
                key="reveal-button"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(255, 215, 0, 0.5)',
                      '0 0 60px rgba(255, 215, 0, 0.8)',
                      '0 0 20px rgba(255, 215, 0, 0.5)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  onClick={handleReveal}
                  className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-12 py-6 rounded-full text-3xl font-black shadow-2xl"
                >
                  🎊 РАЗКРИЙ НАГРАДАТА! 🎊
                </motion.button>
              </motion.div>
            )}

            {revealed && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {gamePhase === 'finished' && bankerOffer !== null ? (
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-6 border-2 border-green-400">
                      <p className="text-white text-2xl font-bold mb-4">
                        Приела си сделката и спечели:
                      </p>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: 3 }}
                        className="text-7xl font-black text-green-300 mb-4"
                      >
                        {formatAmount(bankerOffer)} лв
                      </motion.div>
                      {playerBoxData && (
                        <p className="text-yellow-200 text-xl">
                          В кутията ти имаше: {formatAmount(playerBoxData.amount)} лв
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  playerBoxData && (
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-6 border-2 border-yellow-400">
                        {swapped && (
                          <p className="text-yellow-300 text-xl font-bold mb-4">
                            Разменихте кутиите! 🔄
                          </p>
                        )}
                        <p className="text-white text-2xl font-bold mb-4">
                          В кутия №{playerBox} има:
                        </p>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: 3 }}
                          className="text-7xl font-black text-yellow-300 mb-4"
                        >
                          {formatAmount(playerBoxData.amount)} лв
                        </motion.div>
                        <p className="text-green-300 text-2xl font-black">
                          {playerBoxData.amount >= 100000 ? '🎉 ОГРОМНА ПЕЧАЛБА!' : 
                           playerBoxData.amount >= 10000 ? '🎊 СТРАХОТНА ПЕЧАЛБА!' :
                           playerBoxData.amount >= 1000 ? '✨ ДОБРА ПЕЧАЛБА!' : '💪 Не се предавай!'}
                        </p>
                      </div>
                    </div>
                  )
                )}

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayAgain}
                  className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-black shadow-xl mx-auto"
                >
                  <RotateCcw className="w-6 h-6" />
                  {currentPlayer === 'player1' ? `РЕД НА ${players.player2.name.toUpperCase()}` : 'НОВА ИГРА'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}