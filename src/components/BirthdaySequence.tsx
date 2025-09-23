import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Gift, Cake, PartyPopper } from 'lucide-react';

interface BirthdaySequenceProps {
  name: string;
  age: string;
  message: string;
  onComplete: () => void;
}

type SequenceStep = 'dark' | 'bulb' | 'room' | 'decorations' | 'cake' | 'candles' | 'gift' | 'final';

// Animation configurations (not variants)
const fadeInTransition = { duration: 0.8, ease: "easeOut" as const };
const slideUpTransition = { duration: 0.6, ease: "easeOut" as const };
const scaleInTransition = { duration: 0.6, type: "spring" as const, damping: 12, stiffness: 100 };
const bounceTransition = { duration: 0.8, type: "spring" as const, damping: 10, stiffness: 80 };

export const BirthdaySequence: React.FC<BirthdaySequenceProps> = ({
  name,
  age,
  message,
  onComplete,
}) => {
  const [step, setStep] = useState<SequenceStep>('dark');
  const [candlesLit, setCandlesLit] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (step === 'dark') {
      const timer = setTimeout(() => setStep('bulb'), 4000); // Increased from 2000 to 4000
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleBulbClick = () => {
    if (step === 'bulb') {
      setStep('room');
      setTimeout(() => setStep('decorations'), 2000); // Slightly increased timing
    }
  };

  const handleDecorationsComplete = () => {
    setTimeout(() => setStep('cake'), 500); // Small delay for smoother transition
  };

  const handleCandleBlow = () => {
    if (candlesLit) {
      setCandlesLit(false);
      setShowConfetti(true);
      setTimeout(() => {
        setStep('gift');
      }, 2500); // Slightly increased for better confetti viewing
    }
  };

  const handleGiftClick = () => {
    if (step === 'gift') {
      setStep('final');
    }
  };

  const Confetti = () => (
    <>
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#98FB98'][i % 5]
          }}
          initial={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            rotate: 0,
            scale: 0
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            rotate: 360 * 3,
            scale: [0, 1, 1, 0]
          }}
          transition={{
            duration: 4,
            delay: Math.random() * 1,
            ease: "easeOut",
          }}
        />
      ))}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-2xl"
          initial={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            scale: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            scale: [0, 1.2, 1, 0],
          }}
          transition={{
            duration: 4.5,
            delay: Math.random() * 1.5,
            ease: "easeOut",
          }}
        >
          💖
        </motion.div>
      ))}
    </>
  );

  const PartyDecorations = () => (
    <motion.div 
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={fadeInTransition}
    >
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 text-8xl"
        initial={{ opacity: 0, scale: 0, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...bounceTransition, delay: 0.2 }}
      >
        🎈
      </motion.div>
      <motion.div
        className="absolute top-20 right-10 w-28 h-28 text-7xl transform rotate-12"
        initial={{ opacity: 0, scale: 0, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...bounceTransition, delay: 0.4 }}
      >
        🎈
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/4 text-6xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...scaleInTransition, delay: 0.6 }}
      >
        🎊
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/4 text-5xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...scaleInTransition, delay: 0.8 }}
      >
        🎉
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 left-1/3 text-4xl"
        initial={{ opacity: 0, scale: 0, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...bounceTransition, delay: 1.0 }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 right-1/3 text-4xl"
        initial={{ opacity: 0, scale: 0, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...bounceTransition, delay: 1.2 }}
      >
        ✨
      </motion.div>
    </motion.div>
  );

  const CandleFlames = () => {
    const candleCount = parseInt(age) || 5;
    return (
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="relative">
          {candlesLit && [...Array(Math.min(candleCount, 10))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-400 text-lg"
              style={{
                left: `${-30 + (i * 12)}px`,
                top: '-40px',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
                y: [-2, -8, -2]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            >
              🔥
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {/* Dark Room Step */}
        {step === 'dark' && (
          <motion.div
            key="dark"
            className="absolute inset-0 bg-black flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeInTransition}
          >
            <motion.h2
              className="text-2xl md:text-3xl text-white font-bold text-center px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...slideUpTransition, delay: 1.5 }}
            >
              Hey {name}, why is it so dark? 🤔
            </motion.h2>
          </motion.div>
        )}

        {/* Light Bulb Step */}
        {step === 'bulb' && (
          <motion.div
            key="bulb"
            className="absolute inset-0 bg-black flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeInTransition}
          >
            <motion.div
              className="cursor-pointer mb-8"
              onClick={handleBulbClick}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={scaleInTransition}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.9,
                transition: { duration: 0.1 }
              }}
            >
              <motion.div
                className="w-32 h-32 mx-auto text-8xl"
                animate={{
                  filter: [
                    "brightness(1) drop-shadow(0 0 10px #FFD700)",
                    "brightness(1.2) drop-shadow(0 0 20px #FFD700)",
                    "brightness(1) drop-shadow(0 0 10px #FFD700)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                💡
              </motion.div>
            </motion.div>
            <motion.p
              className="text-yellow-400 text-lg text-center px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...slideUpTransition, delay: 0.8 }}
            >
              Tap the bulb to light up the room! 💡
            </motion.p>
          </motion.div>
        )}

        {/* Room Reveal & Decorations */}
        {(step === 'room' || step === 'decorations' || step === 'cake' || step === 'candles' || step === 'gift') && (
          <motion.div
            key="room"
            className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-purple-800/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {step === 'room' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={fadeInTransition}
                onAnimationComplete={handleDecorationsComplete}
              >
                <motion.h2
                  className="text-2xl md:text-3xl text-white font-bold text-center px-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...scaleInTransition, delay: 1 }}
                >
                  Welcome to your special day! ✨
                </motion.h2>
              </motion.div>
            )}

            {step === 'decorations' && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={fadeInTransition}
              >
                <PartyDecorations />
                <motion.div
                  className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...slideUpTransition, delay: 2.5 }}
                >
                  <motion.button
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg"
                    onClick={() => setStep('cake')}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.95,
                      transition: { duration: 0.1 }
                    }}
                  >
                    🎂 Bring the Cake!
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {(step === 'cake' || step === 'candles') && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className="relative cursor-pointer"
                  onClick={handleCandleBlow}
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={bounceTransition}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                >
                  <div className="w-64 h-64 mx-auto text-[16rem] leading-none">
                    🎂
                  </div>
                  <CandleFlames />
                </motion.div>
                
                {candlesLit && (
                  <motion.p
                    className="text-white text-lg mt-8 text-center px-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...slideUpTransition, delay: 1 }}
                  >
                    Blow the candles and make a wish! 🕯️✨
                  </motion.p>
                )}
              </div>
            )}

            {step === 'gift' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className="cursor-pointer"
                  onClick={handleGiftClick}
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={bounceTransition}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ 
                    scale: 0.9,
                    transition: { duration: 0.1 }
                  }}
                >
                  <motion.div
                    className="w-48 h-48 mx-auto text-[12rem] leading-none"
                    animate={{
                      filter: [
                        "drop-shadow(0 0 10px #FFD700)",
                        "drop-shadow(0 0 20px #FF69B4)",
                        "drop-shadow(0 0 10px #FFD700)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🎁
                  </motion.div>
                </motion.div>
                <motion.p
                  className="text-white text-lg mt-6 text-center px-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...slideUpTransition, delay: 1 }}
                >
                  Tap to open your special gift! 🎁
                </motion.p>
              </div>
            )}

            {/* Decorations persist through all room steps */}
            {(step === 'cake' || step === 'candles' || step === 'gift') && <PartyDecorations />}
          </motion.div>
        )}

        {/* Final Message */}
        {step === 'final' && (
          <motion.div
            key="final"
            className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/40 to-purple-800/50 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={fadeInTransition}
          >
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
              <motion.div
                className="text-center max-w-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...scaleInTransition, delay: 0.5 }}
              >
                <motion.div
                  className="text-6xl mb-6"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  💖
                </motion.div>
                
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...slideUpTransition, delay: 0.8 }}
                >
                  Happy Birthday, {name}! 🎉
                </motion.h2>
                
                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...slideUpTransition, delay: 1.2 }}
                >
                  <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">
                    {message}
                  </p>
                </motion.div>
                
                <motion.button
                  onClick={onComplete}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...slideUpTransition, delay: 1.6 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                >
                  🔄 Experience the Magic Again
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>
    </div>
  );
};