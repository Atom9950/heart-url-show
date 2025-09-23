import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BirthdaySequenceProps {
  name: string;
  age: string;
  message: string;
  onComplete: () => void;
}

type SequenceStep = 'dark' | 'bulb' | 'room' | 'decorations' | 'cake' | 'candles' | 'gift' | 'final';

const fadeInTransition = { duration: 0.8, ease: "easeOut" as const };
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
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (step === 'dark') {
      const timer = setTimeout(() => setStep('bulb'), 4000);
      return () => clearTimeout(timer);
    }
    
    if (step === 'final') {
      const buttonTimer = setTimeout(() => setShowButton(true), 30000);
      return () => clearTimeout(buttonTimer);
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
      setTimeout(() => setStep('gift'), 2500);
    }
  };

  const handleGiftClick = () => {
    if (step === 'gift') setStep('final');
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
          initial={{ x: window.innerWidth / 2, y: window.innerHeight / 2, rotate: 0, scale: 0 }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            rotate: 360 * 3,
            scale: [0, 1, 1, 0]
          }}
          transition={{ duration: 4, delay: Math.random() * 1, ease: "easeOut" }}
        />
      ))}
    </>
  );

  const PartyDecorations = () => (
    <motion.div className="absolute inset-0 pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 15}%`,
          }}
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...bounceTransition, delay: i * 0.2 }}
        >
          {['🎈', '🎉', '✨', '⭐', '🎊', '💫'][i]}
        </motion.div>
      ))}
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
              style={{ left: `${-30 + (i * 12)}px`, top: '-40px' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
            >
              🔥
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Movie Credit Animation Component
  const MovieCreditRoll = () => (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animated credit roll */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-start"
        initial={{ y: "100vh" }}
        animate={{ y: "-200%" }}
        transition={{
          duration: 25,
          ease: "linear",
          delay: 1
        }}
        onAnimationComplete={() => setShowButton(true)}
      >
        {/* Opening Title */}
        <motion.div
          className="text-center mb-32 mt-20"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🎬
          </motion.div>
          <h1 className="text-6xl font-bold text-white mb-4">HAPPY BIRTHDAY</h1>
          <motion.h2 
            className="text-5xl bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
          >
            {name}
          </motion.h2>
        </motion.div>

        {/* Age Celebration */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 3 }}
        >
          <div className="text-7xl mb-4">🎉</div>
          <h3 className="text-4xl text-white/80">Celebrating</h3>
          <motion.p 
            className="text-6xl font-bold text-yellow-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {age} Years!
          </motion.p>
        </motion.div>

        {/* Special Message */}
        <motion.div
          className="text-center max-w-3xl mb-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 5 }}
        >
          <motion.h3 
            className="text-3xl text-white/70 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            A Special Message
          </motion.h3>
          
          <div className="text-xl text-white/90 leading-relaxed space-y-6">
            {message.split('\n').map((line, index) => (
              <motion.p
                key={index}
                className="text-2xl font-light"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 6 + (index * 0.5) }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Closing Credits */}
        <motion.div
          className="text-center mb-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 10 }}
        >
          <motion.div
            className="text-7xl mb-6"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💖
          </motion.div>
          <h3 className="text-4xl text-white mb-4">With Love and Best Wishes</h3>
          <p className="text-2xl text-white/70">May your year be filled with joy!</p>
        </motion.div>

        {/* The End */}
        <motion.div
          className="text-center mb-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 15 }}
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{ rotate: [0, 360, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            🌟
          </motion.div>
          <h2 className="text-5xl font-bold text-white">THE END</h2>
          <p className="text-2xl text-white/60 mt-4">Thank you for celebrating!</p>
        </motion.div>
      </motion.div>

      {/* Gradient fades for cinematic effect */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10" />
    </div>
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
              transition={{ duration: 0.8, delay: 1.5 }}
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
            >
              <motion.div
                className="w-32 h-32 mx-auto text-8xl"
                animate={{ filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💡
              </motion.div>
            </motion.div>
            <motion.p 
              className="text-yellow-400 text-lg text-center px-4 font-bold"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Tap the bulb to light up the room! 💡
            </motion.p>
          </motion.div>
        )}

        {/* Room Reveal */}
        {step === 'room' && (
          <motion.div
            key="room"
            className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-purple-800/40 flex items-center justify-center"
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
            className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-purple-800/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={fadeInTransition}
          >
            <PartyDecorations />
            <motion.div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.0 }}
            >
              <motion.button
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg"
                onClick={handleCakeButtonClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎂 Bring the Cake!
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Cake & Candles Steps - FIXED OVERLAPPING */}
        {(step === 'cake' || step === 'candles') && (
          <motion.div
            key="cake"
            className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-purple-800/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={fadeInTransition}
          >
            <PartyDecorations />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Cake container with proper spacing */}
              <div className="relative mb-8"> {/* Added margin bottom to create space for text */}
                <motion.div
                  className="relative cursor-pointer"
                  onClick={handleCandleBlow}
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={bounceTransition}
                >
                  <div className="w-64 h-64 mx-auto text-[16rem] leading-none">🎂</div>
                  <CandleFlames />
                </motion.div>
              </div>
              
              {/* Text positioned below the cake with proper z-index */}
              {candlesLit && (
                <motion.p 
                  className="text-white text-xl font-bold text-center px-4 mt-4 z-10 relative" 
                  // Added z-10, relative, larger text, bold, and margin top
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  Blow the candles and make a wish! 🕯️✨
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        {/* Gift Step - FIXED OVERLAPPING */}
        {step === 'gift' && (
          <motion.div
            key="gift"
            className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-purple-800/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={fadeInTransition}
          >
            <PartyDecorations />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Gift container with proper spacing */}
              <div className="relative mb-8"> {/* Added margin bottom to create space for text */}
                <motion.div
                  className="cursor-pointer"
                  onClick={handleGiftClick}
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={bounceTransition}
                >
                  <motion.div
                    className="w-48 h-48 mx-auto text-[12rem] leading-none"
                    animate={{ filter: ["drop-shadow(0 0 10px #FFD700)", "drop-shadow(0 0 20px #FF69B4)", "drop-shadow(0 0 10px #FFD700)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎁
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Text positioned below the gift with proper z-index */}
              <motion.p 
                className="text-white text-xl font-bold text-center px-4 mt-4 z-10 relative" 
                // Added z-10, relative, larger text, bold, and margin top
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                Tap to open your special gift! 🎁
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Final Step - Movie Credit Roll */}
        {step === 'final' && (
          <motion.div
            key="final"
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <MovieCreditRoll />
            
            {/* Roll Credits Again Button - Appears after animation */}
            <AnimatePresence>
              {showButton && (
                <motion.div
                  className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <motion.button
                    onClick={onComplete}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-full font-bold text-xl shadow-2xl border-2 border-white/20"
                    whileHover={{ scale: 1.1, boxShadow: "0 20px 40px rgba(255, 105, 180, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎬 Roll Credits Again
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
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