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
    
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

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
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${getThemeClasses()}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 morphing-bg opacity-30" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="floating absolute top-20 left-10 text-4xl">✨</div>
        <div className="floating-delayed absolute top-32 right-16 text-3xl">💫</div>
        <div className="floating absolute bottom-40 left-20 text-3xl">🌟</div>
        <div className="floating-delayed absolute bottom-20 right-10 text-4xl">💖</div>
      </div>

      {/* Main Content */}
      <div className={`glass-romantic rounded-3xl p-12 max-w-4xl mx-4 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
        <div className="space-y-8">
          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-romantic font-bold bg-gradient-to-r from-primary via-romantic to-gold bg-clip-text text-transparent animate-gradient-shift">
            {getThemeTitle()}
          </h1>

          {/* Animated Message */}
          <div className="h-16 flex items-center justify-center">
            <p className="text-2xl md:text-3xl text-romantic font-medium transition-all duration-500 transform">
              {messages[currentMessage]}
            </p>
          </div>

          {/* Interactive Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <Button
              onClick={() => onNavigate('memories')}
              className="glass-gold hover-lift h-24 flex-col space-y-2 animate-pulse-romantic"
              variant="outline"
            >
              <Camera className="w-8 h-8" />
              <span className="text-sm font-semibold">Our Memories</span>
            </Button>

            <Button
              onClick={() => onNavigate('music')}
              className="glass hover-lift h-24 flex-col space-y-2"
              variant="outline"
            >
              <Music className="w-8 h-8" />
              <span className="text-sm font-semibold">Our Songs</span>
            </Button>

            <Button
              onClick={() => onNavigate('timeline')}
              className="glass-romantic hover-lift h-24 flex-col space-y-2"
              variant="outline"
            >
              <Heart className="w-8 h-8" />
              <span className="text-sm font-semibold">Our Story</span>
            </Button>

            <Button
              onClick={() => onNavigate('surprises')}
              className="glass-gold hover-lift h-24 flex-col space-y-2 animate-shimmer"
              variant="outline"
            >
              <Sparkles className="w-8 h-8" />
              <span className="text-sm font-semibold">Surprises</span>
            </Button>
          </div>

          {/* Love Counter */}
          <div className="glass rounded-2xl p-6 mt-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-romantic">∞</div>
                <div className="text-sm text-muted-foreground">Days of Love</div>
              </div>
              <div className="text-4xl animate-pulse-romantic">💕</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-romantic">∞</div>
                <div className="text-sm text-muted-foreground">Reasons I Love You</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="star-particle absolute animate-star-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </section>
  );
};