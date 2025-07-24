import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, Star, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Surprise {
  id: string;
  type: 'message' | 'animation' | 'memory' | 'compliment' | 'quote';
  title: string;
  content: string;
  trigger: 'time' | 'weather' | 'mood' | 'interaction' | 'random';
  animation?: string;
  color?: string;
}

interface SurpriseGeneratorProps {
  theme: 'morning' | 'evening' | 'night';
  biometricData?: any;
  userMood?: string;
  onSurpriseShow?: (surprise: Surprise) => void;
}

const surpriseTemplates: Omit<Surprise, 'id'>[] = [
  {
    type: 'message',
    title: 'Morning Sunshine',
    content: 'Good morning, beautiful! Your smile is brighter than the sun today ☀️',
    trigger: 'time',
    color: '#FFD700',
  },
  {
    type: 'compliment',
    title: 'Random Compliment',
    content: 'Did you know that your laugh is literally my favorite sound in the entire world? 🎵',
    trigger: 'random',
    color: '#FF69B4',
  },
  {
    type: 'memory',
    title: 'Sweet Memory',
    content: 'Remember that time we danced in the rain? I think about that moment every time it storms 💃🌧️',
    trigger: 'weather',
    color: '#87CEEB',
  },
  {
    type: 'quote',
    title: 'Love Quote',
    content: '"You are my today and all of my tomorrows." - Leo Christopher 💖',
    trigger: 'mood',
    color: '#DDA0DD',
  },
  {
    type: 'animation',
    title: 'Heart Explosion',
    content: 'Sending you a universe of love! 💫',
    trigger: 'interaction',
    animation: 'heartExplosion',
    color: '#FF1493',
  },
  {
    type: 'message',
    title: 'Evening Thoughts',
    content: 'As the stars come out to play, I\'m thinking of how lucky I am to have you 🌟',
    trigger: 'time',
    color: '#9370DB',
  },
  {
    type: 'compliment',
    title: 'Beauty Notice',
    content: 'Just wanted to interrupt your day to remind you that you\'re absolutely stunning 😍',
    trigger: 'random',
    color: '#FF6347',
  },
  {
    type: 'memory',
    title: 'Cozy Memory',
    content: 'I love how we can just sit in comfortable silence together. You make everywhere feel like home 🏠',
    trigger: 'mood',
    color: '#F0E68C',
  },
];

export const SurpriseGenerator: React.FC<SurpriseGeneratorProps> = ({
  theme,
  biometricData,
  userMood,
  onSurpriseShow,
}) => {
  const [currentSurprise, setCurrentSurprise] = useState<Surprise | null>(null);
  const [surpriseHistory, setSurpriseHistory] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateSurprise = useCallback(() => {
    const currentHour = new Date().getHours();
    let availableSurprises = [...surpriseTemplates];

    // Filter by time
    if (currentHour >= 6 && currentHour < 12) {
      availableSurprises = availableSurprises.filter(s => 
        s.trigger === 'time' && s.content.includes('morning') || 
        s.trigger !== 'time'
      );
    } else if (currentHour >= 18) {
      availableSurprises = availableSurprises.filter(s => 
        s.trigger === 'time' && s.content.includes('evening') || 
        s.trigger !== 'time'
      );
    }

    // Filter by mood
    if (userMood === 'calm' || userMood === 'thoughtful') {
      availableSurprises = availableSurprises.filter(s => 
        s.type === 'quote' || s.type === 'memory' || s.trigger !== 'mood'
      );
    } else if (userMood === 'energetic' || userMood === 'happy') {
      availableSurprises = availableSurprises.filter(s => 
        s.type === 'animation' || s.type === 'compliment' || s.trigger !== 'mood'
      );
    }

    // Filter out recently shown surprises
    availableSurprises = availableSurprises.filter(s => 
      !surpriseHistory.includes(s.title)
    );

    if (availableSurprises.length === 0) {
      availableSurprises = [...surpriseTemplates];
      setSurpriseHistory([]);
    }

    const selectedTemplate = availableSurprises[Math.floor(Math.random() * availableSurprises.length)];
    const surprise: Surprise = {
      ...selectedTemplate,
      id: Date.now().toString(),
    };

    setCurrentSurprise(surprise);
    setSurpriseHistory(prev => [...prev, surprise.title].slice(-5)); // Keep last 5
    onSurpriseShow?.(surprise);

    // Handle animations
    if (surprise.animation) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 3000);
    }
  }, [userMood, surpriseHistory, onSurpriseShow]);

  // Random surprise timer
  useEffect(() => {
    const minInterval = 30000; // 30 seconds
    const maxInterval = 120000; // 2 minutes
    
    const scheduleNextSurprise = () => {
      const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;
      setTimeout(() => {
        if (Math.random() < 0.7) { // 70% chance
          generateSurprise();
        }
        scheduleNextSurprise(); // Schedule next
      }, randomInterval);
    };

    scheduleNextSurprise();
  }, [generateSurprise]);

  // Biometric-triggered surprises
  useEffect(() => {
    if (!biometricData?.heartRate) return;

    // High heart rate might mean excitement or stress
    if (biometricData.heartRate > 90 && Math.random() < 0.3) {
      generateSurprise();
    }
  }, [biometricData?.heartRate, generateSurprise]);

  // Weather-based surprises
  useEffect(() => {
    if (!biometricData?.location?.weather) return;

    if (biometricData.location.weather.includes('rain') && Math.random() < 0.4) {
      const rainySuprise = surpriseTemplates.find(s => s.content.includes('rain'));
      if (rainySuprise) {
        setCurrentSurprise({
          ...rainySuprise,
          id: Date.now().toString(),
        });
      }
    }
  }, [biometricData?.location?.weather]);

  const closeSurprise = () => {
    setCurrentSurprise(null);
  };

  const getAnimationVariants = (animationType?: string) => {
    switch (animationType) {
      case 'heartExplosion':
        return {
          initial: { scale: 0, rotate: 0 },
          animate: { 
            scale: [0, 1.2, 1], 
            rotate: [0, 180, 360]
          },
          transition: { duration: 1 }
        };
      default:
        return {
          initial: { opacity: 0, y: 50, scale: 0.8 },
          animate: { 
            opacity: 1, 
            y: 0, 
            scale: 1
          },
          transition: { type: "spring" as const, damping: 15 }
        };
    }
  };

  const getSurpriseIcon = (type: string) => {
    switch (type) {
      case 'compliment': return <Heart className="w-6 h-6" />;
      case 'memory': return <Star className="w-6 h-6" />;
      case 'animation': return <Sparkles className="w-6 h-6" />;
      case 'quote': return <Gift className="w-6 h-6" />;
      default: return <Heart className="w-6 h-6" />;
    }
  };

  return (
    <>
      {/* Manual Surprise Trigger */}
      <motion.div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
      >
        <Button
          onClick={generateSurprise}
          className="glass-romantic rounded-full px-6 py-3 hover:scale-105 transition-transform"
          disabled={!!currentSurprise}
        >
          <Gift className="w-4 h-4 mr-2" />
          <span className="text-romantic font-romantic">Surprise Me!</span>
        </Button>
      </motion.div>

      {/* Surprise Display */}
      <AnimatePresence>
        {currentSurprise && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSurprise}
            />

            {/* Surprise Card */}
            <motion.div
              className="relative glass-romantic rounded-3xl p-8 max-w-md w-full mx-4 text-center overflow-hidden"
              style={{ 
                backgroundColor: `${currentSurprise.color}10`,
                borderColor: `${currentSurprise.color}30`,
              }}
              {...getAnimationVariants(currentSurprise.animation)}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-6 gap-4 p-4">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <Heart key={i} className="w-4 h-4" />
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={closeSurprise}
                className="absolute top-4 right-4 text-romantic hover:bg-romantic/20"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  className="mb-4"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: currentSurprise.animation === 'heartExplosion' ? [0, 360] : 0,
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ color: currentSurprise.color }}
                >
                  {getSurpriseIcon(currentSurprise.type)}
                </motion.div>

                <motion.h2
                  className="font-romantic text-xl font-bold text-romantic mb-4"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentSurprise.title}
                </motion.h2>

                <motion.p
                  className="text-muted-foreground text-lg leading-relaxed mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {currentSurprise.content}
                </motion.p>

                <motion.div
                  className="flex justify-center space-x-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="text-2xl"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity, 
                        delay: i * 0.1 
                      }}
                    >
                      💖
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* Special Animation Effects */}
              {currentSurprise.animation === 'heartExplosion' && isAnimating && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 text-red-400 text-2xl"
                      initial={{ 
                        x: 0, 
                        y: 0, 
                        scale: 0,
                        opacity: 1 
                      }}
                      animate={{
                        x: Math.cos(i * 18 * Math.PI / 180) * 200,
                        y: Math.sin(i * 18 * Math.PI / 180) * 200,
                        scale: [0, 1, 0],
                        opacity: [1, 1, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        ease: "easeOut"
                      }}
                    >
                      💖
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};