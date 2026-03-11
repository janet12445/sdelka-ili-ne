import { motion, AnimatePresence } from 'motion/react';
import { Phone, CheckCircle, XCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGame } from './GameContext';

interface BankerOfferProps {
  offer: number;
  onDeal: (accepted: boolean) => void;
}

export function BankerOffer({ offer, onDeal }: BankerOfferProps) {
  const [countdown, setCountdown] = useState(30);
  const [showWarning, setShowWarning] = useState(false);
  const { boxes, playerBox } = useGame();

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('bg-BG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDeal(false); // Auto-reject if time runs out
          return 0;
        }
        if (prev <= 10) {
          setShowWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDeal]);

  // Calculate if this is a good deal
  const remainingBoxes = boxes.filter(b => !b.opened && b.id !== playerBox);
  const maxRemaining = Math.max(...remainingBoxes.map(b => b.amount));
  const avgRemaining = remainingBoxes.reduce((sum, b) => sum + b.amount, 0) / remainingBoxes.length;
  const isGoodDeal = offer > avgRemaining;
  const isPerfectDeal = offer > avgRemaining * 1.2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 max-w-3xl w-full shadow-2xl border-4 border-yellow-400 relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white rounded-full"
              animate={{
                y: [0, -1000],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
              }}
            />
          ))}
        </div>

        {/* Countdown Timer */}
        <motion.div
          className="absolute top-4 right-4"
          animate={showWarning ? {
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-4 ${
            showWarning ? 'bg-red-500 border-red-300 text-white' : 'bg-white/20 border-white/50 text-white'
          }`}>
            {countdown}
          </div>
        </motion.div>

        <div className="relative z-10">
          {/* Phone ringing animation */}
          <motion.div
            animate={{
              rotate: [-10, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: 5,
            }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-white rounded-full blur-xl"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <div className="relative bg-white rounded-full p-8 shadow-2xl">
                <Phone className="w-16 h-16 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-black text-white text-center mb-2 drop-shadow-lg"
          >
            📞 БАНКЕРЪТ СЕ ОБАЖДА
          </motion.h2>

          {/* Deal Quality Indicator */}
          <AnimatePresence>
            {isPerfectDeal && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <TrendingUp className="w-6 h-6 text-green-300" />
                <span className="text-green-300 font-black text-lg">ПЕРФЕКТНА ОФЕРТА!</span>
                <TrendingUp className="w-6 h-6 text-green-300" />
              </motion.div>
            )}
            {!isPerfectDeal && showWarning && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <AlertTriangle className="w-6 h-6 text-red-300" />
                <span className="text-red-300 font-black text-lg">ВРЕМЕТО ИЗТИЧА!</span>
                <AlertTriangle className="w-6 h-6 text-red-300" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-6 border-2 border-white/50 shadow-inner"
          >
            <p className="text-white text-2xl text-center mb-4 font-bold">
              Предлагам ти:
            </p>
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  '0 0 10px rgba(255,255,255,0.5)',
                  '0 0 30px rgba(255,255,255,0.8)',
                  '0 0 10px rgba(255,255,255,0.5)',
                ],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
              className="text-8xl font-black text-yellow-300 text-center drop-shadow-2xl mb-4"
            >
              {formatAmount(offer)}
            </motion.div>
            <p className="text-yellow-100 text-3xl font-black text-center">ЛЕВА</p>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-white/70 text-sm mb-1">Средна награда</p>
                <p className="text-white font-black text-xl">{formatAmount(avgRemaining)} лв</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-white/70 text-sm mb-1">Макс награда</p>
                <p className="text-yellow-300 font-black text-xl">{formatAmount(maxRemaining)} лв</p>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white text-center text-2xl font-bold mb-8"
          >
            {isGoodDeal ? '🤑 Това е добра оферта!' : '🤔 Мисли добре... Можеш ли да рискуваш?'}
          </motion.p>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.08, rotate: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onDeal(true)}
              className="relative group"
            >
              <motion.div
                className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <div className="relative flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-5 rounded-full text-2xl font-black shadow-2xl border-4 border-green-300">
                <CheckCircle className="w-8 h-8" />
                СДЕЛКА! 💰
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onDeal(false)}
              className="relative group"
            >
              <motion.div
                className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              />
              <div className="relative flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-10 py-5 rounded-full text-2xl font-black shadow-2xl border-4 border-red-300">
                <XCircle className="w-8 h-8" />
                НЕ! 🎯
              </div>
            </motion.button>
          </div>

          {showWarning && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-200 text-center mt-4 font-bold"
            >
              ⚠️ Решението ще бъде взето автоматично след {countdown} секунди!
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
