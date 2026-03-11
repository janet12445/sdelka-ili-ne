import { motion } from 'motion/react';
import { useGame } from './GameContext';
import { DollarSign, X } from 'lucide-react';

export function PrizeBoard() {
  const { boxes } = useGame();

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(0)}M лв`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K лв`;
    return `${amount.toFixed(2)} лв`;
  };

  const allAmounts = boxes.map(b => b.amount).sort((a, b) => b - a);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-lg rounded-2xl p-3 shadow-2xl border-2 border-purple-500/50"
    >
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-5 h-5 text-yellow-400" />
        <h2 className="text-lg font-black text-white">НАГРАДИ</h2>
      </div>

      <div className="grid grid-cols-1 gap-1">
        {allAmounts.map((amount) => {
          const box = boxes.find(b => b.amount === amount);
          const isOpened = box?.opened;

          return (
            <motion.div
              key={amount}
              initial={{ opacity: 1 }}
              animate={{
                opacity: isOpened ? 0.3 : 1,
                scale: isOpened ? 0.95 : 1,
              }}
              className={`relative px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                isOpened
                  ? 'bg-gray-700 text-gray-400 line-through'
                  : amount >= 100000
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : amount >= 10000
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
              }`}
            >
              {isOpened && (
                <X className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2" />
              )}
              {formatAmount(amount)}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}