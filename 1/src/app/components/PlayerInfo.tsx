import { motion } from 'motion/react';
import { useGame } from './GameContext';
import { Trophy, Flame, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function PlayerInfo() {
  const { currentPlayer, score, players, streak, multiplier } = useGame();

  const currentPlayerData = players[currentPlayer];

  return (
    <div className="relative">
      {/* Crowd in background */}
      <div className="absolute inset-0 -top-10 opacity-10 pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1760421124157-3ee024d3bf00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlcmluZyUyMGNyb3dkJTIwYXVkaWVuY2UlMjBleGNpdGVkfGVufDF8fHx8MTc3MjYxMDU0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Crowd"
          className="w-full h-32 object-cover"
        />
      </div>

      <div className="flex justify-center gap-6 items-center relative z-10">
        {/* Player 1 */}
        <motion.div
          animate={{
            scale: currentPlayer === 'player1' ? 1.05 : 0.9,
            opacity: currentPlayer === 'player1' ? 1 : 0.5,
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`relative ${currentPlayer === 'player1' ? 'z-20' : 'z-10'}`}
        >
          {currentPlayer === 'player1' && (
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-lg"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          
          <div className="relative flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-full shadow-xl border-2 border-pink-300">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <ImageWithFallback
                src={players.player1.avatar}
                alt={players.player1.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="font-black text-white text-sm drop-shadow-lg">
                {players.player1.name}
              </p>
              <div className="flex items-center gap-1 text-pink-100">
                <Trophy className="w-3 h-3" />
                <span className="font-bold text-xs">{score.player1.toLocaleString('bg-BG', { minimumFractionDigits: 2 })} лв</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* VS Badge with streak/multiplier */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
          }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-xl shadow-xl border-2 border-yellow-300">
            VS
          </div>
          
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 rounded-full px-2 py-0.5 flex items-center gap-0.5 shadow-lg border border-white"
            >
              <Flame className="w-3 h-3 text-yellow-300" />
              <span className="text-white font-black text-xs">{streak}</span>
            </motion.div>
          )}
          
          {multiplier > 1 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full px-2 py-0.5 flex items-center gap-0.5 shadow-lg border border-white"
            >
              <Zap className="w-3 h-3 text-yellow-300" />
              <span className="text-white font-black text-xs">x{multiplier.toFixed(1)}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Player 2 */}
        <motion.div
          animate={{
            scale: currentPlayer === 'player2' ? 1.05 : 0.9,
            opacity: currentPlayer === 'player2' ? 1 : 0.5,
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`relative ${currentPlayer === 'player2' ? 'z-20' : 'z-10'}`}
        >
          {currentPlayer === 'player2' && (
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-lg"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          
          <div className="relative flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-full shadow-xl border-2 border-blue-300">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <ImageWithFallback
                src={players.player2.avatar}
                alt={players.player2.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="font-black text-white text-sm drop-shadow-lg">
                {players.player2.name}
              </p>
              <div className="flex items-center gap-1 text-blue-100">
                <Trophy className="w-3 h-3" />
                <span className="font-bold text-xs">{score.player2.toLocaleString('bg-BG', { minimumFractionDigits: 2 })} лв</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Current turn indicator */}
      {currentPlayer && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mt-2"
        >
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full font-black text-xs shadow-lg">
            🎯 РЕД НА {currentPlayerData.name.toUpperCase()} 🎯
          </div>
        </motion.div>
      )}
    </div>
  );
}