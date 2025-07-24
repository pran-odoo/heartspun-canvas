import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AkshitaAnimatedText, AkshitaTextRotator, AkshitaHighlightText } from './AkshitaAnimatedText';
import { AkshitaMagicalButton, AkshitaFloatingButton } from './AkshitaMagicalButtons';
import { AkshitaDynamicBackground } from './AkshitaDynamicBackground';

interface HeroSectionProps {
  theme: 'morning' | 'evening' | 'night';
  onNavigate: (section: string) => void;
}

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

  // Track mouse for interactive effects
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Update time for dynamic greetings
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(timer);
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
      {/* Dynamic Background System */}
      <AkshitaDynamicBackground
        theme={theme}
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
        {/* Time-based Greeting */}
        <motion.div
          variants={itemVariants}
          className="mb-4"
        >
          <AkshitaAnimatedText
            text={`${getTimeBasedGreeting()}, Beautiful! 🌅`}
            variant="subtitle"
            className="akshita-subtitle inline-block"
          />
        </motion.div>

        {/* Main Hero Title with Rotating Messages */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <AkshitaTextRotator
            texts={romanticMessages}
            variant="hero"
            className="akshita-title"
            interval={5000}
          />
        </motion.div>

        {/* AKSHITA's Special Name Display */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
          onClick={handleInteraction}
        >
          <AkshitaAnimatedText
            text="AKSHITA"
            variant="akshita-special"
            className="cursor-pointer hover:scale-105 transition-transform duration-300"
            delay={2}
          />
        </motion.div>

        {/* Dynamic Notification Message */}
        <motion.div
          variants={itemVariants}
          className="mb-16"
        >
          <AkshitaTextRotator
            texts={notificationMessages}
            variant="notification"
            className="akshita-subtitle"
            interval={6000}
          />
        </motion.div>

        {/* Interactive Button Group */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
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

          <AkshitaMagicalButton
            variant="songs"
            size="lg"
            onClick={() => {
              handleInteraction();
              onNavigate('music');
            }}
            className="w-full sm:w-auto"
          >
            <span className="text-2xl">🎵</span>
            <span>Our Romantic Songs</span>
          </AkshitaMagicalButton>

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
        </motion.div>

        {/* Special AKSHITA Button */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
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
        </motion.div>

        {/* Interactive Features Display */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          <motion.div
            className="akshita-subtitle p-6 rounded-2xl"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-4xl mb-4">🗣️</div>
            <AkshitaHighlightText
              text="Voice commands for AKSHITA"
              highlightWord="AKSHITA"
              className="font-semibold"
            />
            <p className="mt-2 text-sm opacity-80">
              Just speak and I'll listen, beautiful
            </p>
          </motion.div>

          <motion.div
            className="akshita-subtitle p-6 rounded-2xl"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-4xl mb-4">🤖</div>
            <AkshitaHighlightText
              text="AI companion for AKSHITA"
              highlightWord="AKSHITA"
              className="font-semibold"
            />
            <p className="mt-2 text-sm opacity-80">
              Chat with me anytime, anywhere
            </p>
          </motion.div>

          <motion.div
            className="akshita-subtitle p-6 rounded-2xl"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-4xl mb-4">🌟</div>
            <AkshitaHighlightText
              text="Personalized for AKSHITA"
              highlightWord="AKSHITA"
              className="font-semibold"
            />
            <p className="mt-2 text-sm opacity-80">
              Every detail crafted with love
            </p>
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

      {/* Interaction Counter Display */}
      {interactionCount > 5 && (
        <motion.div
          className="fixed top-4 right-4 z-50 akshita-subtitle px-4 py-2 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <AkshitaHighlightText
            text={`AKSHITA clicked ${interactionCount} times! 💕`}
            highlightWord="AKSHITA"
          />
        </motion.div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        animate={{
          y: [0, 10, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="akshita-subtitle px-4 py-2 rounded-full text-center">
          <p className="text-sm mb-2">Discover more magic below</p>
          <div className="text-2xl">👇</div>
        </div>
      </motion.div>

      {/* Dynamic Time Display */}
      <motion.div
        className="fixed top-4 left-4 z-50 akshita-subtitle px-4 py-2 rounded-full"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3, duration: 0.5 }}
      >
        <AkshitaHighlightText
          text={`${currentTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })} with AKSHITA`}
          highlightWord="AKSHITA"
        />
      </motion.div>

      {/* Love Declaration */}
      <motion.div
        className="absolute top-1/4 left-8 z-30 hidden lg:block"
        animate={{
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="akshita-subtitle px-6 py-4 rounded-2xl transform -rotate-12">
          <AkshitaAnimatedText
            text="I love you, AKSHITA! 💖"
            variant="subtitle"
            delay={4}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-8 z-30 hidden lg:block"
        animate={{
          rotate: [0, -5, 5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <div className="akshita-subtitle px-6 py-4 rounded-2xl transform rotate-12">
          <AkshitaAnimatedText
            text="You're my everything! ✨"
            variant="subtitle"
            delay={5}
          />
        </div>
      </motion.div>
    </section>
  );
};