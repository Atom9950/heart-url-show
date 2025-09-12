import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Play } from 'lucide-react';

interface RomanticIntroProps {
  images: string[];
  name: string;
  music?: string;
  onComplete: () => void;
}

export const RomanticIntro: React.FC<RomanticIntroProps> = ({
  images,
  name,
  music,
  onComplete,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const romanticTexts = [
    `Hey ${name}... 💕`,
    "Every moment with you is magical ✨",
    "You make my heart skip a beat 💖",
    "Tonight is all about you, my love 🌹",
    "Ready for something special? 💫",
  ];

  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    const completeTimer = setTimeout(() => {
      setShowOverlay(true);
    }, 20000);

    return () => {
      clearInterval(imageTimer);
      clearTimeout(completeTimer);
    };
  }, [images.length]);

  const playAudio = () => {
    if (music && !audioPlaying) {
      const audio = new Audio(music);
      audio.volume = 0.3;
      audio.loop = true;
      audio.play().catch(console.error);
      setAudioPlaying(true);
    }
  };

  const FloatingHeart = ({ delay = 0 }) => (
    <motion.div
      className="absolute text-rose text-2xl pointer-events-none"
      initial={{ 
        x: Math.random() * window.innerWidth, 
        y: window.innerHeight + 50,
        scale: 0,
        rotate: 0
      }}
      animate={{ 
        y: -50, 
        scale: [0, 1, 1, 0],
        rotate: 360,
        x: Math.random() * window.innerWidth
      }}
      transition={{ 
        duration: 8, 
        delay,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: Math.random() * 5
      }}
    >
      💖
    </motion.div>
  );

  const Sparkle = ({ delay = 0 }) => (
    <motion.div
      className="absolute text-gold text-xl pointer-events-none"
      initial={{ 
        x: Math.random() * window.innerWidth, 
        y: Math.random() * window.innerHeight,
        scale: 0,
        opacity: 0
      }}
      animate={{ 
        scale: [0, 1.5, 0],
        opacity: [0, 1, 0],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 3, 
        delay,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: Math.random() * 3
      }}
    >
      ✨
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-romantic-darker overflow-hidden">
      {/* Background Music Play Button */}
      {music && !audioPlaying && (
        <motion.button
          onClick={playAudio}
          className="absolute top-6 right-6 z-50 bg-rose/20 backdrop-blur-sm rounded-full p-3 border border-rose/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Play className="w-6 h-6 text-rose" />
        </motion.button>
      )}

      {/* Floating Hearts */}
      {[...Array(8)].map((_, i) => (
        <FloatingHeart key={i} delay={i * 1.5} />
      ))}

      {/* Sparkles */}
      {[...Array(12)].map((_, i) => (
        <Sparkle key={i} delay={i * 0.8} />
      ))}

      {/* Image Slideshow */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="relative"
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={`Memory ${currentImageIndex + 1}`}
                className="max-w-xs md:max-w-md lg:max-w-lg max-h-96 object-cover rounded-2xl shadow-2xl border-4 border-rose/30"
              />
              
              {/* Image Border Glow */}
              <div className="absolute inset-0 rounded-2xl border-2 border-gold/50 animate-glow pointer-events-none" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Romantic Text Overlay */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 1 }}
          className="bg-romantic-dark/80 backdrop-blur-sm px-8 py-4 rounded-full border border-rose/30"
        >
          <p className="text-foreground text-lg md:text-xl font-medium">
            {romanticTexts[currentImageIndex % romanticTexts.length]}
          </p>
        </motion.div>
      </div>

      {/* Completion Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-romantic-darker/90 backdrop-blur-sm flex flex-col items-center justify-center z-40"
            onClick={onComplete}
          >
            <motion.div
              className="text-center px-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Heart className="w-16 h-16 text-rose mx-auto mb-6 animate-heart-bounce" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Don't get lost in this romantic vibe... 💫
              </h2>
              <motion.p 
                className="text-gold text-lg mb-8"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Tap anywhere to open your surprise
              </motion.p>
              
              <motion.div
                className="flex items-center justify-center space-x-2 text-rose/70"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5" />
                <span>Something magical awaits</span>
                <Sparkles className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};