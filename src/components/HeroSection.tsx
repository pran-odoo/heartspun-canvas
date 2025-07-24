import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedGalaxyBackground } from './EnhancedGalaxyBackground';
import { SophisticatedText, ElegantTitle, LuxuryParagraph, SophisticatedQuote } from './SophisticatedTypography';
import { AkshitaMagicalButton, AkshitaFloatingButton } from './AkshitaMagicalButtons';
import { TargetCursor } from './TargetCursor';
import { SpotifyIntegration } from './SpotifyIntegration';

interface HeroSectionProps {
  theme: 'morning' | 'evening' | 'night';
  onNavigate: (section: string) => void;
}

// Sophisticated message collections for mature audience
const sophisticatedMessages = [
  "Under the Stars with AKSHITA",
  "Eternal Moments with AKSHITA", 
  "Love's Symphony with AKSHITA",
  "Timeless Beauty, AKSHITA",
  "Forever Yours, AKSHITA"
];

const elegantNotifications = [
  "You are my greatest inspiration, AKSHITA",
  "In your eyes, I find my home, AKSHITA", 
  "Every heartbeat speaks your name, AKSHITA",
  "You make every moment extraordinary, AKSHITA",
  "My heart belongs to you, AKSHITA"
];

const romanticMessages = [
  "Under the Stars with AKSHITA 🌟",
  "Dancing Through Dreams with AKSHITA 💫",
  "Writing Love Stories with AKSHITA ✨",
  "Creating Magic Moments with AKSHITA 🎭",
  "Painting Sunsets with AKSHITA 🎨"
];

const notificationMessages = [
  "You are my favorite notification, AKSHITA 💕",
  "Every heartbeat whispers your name, AKSHITA 💓",
  "You make ordinary moments extraordinary, AKSHITA ✨",
  "In a world full of choices, I choose you, AKSHITA 🌸",
  "You're the best part of every day, AKSHITA 🌅"
];

const floatingElements = [
  { emoji: '💕', delay: 0 },
  { emoji: '✨', delay: 1 },
  { emoji: '🌟', delay: 2 },
  { emoji: '💫', delay: 3 },
  { emoji: '🌸', delay: 4 },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ theme, onNavigate }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSpecialEffect, setShowSpecialEffect] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);

  // Track mouse for interactive effects
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Update time for dynamic greetings and message rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Rotate messages every 6 seconds
    const messageTimer = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % sophisticatedMessages.length);
    }, 6000);

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  // Trigger special effects on interactions
  const handleInteraction = useCallback(() => {
    setInteractionCount(prev => prev + 1);
    setShowSpecialEffect(true);
    
    setTimeout(() => {
      setShowSpecialEffect(false);
    }, 3000);
  }, []);

  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Good Night";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Sophisticated Galaxy Background System */}
      <EnhancedGalaxyBackground
        theme={theme}
        isDarkMode={isDarkMode}
        mousePosition={mousePosition}
        isActive={true}
      />

      {/* Main Content Container */}
      <motion.div
        className="relative z-30 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Sophisticated Time-based Greeting */}
        <motion.div
          variants={itemVariants}
          className="mb-6"
        >
          <SophisticatedText
            variant="sophisticated-subtitle"
            delay={0.2}
          >
            {getTimeBasedGreeting()}, Beautiful
          </SophisticatedText>
        </motion.div>

        {/* Elegant Main Title */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <ElegantTitle
            text={sophisticatedMessages[currentMessageIndex]}
            glowEffect={true}
            letterSpacing="wide"
            className="text-center"
          />
        </motion.div>

        {/* AKSHITA's Sophisticated Name Display */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
          onClick={handleInteraction}
        >
          <SophisticatedText
            variant="akshita-elegant"
            delay={2}
            className="cursor-pointer hover:scale-105 transition-transform duration-500 text-center"
          >
            AKSHITA
          </SophisticatedText>
        </motion.div>

        {/* Elegant Romantic Quote */}
        <motion.div
          variants={itemVariants}
          className="mb-16"
        >
          <SophisticatedQuote
            text={elegantNotifications[currentMessageIndex]}
            className="max-w-4xl mx-auto"
          />
        </motion.div>

        {/* Interactive Button Group */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <TargetCursor
            cursorText="Explore Memories"
            variant="magnetic"
          >
            <AkshitaMagicalButton
              variant="memories"
              size="lg"
              onClick={() => {
                handleInteraction();
                onNavigate('memories');
              }}
              className="w-full sm:w-auto"
            >
              <span className="text-2xl">📸</span>
              <span>Our Beautiful Memories</span>
            </AkshitaMagicalButton>
          </TargetCursor>

          <TargetCursor
            cursorText="Play Music"
            variant="romantic"
          >
            <AkshitaMagicalButton
              variant="songs"
              size="lg"
              onClick={() => {
                handleInteraction();
                setIsSpotifyOpen(true);
              }}
              className="w-full sm:w-auto"
            >
              <span className="text-2xl">🎵</span>
              <span>Our Romantic Songs</span>
            </AkshitaMagicalButton>
          </TargetCursor>

          <TargetCursor
            cursorText="Discover Surprises"
            variant="akshita-special"
          >
            <AkshitaMagicalButton
              variant="surprises"
              size="lg"
              onClick={() => {
                handleInteraction();
                onNavigate('surprises');
              }}
              className="w-full sm:w-auto"
            >
              <span className="text-2xl">🎁</span>
              <span>Magical Surprises</span>
            </AkshitaMagicalButton>
          </TargetCursor>
        </motion.div>

        {/* Special AKSHITA Button */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
        >
          <TargetCursor
            cursorText="AKSHITA ✨"
            variant="akshita-special"
          >
            <AkshitaMagicalButton
              variant="akshita-special"
              size="xl"
              onClick={() => {
                handleInteraction();
                onNavigate('personalization');
              }}
              className="relative"
            >
              <span className="text-3xl">👑</span>
              <span>Made with Love for AKSHITA</span>
              <span className="text-3xl">👑</span>
            </AkshitaMagicalButton>
          </TargetCursor>
        </motion.div>

        {/* Sophisticated Features Display */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <motion.div
            className="sophisticated-card p-8 rounded-3xl backdrop-blur-sm bg-white/5 border border-white/10"
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="text-5xl mb-6">🗣️</div>
            <SophisticatedText variant="sophisticated-subtitle" className="mb-3">
              Voice Commands
            </SophisticatedText>
            <LuxuryParagraph size="sm" weight="light">
              Elegant voice interaction designed for AKSHITA's convenience
            </LuxuryParagraph>
          </motion.div>

          <motion.div
            className="sophisticated-card p-8 rounded-3xl backdrop-blur-sm bg-white/5 border border-white/10"
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="text-5xl mb-6">🤖</div>
            <SophisticatedText variant="sophisticated-subtitle" className="mb-3">
              AI Companion
            </SophisticatedText>
            <LuxuryParagraph size="sm" weight="light">
              Thoughtful conversations tailored for AKSHITA
            </LuxuryParagraph>
          </motion.div>

          <motion.div
            className="sophisticated-card p-8 rounded-3xl backdrop-blur-sm bg-white/5 border border-white/10"
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="text-5xl mb-6">🌟</div>
            <SophisticatedText variant="sophisticated-subtitle" className="mb-3">
              Personalized
            </SophisticatedText>
            <LuxuryParagraph size="sm" weight="light">
              Every detail crafted with love for AKSHITA
            </LuxuryParagraph>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating Romantic Elements */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl opacity-30"
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + (index % 2) * 40}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 10, -10, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          >
            {element.emoji}
          </motion.div>
        ))}
      </div>

      {/* Special Effect Overlay */}
      <AnimatePresence>
        {showSpecialEffect && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-400 text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ 
                  opacity: 0, 
                  scale: 0, 
                  rotate: 0 
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: 360,
                  y: [-50, -150],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              >
                {['💕', '✨', '💖', '🌟', '💫'][i % 5]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <AkshitaFloatingButton
        icon="💬"
        position="bottom-right"
        onClick={() => {
          handleInteraction();
          // This could trigger the chatbot
        }}
      />

      <AkshitaFloatingButton
        icon="🎵"
        position="bottom-left"
        onClick={() => {
          handleInteraction();
          onNavigate('music');
        }}
      />

      {/* Sophisticated Interaction Counter */}
      {interactionCount > 5 && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="sophisticated-card px-6 py-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20">
            <SophisticatedText variant="luxury-body">
              AKSHITA interacted {interactionCount} times
            </SophisticatedText>
          </div>
        </motion.div>
      )}

      {/* Elegant Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        animate={{
          y: [0, 12, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="sophisticated-card px-8 py-4 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-center">
          <LuxuryParagraph size="sm" weight="light" className="mb-3">
            Discover more elegance below
          </LuxuryParagraph>
          <motion.div 
            className="text-3xl"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↓
          </motion.div>
        </div>
      </motion.div>

      {/* Sophisticated Time Display & Night Mode Toggle */}
      <motion.div
        className="fixed top-4 left-4 z-50 flex items-center gap-4"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3, duration: 0.5 }}
      >
        <div className="sophisticated-time px-6 py-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20">
          <SophisticatedText variant="luxury-body" className="text-center">
            {currentTime.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })} with AKSHITA
          </SophisticatedText>
        </div>
        
        {/* Night Mode Toggle */}
        <motion.button
          className="night-mode-toggle w-12 h-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          onClick={() => setIsDarkMode(!isDarkMode)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <motion.span
            className="text-2xl"
            animate={{ rotate: isDarkMode ? 0 : 180 }}
            transition={{ duration: 0.5 }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Sophisticated Love Declarations */}
      <motion.div
        className="absolute top-1/4 left-8 z-30 hidden lg:block"
        animate={{
          rotate: [0, 3, -3, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="sophisticated-card px-8 py-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 transform -rotate-12">
          <SophisticatedText
            variant="romantic-script"
            delay={4}
          >
            Forever yours, AKSHITA
          </SophisticatedText>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-8 z-30 hidden lg:block"
        animate={{
          rotate: [0, -3, 3, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <div className="sophisticated-card px-8 py-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 transform rotate-12">
          <SophisticatedText
            variant="romantic-script"
            delay={5}
          >
            My heart belongs to you
          </SophisticatedText>
        </div>
      </motion.div>

      {/* Spotify Integration Modal */}
      <SpotifyIntegration
        isOpen={isSpotifyOpen}
        onClose={() => setIsSpotifyOpen(false)}
        theme={theme}
      />
    </section>
  );
};