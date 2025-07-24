import React, { useState, useEffect, useCallback } from 'react';
import { ParticleSystem } from '@/components/ParticleSystem';
import { ThemeController } from '@/components/ThemeController';
import { HeroSection } from '@/components/HeroSection';
import { MemoryTimeline } from '@/components/MemoryTimeline';
import { CursorEffects } from '@/components/CursorEffects';
import { PersonalizationEngine } from '@/components/PersonalizationEngine';
import { FloatingNavigation } from '@/components/FloatingNavigation';
import { AICompanion } from '@/components/AICompanion';
import { MusicSystem } from '@/components/MusicSystem';
import { BiometricAwareness } from '@/components/BiometricAwareness';
import { Enhanced3DEffects } from '@/components/Enhanced3DEffects';
import { VoiceNavigation } from '@/components/VoiceNavigation';
import { SurpriseGenerator } from '@/components/SurpriseGenerator';

const Index = () => {
  const [currentTheme, setCurrentTheme] = useState<'morning' | 'evening' | 'night'>('morning');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [userPreferences, setUserPreferences] = useState({});
  const [currentMood, setCurrentMood] = useState('romantic');
  const [beatIntensity, setBeatIntensity] = useState(0);
  const [biometricData, setBiometricData] = useState({});
  const [isVoiceTriggeredChat, setIsVoiceTriggeredChat] = useState(false);

  // Mouse tracking for particle system
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Auto-detect time-based theme
  const getTimeBasedTheme = useCallback((): 'morning' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 17) return 'morning';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }, []);

  // Initialize theme and mouse tracking
  useEffect(() => {
    const initialTheme = getTimeBasedTheme();
    setCurrentTheme(initialTheme);
    
    // Apply initial theme to document
    document.documentElement.classList.add(initialTheme);
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [getTimeBasedTheme, handleMouseMove]);

  // Enhanced voice command handler
  const handleVoiceCommand = useCallback((command: string) => {
    console.log('Voice command received:', command);
    
    // Handle theme commands
    if (command.startsWith('theme-')) {
      const theme = command.replace('theme-', '') as 'morning' | 'evening' | 'night';
      handleThemeChange(theme);
      return;
    }

    // Handle special commands
    switch (command) {
      case 'love-response':
        // Could trigger a special animation or response
        console.log('💕 Love response triggered');
        break;
      case 'compliment-response':
        console.log('🌟 Compliment response triggered');
        break;
      case 'nice-message':
        console.log('✨ Nice message triggered');
        break;
      case 'help':
        console.log('❓ Help triggered');
        break;
      default:
        console.log('Unknown voice command:', command);
    }
  }, []);

  // Handle chat opening from voice commands
  const handleVoiceChatOpen = useCallback(() => {
    setIsVoiceTriggeredChat(true);
    // Reset the trigger after a short delay
    setTimeout(() => {
      setIsVoiceTriggeredChat(false);
    }, 1000);
  }, []);

  // Theme change handler with smooth transitions
  const handleThemeChange = (theme: 'morning' | 'evening' | 'night') => {
    // Add smooth transition class before changing theme
    document.documentElement.classList.add('theme-transition');
    
    // Remove old theme classes
    document.documentElement.classList.remove('morning', 'evening', 'night');
    
    // Add new theme class with a slight delay for smooth transition
    setTimeout(() => {
      document.documentElement.classList.add(theme);
      setCurrentTheme(theme);
    }, 50);

    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 550);
  };

  // Enhanced navigation handler with smooth scrolling
  const handleNavigation = (section: string) => {
    setActiveSection(section);
    
    // Smooth scroll to section with enhanced options
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      
      // Add visual feedback for section transition
      element.classList.add('section-enter');
      setTimeout(() => {
        element.classList.add('section-enter-active');
        element.classList.remove('section-enter');
      }, 50);
      
      // Clean up classes after transition
      setTimeout(() => {
        element.classList.remove('section-enter-active');
      }, 500);
    }
  };

  // Music mood change handler
  const handleMoodChange = useCallback((mood: string) => {
    setCurrentMood(mood);
  }, []);

  // Biometric data handler
  const handleBiometricUpdate = useCallback((data: any) => {
    setBiometricData(data);
  }, []);

  // Preference update handler
  const handlePreferenceUpdate = (preferences: any) => {
    setUserPreferences(preferences);
    console.log('Updated user preferences:', preferences);
  };

  // Create floating ambient elements
  useEffect(() => {
    const createAmbientElement = () => {
      const elements = ['✨', '💫', '🌟', '💖', '🎈'];
      const element = document.createElement('div');
      element.innerHTML = elements[Math.floor(Math.random() * elements.length)];
      element.className = 'floating fixed pointer-events-none z-20';
      element.style.left = Math.random() * window.innerWidth + 'px';
      element.style.top = window.innerHeight + 'px';
      element.style.fontSize = Math.random() * 20 + 15 + 'px';
      element.style.opacity = '0.7';
      
      // Animate upward
      element.style.animation = 'float 15s linear forwards';
      
      document.body.appendChild(element);
      
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 15000);
    };

    const interval = setInterval(createAmbientElement, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden theme-transition gpu-accelerated">
      {/* Background Effects */}
      <div className="fixed inset-0 morphing-bg opacity-20 pointer-events-none will-change-transform" />
      
      {/* Enhanced 3D Particle System */}
      <Enhanced3DEffects
        theme={currentTheme}
        mousePosition={mousePosition}
        isActive={effectsEnabled}
        beatIntensity={beatIntensity}
        biometricData={biometricData}
      />
      
      {/* Original Particle System (Fallback) */}
      <ParticleSystem
        theme={currentTheme}
        mousePosition={mousePosition}
        isActive={effectsEnabled && !window.WebGLRenderingContext}
      />
      
      {/* Cursor Effects */}
      <CursorEffects
        theme={currentTheme}
        isActive={effectsEnabled}
      />
      
      {/* Revolutionary Floating Navigation */}
      <FloatingNavigation
        onNavigate={handleNavigation}
        currentSection={activeSection}
        mousePosition={mousePosition}
      />
      
            {/* AI Companion Chatbot */}
      <AICompanion
        theme={currentTheme}
        userName="Beautiful"
        isVoiceTriggered={isVoiceTriggeredChat}
        onVoiceCommand={handleVoiceCommand}
      />

      {/* Advanced Music System */}
      <MusicSystem
        theme={currentTheme}
        onMoodChange={handleMoodChange}
      />

      {/* Biometric Awareness */}
      <BiometricAwareness
        theme={currentTheme}
        onDataUpdate={handleBiometricUpdate}
      />

      {/* Voice Navigation */}
      <VoiceNavigation
        onNavigate={handleNavigation}
        onCommand={handleVoiceCommand}
        onChatOpen={handleVoiceChatOpen}
      />

      {/* Surprise Generator */}
      <SurpriseGenerator
        theme={currentTheme}
        biometricData={biometricData}
        userMood={currentMood}
      />
      
      {/* Theme Controller */}
      <ThemeController
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />
      
      {/* Effects Toggle */}
      <div className="fixed bottom-4 right-20 z-50">
        <button
          onClick={() => setEffectsEnabled(!effectsEnabled)}
          className={`glass-romantic rounded-full p-3 hover-lift transition-all ${
            effectsEnabled ? 'text-romantic' : 'text-muted-foreground'
          }`}
          title={effectsEnabled ? 'Disable Effects' : 'Enable Effects'}
        >
          ✨
        </button>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <div id="hero">
          <HeroSection
            theme={currentTheme}
            onNavigate={handleNavigation}
          />
        </div>

        {/* Memory Timeline */}
        <div id="timeline">
          <MemoryTimeline theme={currentTheme} />
        </div>

        {/* Personalization Engine */}
        <div id="personalization">
          <PersonalizationEngine
            theme={currentTheme}
            onPreferenceUpdate={handlePreferenceUpdate}
          />
        </div>

        {/* Coming Soon Sections */}
        <div id="memories" className="min-h-screen flex items-center justify-center">
          <div className="glass-romantic rounded-3xl p-12 text-center max-w-2xl mx-4">
            <div className="text-6xl mb-6">📸</div>
            <h2 className="text-3xl font-romantic font-bold text-romantic mb-4">
              Photo Gallery
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our beautiful memories captured in time. Upload and organize photos with AI-powered recognition.
            </p>
            <div className="glass rounded-2xl p-6">
              <p className="text-sm text-romantic">Coming soon with drag-and-drop uploads! 💫</p>
            </div>
          </div>
        </div>

        <div id="music" className="min-h-screen flex items-center justify-center">
          <div className="glass-gold rounded-3xl p-12 text-center max-w-2xl mx-4">
            <div className="text-6xl mb-6">🎵</div>
            <h2 className="text-3xl font-romantic font-bold text-gold-deep mb-4">
              Our Soundtrack
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every song that reminds me of you. Smart playlists that adapt to your mood and the time of day.
            </p>
            <div className="glass rounded-2xl p-6">
              <p className="text-sm text-gold-deep">Spotify integration coming soon! 🎶</p>
            </div>
          </div>
        </div>

        <div id="surprises" className="min-h-screen flex items-center justify-center">
          <div className="glass rounded-3xl p-12 text-center max-w-2xl mx-4">
            <div className="text-6xl mb-6">🎁</div>
            <h2 className="text-3xl font-romantic font-bold text-primary mb-4">
              Surprise Generator
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Weather-aware, time-sensitive surprises just for you. Love notes that appear at perfect moments.
            </p>
            <div className="glass rounded-2xl p-6">
              <p className="text-sm text-primary">AI-powered surprises loading... ✨</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass-romantic p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-romantic font-romantic text-lg mb-4">
            Made with infinite love and cutting-edge technology 💖
          </p>
          <p className="text-muted-foreground text-sm">
            This website learns and grows more beautiful with every visit, just like our love.
          </p>
          <div className="mt-6 flex justify-center space-x-4 text-2xl">
            <span className="animate-pulse-romantic">💕</span>
            <span className="animate-float">✨</span>
            <span className="animate-pulse-romantic">💫</span>
            <span className="animate-float-delayed">🌟</span>
            <span className="animate-pulse-romantic">💖</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;