import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Play, UserCircle, Camera } from 'lucide-react';
import { useGame } from './GameContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const { setGamePhase, players, setPlayers } = useGame();
  const [showSetup, setShowSetup] = useState(false);
  const [player1Name, setPlayer1Name] = useState(players.player1.name);
  const [player2Name, setPlayer2Name] = useState(players.player2.name);

  const handleStart = () => {
    if (showSetup) {
      setPlayers({
        player1: { ...players.player1, name: player1Name || 'Съперник 1' },
        player2: { ...players.player2, name: player2Name || 'Съперник 2' }
      });
      setGamePhase('select');
      onStart();
    } else {
      setShowSetup(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Stage Lights Background */}
      <div className="absolute inset-0">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1672419621321-37b691ac4b89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBzdGFnZSUyMGxpZ2h0cyUyMHNwb3RsaWdodHxlbnwxfHx8fDE3NzI2MTA1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Stage"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Spotlight effects */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-[150px] opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-[150px] opacity-30"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />

      {/* Animated background particles */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="text-center z-10 px-4 max-w-6xl"
      >
        {!showSetup ? (
          <>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-8"
            >
              <Sparkles className="w-24 h-24 text-yellow-400 mx-auto drop-shadow-2xl" />
            </motion.div>

            <motion.h1
              className="text-8xl font-black mb-6 relative"
              style={{
                background: 'linear-gradient(45deg, #FFD700, #FF69B4, #9D4EDD, #00D9FF)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))',
              }}
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              СДЕЛКА ИЛИ НЕ
            </motion.h1>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <p className="text-3xl text-yellow-400 font-black mb-2 drop-shadow-lg">
                🎰 УНИКАЛНАТА ИГРА 🎰
              </p>
              <p className="text-xl text-pink-300 font-bold">
                26 кутии • 1 милион лева • Безкрайно напрежение
              </p>
            </motion.div>

            <motion.button
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white text-3xl font-black px-16 py-8 rounded-full shadow-2xl flex items-center gap-4">
                <Play className="w-10 h-10" />
                ЗАПОЧНИ ИГРАТА
                <Play className="w-10 h-10" />
              </div>
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex justify-center gap-4"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="text-4xl"
                >
                  {['💰', '🎁', '💎', '🏆', '⭐'][i]}
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl"
          >
            <h2 className="text-4xl font-black text-yellow-400 mb-8 flex items-center justify-center gap-3">
              <Camera className="w-10 h-10" />
              ЗАПОЗНАЙТЕ СЕ СЪС СЪСТЕЗАТЕЛИТЕ
            </h2>

            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Player 1 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border-2 border-pink-400"
              >
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-pink-400 shadow-xl">
                  <ImageWithFallback
                    src={players.player1.avatar}
                    alt="Player 1"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/50 to-transparent" />
                </div>
                <div className="flex items-center gap-2 bg-pink-500/30 rounded-full px-4 py-2 mb-2">
                  <UserCircle className="w-5 h-5 text-pink-300" />
                  <input
                    type="text"
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    placeholder="Име на играч 1"
                    className="bg-transparent text-white font-bold text-xl text-center outline-none placeholder-pink-300 flex-1"
                    maxLength={20}
                  />
                </div>
                <div className="text-pink-300 text-sm font-bold">ИГРАЧ 1</div>
              </motion.div>

              {/* Player 2 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-md rounded-2xl p-6 border-2 border-blue-400"
              >
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-400 shadow-xl">
                  <ImageWithFallback
                    src={players.player2.avatar}
                    alt="Player 2"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
                </div>
                <div className="flex items-center gap-2 bg-blue-500/30 rounded-full px-4 py-2 mb-2">
                  <UserCircle className="w-5 h-5 text-blue-300" />
                  <input
                    type="text"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    placeholder="Име на играч 2"
                    className="bg-transparent text-white font-bold text-xl text-center outline-none placeholder-blue-300 flex-1"
                    maxLength={20}
                  />
                </div>
                <div className="text-blue-300 text-sm font-bold">ИГРАЧ 2</div>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="relative group mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-white text-2xl font-black px-12 py-6 rounded-full shadow-2xl flex items-center gap-3">
                <Play className="w-8 h-8" />
                ЗАПОЧНЕТЕ БИТКАТА!
              </div>
            </motion.button>

            <p className="text-purple-300 text-sm mt-6">
              💡 Съвет: Оставете празно за имена по подразбиране
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
