import React from 'react';
import { motion } from 'framer-motion';
import { LayoutWrapper } from './LayoutWrapper';

interface HeroProps {
  greeting?: string;
}

export const Hero: React.FC<HeroProps> = ({ 
  greeting = "Good Evening, Beautiful" 
}) => {
  const floatingElements = ['💖', '✨', '🌟', '💫', '💕'];

  return (
    <LayoutWrapper>
      <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center">
        {/* Floating Hearts/Sparkles - Behind main text */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {floatingElements.map((element, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl sm:text-3xl opacity-30 hidden sm:block sm:scale-100 scale-50"
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index * 10)}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5,
              }}
            >
              {element}
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          className="relative z-10 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Greeting */}
          <motion.p
            className="text-xl sm:text-2xl text-white/80 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {greeting}
          </motion.p>

          {/* AKSHITA Name */}
          <motion.h1
            className="text-6xl sm:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            AKSHITA
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            A digital love letter crafted with technology and heart
          </motion.p>
        </motion.div>

        {/* Additional floating elements for larger screens */}
        <div className="absolute inset-0 -z-10 overflow-hidden hidden md:block">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={`extra-${i}`}
              className="absolute text-lg opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.2,
              }}
            >
              {floatingElements[i % floatingElements.length]}
            </motion.div>
          ))}
        </div>
      </div>
    </LayoutWrapper>
  );
};