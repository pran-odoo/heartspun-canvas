import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { Gift, Sparkles, Heart, Zap, RefreshCw, Clock, CloudRain, Sun, Moon, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Surprise {
  id: string;
  message: string;
  type: 'romantic' | 'fun' | 'thoughtful' | 'weather' | 'time';
  icon: string;
  condition?: string;
}

const Surprises: React.FC = () => {
  const [currentSurprise, setCurrentSurprise] = useState<Surprise | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState<string>('sunny');
  const [timeOfDay, setTimeOfDay] = useState<string>('morning');

  // Get current time of day
  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  };

  // Simulate weather detection (in real app, would use weather API)
  const getWeatherCondition = () => {
    const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  // Comprehensive surprise database
  const surpriseDatabase: Surprise[] = [
    // Time-based surprises
    {
      id: '1',
      message: "Good morning, beautiful AKSHITA! ☀️ Your smile is brighter than the sunrise. How about we start the day with your favorite coffee?",
      type: 'time',
      icon: '☀️',
      condition: 'morning'
    },
    {
      id: '2',
      message: "Afternoon pick-me-up for my amazing AKSHITA! 🌺 You've been working so hard. Time for a sweet surprise!",
      type: 'time',
      icon: '🌺',
      condition: 'afternoon'
    },
    {
      id: '3',
      message: "Evening cuddles with AKSHITA sounds perfect right now! 🌙 Let's watch your favorite movie together.",
      type: 'time',
      icon: '🌙',
      condition: 'evening'
    },
    {
      id: '4',
      message: "Sweet dreams await, AKSHITA! 💫 But first, here's a little midnight surprise just for you!",
      type: 'time',
      icon: '💫',
      condition: 'night'
    },
    
    // Weather-based surprises
    {
      id: '5',
      message: "Perfect sunny day for a picnic with AKSHITA! 🧺☀️ I'll pack your favorite snacks and we'll find a beautiful spot.",
      type: 'weather',
      icon: '🧺',
      condition: 'sunny'
    },
    {
      id: '6',
      message: "Rainy day = perfect cuddle weather with AKSHITA! 🌧️☕ Hot chocolate and your favorite blanket are ready!",
      type: 'weather',
      icon: '☕',
      condition: 'rainy'
    },
    {
      id: '7',
      message: "Snow day magic with AKSHITA! ❄️⛄ Let's build a snowman and have a snowball fight!",
      type: 'weather',
      icon: '⛄',
      condition: 'snowy'
    },
    
    // Pure romantic surprises
    {
      id: '8',
      message: "Random reminder: You're absolutely incredible, AKSHITA! 💕 Your laugh is my favorite sound in the whole world.",
      type: 'romantic',
      icon: '💕'
    },
    {
      id: '9',
      message: "Surprise! AKSHITA, I've been thinking about our future together and it makes me smile every single time! 💍✨",
      type: 'romantic',
      icon: '💍'
    },
    {
      id: '10',
      message: "Just because you're AKSHITA and you deserve all the flowers in the world! 🌹🌸🌺 Virtual bouquet incoming!",
      type: 'romantic',
      icon: '🌹'
    },
    
    // Fun surprises
    {
      id: '11',
      message: "Surprise dance party for AKSHITA! 💃🎵 Your favorite songs are queued up and ready to go!",
      type: 'fun',
      icon: '💃'
    },
    {
      id: '12',
      message: "AKSHITA, let's be spontaneous today! 🎲 Close your eyes and point at the map - adventure awaits!",
      type: 'fun',
      icon: '🎲'
    },
    
    // Thoughtful surprises
    {
      id: '13',
      message: "AKSHITA, I noticed you've been stressed lately. Here's a virtual spa day! 🛁✨ Relaxation mode: activated!",
      type: 'thoughtful',
      icon: '🛁'
    },
    {
      id: '14',
      message: "Your favorite meal is being prepared with extra love for AKSHITA! 🍽️👨‍🍳 Dinner will be served shortly!",
      type: 'thoughtful',
      icon: '🍽️'
    }
  ];

  // Generate contextual surprise
  const generateSurprise = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const currentTime = getCurrentTimeOfDay();
    const currentWeather = getWeatherCondition();
    
    setTimeOfDay(currentTime);
    setWeather(currentWeather);
    
    // Find contextual surprises first
    const contextualSurprises = surpriseDatabase.filter(surprise => 
      surprise.condition === currentTime || surprise.condition === currentWeather
    );
    
    // If no contextual surprises, use random ones
    const availableSurprises = contextualSurprises.length > 0 ? contextualSurprises : surpriseDatabase;
    
    // Pick random surprise
    const randomSurprise = availableSurprises[Math.floor(Math.random() * availableSurprises.length)];
    
    setCurrentSurprise(randomSurprise);
    setIsLoading(false);
  };

  // Auto-generate surprise on page load
  useEffect(() => {
    generateSurprise();
  }, []);

  const getWeatherIcon = () => {
    switch (weather) {
      case 'sunny': return <Sun className="w-5 h-5" />;
      case 'rainy': return <CloudRain className="w-5 h-5" />;
      case 'snowy': return '❄️';
      default: return <Sun className="w-5 h-5" />;
    }
  };

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning': return <Coffee className="w-5 h-5" />;
      case 'afternoon': return <Sun className="w-5 h-5" />;
      case 'evening': return '🌅';
      case 'night': return <Moon className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <PageTransition className="theme-transition gpu-accelerated">
      <div className="min-h-screen relative overflow-x-hidden">
        <div className="fixed inset-0 morphing-bg opacity-20 pointer-events-none will-change-transform" />
        
        <main className="relative z-10 pt-8 pb-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="text-8xl mb-6">🎁</div>
              <h1 className="text-4xl md:text-6xl font-romantic font-bold text-primary mb-6">
                Surprise Generator
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Weather-aware, time-sensitive surprises just for AKSHITA. Love notes that appear at perfect moments.
              </p>
              
              {/* Context Display */}
              <div className="flex justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  {getTimeIcon()}
                  <span className="capitalize text-sm">{timeOfDay}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  {getWeatherIcon()}
                  <span className="capitalize text-sm">{weather}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="glass rounded-3xl p-12 text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: <Sparkles className="w-8 h-8" />, title: "Daily Surprises", desc: "Something special every day" },
                  { icon: <Heart className="w-8 h-8" />, title: "Love Notes", desc: "Personalized messages for AKSHITA" },
                  { icon: <Zap className="w-8 h-8" />, title: "Smart Timing", desc: "Perfect moments, every time" }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="glass-romantic rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="text-primary mb-4">{item.icon}</div>
                    <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
              
              {/* Surprise Display */}
              <div className="glass rounded-2xl p-8 mb-6">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="mb-4"
                      >
                        <RefreshCw className="w-8 h-8 text-primary" />
                      </motion.div>
                      <p className="text-primary">✨ Generating perfect surprise for AKSHITA...</p>
                      <div className="mt-4 w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-romantic rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2 }}
                        />
                      </div>
                    </motion.div>
                  ) : currentSurprise ? (
                    <motion.div
                      key="surprise"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center"
                    >
                      <div className="text-6xl mb-4">{currentSurprise.icon}</div>
                      <p className="text-lg text-primary leading-relaxed mb-4">
                        {currentSurprise.message}
                      </p>
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          currentSurprise.type === 'romantic' ? 'bg-romantic/20 text-romantic' :
                          currentSurprise.type === 'fun' ? 'bg-primary/20 text-primary' :
                          currentSurprise.type === 'thoughtful' ? 'bg-accent/20 text-accent-foreground' :
                          currentSurprise.type === 'weather' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {currentSurprise.type}
                        </span>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
              
              {/* Generate New Surprise Button */}
              <Button
                onClick={generateSurprise}
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-romantic hover:from-primary/80 hover:to-romantic/80 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Gift className="w-5 h-5 mr-2" />
                {isLoading ? 'Generating...' : 'Generate New Surprise'}
              </Button>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Surprises;