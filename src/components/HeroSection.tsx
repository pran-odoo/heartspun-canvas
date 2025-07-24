import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Music, Camera } from 'lucide-react';

interface HeroSectionProps {
  theme: 'morning' | 'evening' | 'night';
  onNavigate: (section: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ theme, onNavigate }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const messages = [
    "Every moment with you is magical ✨",
    "You light up my world like nobody else 💫",
    "In a sea of people, my eyes will always search for you 💕",
    "You are my favorite notification 💌",
    "With you, every day feels like a fairytale 🌟"
  ];

  const getThemeTitle = () => {
    switch (theme) {
      case 'morning':
        return "Rise and Shine, My Love";
      case 'evening':
        return "Sunset Dreams Together";
      case 'night':
        return "Under the Stars with You";
      default:
        return "My Beautiful Love";
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'morning':
        return "morning-rays";
      case 'evening':
        return "evening-glow";
      case 'night':
        return "night-aurora";
      default:
        return "morning-rays";
    }
  };

  useEffect(() => {
    setIsVisible(true);
    
    // Cycle through messages with smooth transitions
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [messages.length]);

  // Enhanced message transition effect
  const [messageVisible, setMessageVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessageVisible(false);
      setTimeout(() => {
        setMessageVisible(true);
      }, 300);
    }, 3500);
    
    return () => clearTimeout(timer);
  }, [currentMessage]);

  useEffect(() => {
    // Create floating hearts periodically
    const createFloatingHeart = () => {
      const heart = document.createElement('div');
      heart.innerHTML = '💖';
      heart.className = 'heart-particle fixed pointer-events-none z-20';
      heart.style.left = Math.random() * window.innerWidth + 'px';
      heart.style.top = window.innerHeight + 'px';
      heart.style.fontSize = Math.random() * 20 + 15 + 'px';
      
      document.body.appendChild(heart);
      
      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }, 4000);
    };

    const heartInterval = setInterval(createFloatingHeart, 3000);
    return () => clearInterval(heartInterval);
  }, []);

  return (
    <section className={`min-h-screen flex items-center justify-center relative px-4 ${getThemeClasses()} transition-all duration-1000`}>
      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className={`glass-romantic rounded-3xl p-12 max-w-4xl mx-4 text-center transition-all duration-1000 gpu-accelerated ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
          
          {/* Romantic Title */}
          <h1 className="text-5xl md:text-7xl font-romantic font-bold text-romantic mb-8 animate-float">
            {getThemeTitle()}
          </h1>

          {/* Enhanced Animated Message */}
          <div className="h-16 flex items-center justify-center">
            <p className={`text-2xl md:text-3xl text-romantic font-medium transition-all duration-500 transform will-change-transform ${
              messageVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
            }`}>
              {messages[currentMessage]}
            </p>
          </div>

          {/* Enhanced Interactive Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <Button
              onClick={() => onNavigate('memories')}
              className="glass-gold hover-lift btn-smooth h-24 flex-col space-y-2 animate-pulse-romantic will-change-transform"
              variant="outline"
            >
              <Camera className="w-8 h-8 transition-transform duration-300" />
              <span className="text-sm font-semibold">Our Memories</span>
            </Button>

            <Button
              onClick={() => onNavigate('music')}
              className="glass hover-lift btn-smooth h-24 flex-col space-y-2 will-change-transform"
              variant="outline"
            >
              <Music className="w-8 h-8 transition-transform duration-300" />
              <span className="text-sm font-semibold">Our Songs</span>
            </Button>

            <Button
              onClick={() => onNavigate('timeline')}
              className="glass-romantic hover-lift btn-smooth h-24 flex-col space-y-2 will-change-transform"
              variant="outline"
            >
              <Heart className="w-8 h-8 transition-transform duration-300" />
              <span className="text-sm font-semibold">Our Story</span>
            </Button>

            <Button
              onClick={() => onNavigate('surprises')}
              className="glass-gold hover-lift btn-smooth h-24 flex-col space-y-2 animate-shimmer will-change-transform"
              variant="outline"
            >
              <Sparkles className="w-8 h-8 transition-transform duration-300" />
              <span className="text-sm font-semibold">Surprises</span>
            </Button>
          </div>

          {/* Enhanced Love Counter */}
          <div className="glass rounded-2xl p-6 mt-8 hover-lift transition-smooth">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-romantic animate-pulse-romantic">∞</div>
                <div className="text-sm text-muted-foreground">Days of Love</div>
              </div>
              <div className="text-4xl animate-pulse-romantic will-change-transform">💕</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-romantic animate-pulse-romantic">∞</div>
                <div className="text-sm text-muted-foreground">Reasons I Love You</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none will-change-transform">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="star-particle absolute animate-star-twinkle will-change-transform gpu-accelerated"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </section>
  );
};