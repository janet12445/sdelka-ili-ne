import { motion } from 'motion/react';
import { Gift, Lock, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface BoxData {
  id: number;
  amount: number;
  opened: boolean;
  isPlayerBox: boolean;
}

interface BoxProps {
  box: BoxData;
  onClick: () => void;
  isClickable: boolean;
  isSelected: boolean;
}

export function Box({ box, onClick, isClickable, isSelected }: BoxProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(0)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toFixed(2);
  };

  const getAmountColor = (amount: number) => {
    if (amount >= 500000) return 'from-yellow-400 via-orange-500 to-red-500';
    if (amount >= 100000) return 'from-purple-500 via-pink-500 to-red-500';
    if (amount >= 10000) return 'from-blue-500 via-purple-500 to-pink-500';
    if (amount >= 1000) return 'from-cyan-500 via-blue-500 to-indigo-500';
    return 'from-gray-500 to-gray-700';
  };

  if (box.opened) {
    return (
      <motion.div
        initial={{ rotateY: 0, scale: 1 }}
        animate={{ 
          rotateY: 180, 
          scale: 0.7,
          opacity: 0.4 
        }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="relative w-full aspect-square"
      >
        {/* Explosion particles */}
        {isSelected && [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos((i / 12) * Math.PI * 2) * 100,
              y: Math.sin((i / 12) * Math.PI * 2) * 100,
              opacity: 0,
            }}
            transition={{ duration: 0.6 }}
          />
        ))}
        
        <div className={`absolute inset-0 bg-gradient-to-br ${getAmountColor(box.amount)} rounded-xl flex flex-col items-center justify-center border-4 border-gray-500 shadow-xl`}>
          <div className="text-white font-black text-base md:text-xl" style={{ transform: 'rotateY(180deg)' }}>
            {formatAmount(box.amount)}
          </div>
          <div className="text-white text-xs opacity-70" style={{ transform: 'rotateY(180deg)' }}>
            лв
          </div>
        </div>
      </motion.div>
    );
  }

  if (box.isPlayerBox) {
    return (
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotateZ: [0, -2, 2, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative w-full aspect-square"
      >
        {/* Glowing aura */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl blur-lg"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Sparkle particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white rounded-full"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [0, Math.cos((i / 8) * Math.PI * 2) * 40],
              y: [0, Math.sin((i / 8) * Math.PI * 2) * 40],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-xl flex flex-col items-center justify-center border-4 border-yellow-300 shadow-2xl">
          <Lock className="w-6 h-6 md:w-10 md:h-10 text-white mb-1 drop-shadow-lg" />
          <div className="text-white font-black text-2xl md:text-4xl drop-shadow-lg">{box.id}</div>
          <motion.div 
            className="text-yellow-900 text-[10px] md:text-xs font-black mt-1 bg-yellow-300 px-2 py-0.5 rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ТВОЯТА
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={isClickable ? { 
        scale: 1.15, 
        rotate: isHovered ? [0, -5, 5, 0] : 0,
        zIndex: 50
      } : {}}
      whileTap={isClickable ? { scale: 0.9 } : {}}
      animate={isSelected ? {
        rotateY: [0, 90, 180],
        scale: [1, 1.3, 1]
      } : {}}
      transition={{ 
        duration: isSelected ? 1.5 : 0.3,
        ease: "easeOut" 
      }}
      className={`relative w-full aspect-square ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
    >
      {/* Hover glow effect */}
      {isClickable && isHovered && (
        <motion.div
          className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
        />
      )}

      {/* Clickable pulse */}
      {isClickable && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-xl"
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.9, 1.05, 0.9],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className={`absolute inset-0 bg-gradient-to-br rounded-xl flex flex-col items-center justify-center border-4 shadow-xl transition-all overflow-hidden ${
        isClickable 
          ? 'from-pink-500 via-purple-500 to-indigo-600 border-pink-300 hover:border-yellow-300' 
          : 'from-gray-600 to-gray-800 border-gray-700'
      }`}>
        {/* Shine effect */}
        {isClickable && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        )}

        {/* 3D Box Effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
        </div>

        <motion.div
          animate={isClickable ? {
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative z-10"
        >
          <Gift className="w-8 h-8 md:w-14 md:h-14 text-white mb-1 md:mb-2 drop-shadow-lg" />
        </motion.div>
        
        <div className="text-white font-black text-2xl md:text-5xl drop-shadow-lg relative z-10">{box.id}</div>
        
        {isClickable && (
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5],
              y: [0, -3, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-1 text-pink-200 text-[10px] md:text-xs font-black mt-1 bg-black/30 px-2 py-1 rounded-full relative z-10"
          >
            <Sparkles className="w-3 h-3" />
            <span>ОТВОРИ</span>
            <Sparkles className="w-3 h-3" />
          </motion.div>
        )}
      </div>

      {/* Corner sparkles for clickable boxes */}
      {isClickable && (
        <>
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0,
            }}
          />
          <motion.div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-400 rounded-full"
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute -top-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full"
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.25,
            }}
          />
          <motion.div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-400 rounded-full"
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.75,
            }}
          />
        </>
      )}
    </motion.button>
  );
}
