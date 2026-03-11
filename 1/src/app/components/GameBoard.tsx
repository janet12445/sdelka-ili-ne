import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from './GameContext';
import { Box } from './Box';
import { PrizeBoard } from './PrizeBoard';
import { BankerOffer } from './BankerOffer';
import { PlayerInfo } from './PlayerInfo';
import { FinalReveal } from './FinalReveal';
import { Sparkles, Target, Timer } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const BOXES_TO_OPEN_PER_ROUND = [6, 5, 4, 3, 2, 1, 1, 1, 1];

export function GameBoard() {
  const {
    boxes,
    setBoxes,
    currentPlayer,
    playerBox,
    setPlayerBox,
    boxesOpenedThisRound,
    setBoxesOpenedThisRound,
    bankerOffer,
    setBankerOffer,
    gamePhase,
    setGamePhase,
    streak,
    setStreak,
    multiplier,
    setMultiplier,
  } = useGame();

  const [currentRound, setCurrentRound] = useState(0);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [lastOpenedAmount, setLastOpenedAmount] = useState<number | null>(null);
  const [comboMessage, setComboMessage] = useState<string | null>(null);

  // Calculate banker offer
  const calculateBankerOffer = () => {
    const remainingBoxes = boxes.filter(b => !b.opened && b.id !== playerBox);
    const total = remainingBoxes.reduce((sum, box) => sum + box.amount, 0);
    const average = total / remainingBoxes.length;
    
    // Banker gets more aggressive as rounds progress
    const roundMultiplier = 0.6 + (currentRound * 0.05);
    return Math.round(average * roundMultiplier * multiplier);
  };

  const handleBoxClick = (boxId: number) => {
    if (gamePhase === 'select' && !playerBox) {
      // Player selecting their box
      setPlayerBox(boxId);
      setBoxes(boxes.map(b => 
        b.id === boxId ? { ...b, isPlayerBox: true } : b
      ));
      setGamePhase('opening');
    } else if (gamePhase === 'opening' && boxId !== playerBox) {
      // Opening other boxes
      const box = boxes.find(b => b.id === boxId);
      if (box && !box.opened) {
        setSelectedBox(boxId);
        
        setTimeout(() => {
          setBoxes(boxes.map(b => 
            b.id === boxId ? { ...b, opened: true } : b
          ));
          setBoxesOpenedThisRound(boxesOpenedThisRound + 1);
          setSelectedBox(null);
          setLastOpenedAmount(box.amount);

          // Check for streak (opening low-value boxes in a row)
          if (box.amount < 1000) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            
            if (newStreak >= 3) {
              setComboMessage(`🔥 ${newStreak}x COMBO! ИЗБЯГВАШ НИСКИТЕ СУМИ!`);
              setMultiplier(1 + (newStreak * 0.1));
              setTimeout(() => setComboMessage(null), 2000);
            }
          } else if (box.amount >= 100000) {
            setStreak(0);
            setMultiplier(1);
            setComboMessage('💔 ЗАГУБИ ВИСОКАТА СУМА!');
            setTimeout(() => setComboMessage(null), 2000);
          }

          setTimeout(() => {
            setLastOpenedAmount(null);
          }, 2000);

          const newCount = boxesOpenedThisRound + 1;
          const targetBoxes = BOXES_TO_OPEN_PER_ROUND[currentRound];
          
          if (newCount >= targetBoxes) {
            // Round complete, show banker offer
            setTimeout(() => {
              const offer = calculateBankerOffer();
              setBankerOffer(offer);
              setGamePhase('deal');
            }, 1500);
          }
        }, 1500);
      }
    }
  };

  const handleDeal = (accepted: boolean) => {
    if (accepted) {
      setGamePhase('finished');
    } else {
      setBoxesOpenedThisRound(0);
      setBankerOffer(null);
      setCurrentRound(currentRound + 1);
      
      const remainingClosed = boxes.filter(b => !b.opened && b.id !== playerBox).length;
      
      if (remainingClosed <= 1) {
        setGamePhase('final');
      } else {
        setGamePhase('opening');
      }
    }
  };

  const unopenedBoxes = boxes.filter(b => !b.opened && b.id !== playerBox);
  const targetBoxes = BOXES_TO_OPEN_PER_ROUND[currentRound];

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Stage Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1672419621321-37b691ac4b89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBzdGFnZSUyMGxpZ2h0cyUyMHNwb3RsaWdodHxlbnwxfHx8fDE3NzI2MTA1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Stage"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      {/* Animated spotlight beams */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-32 h-full opacity-10"
          style={{
            left: `${i * 20}%`,
            background: 'linear-gradient(180deg, rgba(255,215,0,0.5) 0%, transparent 70%)',
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scaleX: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-40 h-40 rounded-full blur-3xl"
            style={{
              background: ['#FF69B4', '#9D4EDD', '#00D9FF', '#FFD700'][i % 4],
              opacity: 0.1,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-4"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-black mb-3 relative inline-block"
            style={{
              background: 'linear-gradient(45deg, #FFD700, #FF69B4, #9D4EDD, #00D9FF)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
            }}
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            СДЕЛКА ИЛИ НЕ
          </motion.h1>
          <PlayerInfo />
        </motion.div>

        {/* Round & Progress Info */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex justify-center gap-4 mb-3"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-full shadow-lg border-2 border-purple-300">
            <div className="flex items-center gap-2 text-white">
              <Target className="w-4 h-4" />
              <span className="font-black text-sm">РУНД {currentRound + 1}</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 rounded-full shadow-lg border-2 border-orange-300">
            <div className="flex items-center gap-2 text-white">
              <Timer className="w-4 h-4" />
              <span className="font-black text-sm">ОСТАНАЛИ: {unopenedBoxes.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Game Status */}
        <AnimatePresence mode="wait">
          {gamePhase === 'select' && (
            <motion.div
              key="select"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="text-center mb-3"
            >
              <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full inline-block text-lg font-black shadow-2xl border-4 border-pink-300">
                <Sparkles className="inline w-5 h-5 mr-2" />
                ИЗБЕРИ СВОЯТА КЪСМЕТЛИЙСКА КУТИЯ!
                <Sparkles className="inline w-5 h-5 ml-2" />
              </div>
            </motion.div>
          )}

          {gamePhase === 'opening' && (
            <motion.div
              key="opening"
              initial={{ scale: 0, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              className="text-center mb-3"
            >
              <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white px-6 py-3 rounded-full inline-block text-lg font-black shadow-2xl border-4 border-cyan-300">
                ОТВОРИ ОЩЕ {targetBoxes - boxesOpenedThisRound} КУТИИ
              </div>
              
              {/* Progress bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className="max-w-md mx-auto mt-2"
              >
                <div className="bg-gray-700 rounded-full h-3 overflow-hidden border-2 border-gray-500">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(boxesOpenedThisRound / targetBoxes) * 100}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Combo Message */}
        <AnimatePresence>
          {comboMessage && (
            <motion.div
              initial={{ scale: 0, y: -100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -100 }}
              className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-8 py-4 rounded-3xl text-2xl font-black shadow-2xl border-4 border-yellow-300">
                {comboMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Last Opened Amount Display */}
        <AnimatePresence>
          {lastOpenedAmount !== null && (
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", duration: 1 }}
              className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50"
            >
              <div className={`px-12 py-8 rounded-3xl text-5xl font-black shadow-2xl border-8 ${
                lastOpenedAmount >= 100000
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 border-red-300 text-white'
                  : lastOpenedAmount >= 10000
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 border-orange-300 text-white'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-300 text-white'
              }`}>
                {lastOpenedAmount >= 100000 && '😱'}
                {lastOpenedAmount >= 10000 && lastOpenedAmount < 100000 && '😰'}
                {lastOpenedAmount < 10000 && '🎉'}
                <br />
                {lastOpenedAmount.toLocaleString('bg-BG')} лв
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Prize Board */}
          <div className="lg:col-span-1 max-h-[70vh] overflow-y-auto">
            <PrizeBoard />
          </div>

          {/* Game Area - Boxes Grid */}
          <div className="lg:col-span-4">
            <motion.div 
              className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-2 md:gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {boxes.map((box, index) => (
                <motion.div
                  key={box.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.01 }}
                >
                  <Box
                    box={box}
                    onClick={() => handleBoxClick(box.id)}
                    isClickable={
                      (gamePhase === 'select' && !playerBox) ||
                      (gamePhase === 'opening' && !box.opened && box.id !== playerBox)
                    }
                    isSelected={selectedBox === box.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Banker Offer Modal */}
        <AnimatePresence>
          {gamePhase === 'deal' && bankerOffer !== null && (
            <BankerOffer
              offer={bankerOffer}
              onDeal={handleDeal}
            />
          )}
        </AnimatePresence>

        {/* Final Reveal */}
        <AnimatePresence>
          {(gamePhase === 'final' || gamePhase === 'finished') && (
            <FinalReveal />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}