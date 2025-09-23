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
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    if (step === 'dark') {
      const timer = setTimeout(() => setStep('bulb'), 4000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleBulbClick = () => {
    if (step === 'bulb') {
      setStep('room');
      setTimeout(() => setStep('decorations'), 3000);
    }
  };

  const handleCakeButtonClick = () => {
    setStep('cake');
  };

  const handleCandleBlow = () => {
    if (candlesLit) {
      setCandlesLit(false);
      setShowConfetti(true);
      setTimeout(() => {
        setStep('gift');
      }, 2500);
    }
  };

  const handleGiftClick = () => {
    if (step === 'gift') {
      setStep('final');
      // Show scroll hint after a delay
      setTimeout(() => setShowScrollHint(true), 3000);
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

  // Movie credit style animation components
  const MovieCreditMessage = () => (
    <motion.div
      className="relative w-full max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* Scroll hint */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-white/70 text-sm mb-4 flex items-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ⬇️
            </motion.span>
            <span>Scroll to read your message</span>
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              ⬇️
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message container with movie credit scroll */}
      <motion.div
        className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl mb-12 overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, type: "spring" }}
      >
        {/* Top fade effect */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-purple-900/60 to-transparent z-10" />
        
        {/* Bottom fade effect */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-900/60 to-transparent z-10" />
        
        {/* Movie credit scroll container */}
        <motion.div
          className="relative h-96 overflow-y-auto scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          onScroll={() => setShowScrollHint(false)}
        >
          <motion.div
            className="text-center space-y-8 py-8"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ 
              duration: 3, 
              ease: "easeOut",
              delay: 0.5 
            }}
          >
            {/* Opening credits style */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🎬
              </motion.div>
              <h3 className="text-2xl text-white/80 font-light mb-2">A Special Message For</h3>
              <motion.h2 
                className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                {name}
              </motion.h2>
            </motion.div>

            {/* Message content with typewriter effect */}
            <motion.div
              className="text-lg text-white/90 leading-relaxed whitespace-pre-wrap text-left max-w-2xl mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 2.5 }}
            >
              {message.split('\n').map((line, index) => (
                <motion.p
                  key={index}
                  className="mb-6 font-light text-xl"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 1, 
                    delay: 3 + (index * 0.3),
                    ease: "easeOut"
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>

            {/* Closing credits */}
            <motion.div
              className="pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 4 }}
            >
              <motion.div
                className="text-4xl mb-4"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎉
              </motion.div>
              <motion.h3 
                className="text-3xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 4.5 }}
              >
                Happy {age}th Birthday!
              </motion.h3>
              <motion.p 
                className="text-white/70 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 5 }}
              >
                With love and best wishes 💖
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const MovieCreditButton = () => (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 1.5, 
        delay: 6,
        type: "spring",
        stiffness: 100
      }}
    >
      {/* Button glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-lg opacity-50"
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.button
        onClick={onComplete}
        className="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-6 rounded-full font-bold text-xl shadow-2xl border-2 border-white/20"
        whileHover={{ 
          scale: 1.08,
          boxShadow: "0 20px 40px rgba(255, 105, 180, 0.4)",
          transition: { duration: 0.3 }
        }}
        whileTap={{ 
          scale: 0.95,
          transition: { duration: 0.1 }
        }}
        animate={{
          y: [0, -5, 0],
          boxShadow: [
            "0 10px 30px rgba(255, 105, 180, 0.3)",
            "0 15px 40px rgba(255, 105, 180, 0.5)",
            "0 10px 30px rgba(255, 105, 180, 0.3)"
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mr-3"
        >
          🔄
        </motion.span>
        Roll Credits Again
        <motion.span
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="inline-block ml-3"
        >
          🎬
        </motion.span>
      </motion.button>
    </motion.div>
  );

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

        {/* Room Reveal */}
        {step === 'room' && (
          <motion.div
            key="room"
            className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-purple-800/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <motion.h2
              className="text-2xl md:text-3xl text-white font-bold text-center px-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...scaleInTransition, delay: 0.5 }}
            >
              Welcome to your special day! ✨
            </motion.h2>
          </motion.div>
        )}

        {/* Decorations Step */}
        {step === 'decorations' && (
          <motion.div
            key="decorations"
            className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-purple-800/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={fadeInTransition}
          >
            <PartyDecorations />
            <motion.div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...slideUpTransition, delay: 2.0 }}
            >
              <motion.button
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg"
                onClick={handleCakeButtonClick}
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

        {/* Cake & Candles Steps */}
        {(step === 'cake' || step === 'candles') && (
          <motion.div
            key="cake"
            className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-purple-800/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={fadeInTransition}
          >
            <PartyDecorations />
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
          </motion.div>
        )}

        {/* Gift Step */}
        {step === 'gift' && (
          <motion.div
            key="gift"
            className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-purple-800/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={fadeInTransition}
          >
            <PartyDecorations />
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
          </motion.div>
        )}

        {/* Final Message with Movie Credit Style */}
        {step === 'final' && (
          <motion.div
            key="final"
            className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/60 to-purple-800/70 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <div className="min-h-screen flex flex-col items-center justify-center p-8 py-20">
              <motion.div
                className="text-center w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, type: "spring" }}
              >
                {/* Main title */}
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-white mb-12"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  🎉 THE END 🎉
                </motion.h2>
                
                {/* Movie credit style message */}
                <MovieCreditMessage />
                
                {/* Movie credit style button */}
                <MovieCreditButton />
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