import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Gift, Cake, PartyPopper } from 'lucide-react';
import lightBulbImg from '@/assets/light-bulb.png';
import birthdayCakeImg from '@/assets/birthday-cake.png';
import partyBalloonsImg from '@/assets/party-balloons.png';
import giftBoxImg from '@/assets/gift-box.png';

interface BirthdaySequenceProps {
  name: string;
  age: string;
  message: string;
  onComplete: () => void;
}

type SequenceStep = 'dark' | 'bulb' | 'room' | 'decorations' | 'cake' | 'candles' | 'gift' | 'final';

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
      const timer = setTimeout(() => setStep('bulb'), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleBulbClick = () => {
    if (step === 'bulb') {
      setStep('room');
      setTimeout(() => setStep('decorations'), 1500);
    }
  };

  const handleDecorationsComplete = () => {
    setStep('cake');
  };

  const handleCandleBlow = () => {
    if (candlesLit) {
      setCandlesLit(false);
      setShowConfetti(true);
      setTimeout(() => {
        setStep('gift');
      }, 2000);
    }
  };

  const handleGiftClick = () => {
    if (step === 'gift') {
      setStep('final');
    }
  };

  const Confetti = () => (
    <>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gold rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -10,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 10,
            rotate: 360,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 3,
            delay: Math.random() * 2,
            ease: "easeOut",
          }}
        />
      ))}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-rose text-lg"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -10,
            scale: 0,
          }}
          animate={{
            y: window.innerHeight + 10,
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4,
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
    <div className="absolute inset-0 pointer-events-none">
      <motion.img
        src={partyBalloonsImg}
        alt="Party Balloons"
        className="absolute top-10 left-10 w-32 h-32"
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 1, type: "spring", damping: 8 }}
      />
      <motion.img
        src={partyBalloonsImg}
        alt="Party Balloons"
        className="absolute top-20 right-10 w-28 h-28 transform rotate-12"
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, type: "spring", damping: 8 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 text-6xl"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
      >
        🎊
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/4 text-5xl"
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
      >
        🎈
      </motion.div>
    </div>
  );

  const CandleFlames = () => {
    const candleCount = parseInt(age) || 5;
    return (
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="relative">
          {candlesLit && [...Array(Math.min(candleCount, 10))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-400 text-sm"
              style={{
                left: `${-20 + (i * 8)}px`,
                top: '-30px',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
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
    <div className="fixed inset-0 overflow-hidden">
      {/* Dark Room Step */}
      {step === 'dark' && (
        <motion.div
          className="absolute inset-0 bg-black flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.h2
            className="text-2xl md:text-3xl text-white font-bold mb-8 text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            Hey {name}, why is it so dark? 🤔
          </motion.h2>
        </motion.div>
      )}

      {/* Light Bulb Step */}
      {step === 'bulb' && (
        <motion.div
          className="absolute inset-0 bg-black flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="cursor-pointer mb-8"
            onClick={handleBulbClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <img
              src={lightBulbImg}
              alt="Light Bulb"
              className="w-32 h-32 mx-auto animate-glow"
            />
          </motion.div>
          <motion.p
            className="text-gold text-lg text-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Tap the bulb to light up the room! 💡
          </motion.p>
        </motion.div>
      )}

      {/* Room Reveal & Decorations */}
      {(step === 'room' || step === 'decorations' || step === 'cake' || step === 'candles' || step === 'gift') && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-romantic-dark via-background to-romantic-darker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {step === 'room' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onAnimationComplete={handleDecorationsComplete}
            >
              <motion.h2
                className="text-2xl md:text-3xl text-foreground font-bold text-center px-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
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
            >
              <PartyDecorations />
              <motion.div
                className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
              >
                <motion.button
                  className="party-button px-8 py-4 rounded-full font-semibold text-lg"
                  onClick={() => setStep('cake')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                initial={{ scale: 0, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 10 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={birthdayCakeImg}
                  alt="Birthday Cake"
                  className="w-64 h-64 mx-auto"
                />
                <CandleFlames />
              </motion.div>
              
              {candlesLit && (
                <motion.p
                  className="text-foreground text-lg mt-8 text-center px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
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
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 8 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <img
                  src={giftBoxImg}
                  alt="Gift Box"
                  className="w-48 h-48 mx-auto animate-sparkle"
                />
              </motion.div>
              <motion.p
                className="text-foreground text-lg mt-6 text-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
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
          className="absolute inset-0 bg-gradient-to-br from-romantic-darker via-romantic-dark to-background overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <motion.div
              className="text-center max-w-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="text-6xl mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💖
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Happy Birthday, {name}! 🎉
              </h2>
              
              <motion.div
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-rose/20 shadow-2xl mb-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
                  {message}
                </p>
              </motion.div>
              
              <motion.button
                onClick={onComplete}
                className="romantic-button px-8 py-4 rounded-full font-semibold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                🔄 Experience the Magic Again
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Confetti Effect */}
      {showConfetti && <Confetti />}
    </div>
  );
};