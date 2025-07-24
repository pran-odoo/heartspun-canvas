import React, { useState, useEffect, useCallback } from 'react';
import { ParticleSystem } from '@/components/ParticleSystem';
import { ThemeController } from '@/components/ThemeController';
import { HeroSection } from '@/components/HeroSection';
import { CursorEffects } from '@/components/CursorEffects';
import { FloatingNavigation } from '@/components/FloatingNavigation';
import { AICompanion } from '@/components/AICompanion';
import { MusicSystem } from '@/components/MusicSystem';
import { BiometricAwareness } from '@/components/BiometricAwareness';
import { Enhanced3DEffects } from '@/components/Enhanced3DEffects';
import { VoiceNavigation } from '@/components/VoiceNavigation';
import { SurpriseGenerator } from '@/components/SurpriseGenerator';
import { PageTransition } from '@/components/PageTransition';
import { useNavigation } from '@/contexts/NavigationContext';

const Index = () => {
  const { navigate, state, setTheme } = useNavigation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  // Initialize mouse tracking
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  // Enhanced voice command handler
  const handleVoiceCommand = useCallback((command: string) => {
    console.log('Voice command received:', command);
    
    // Handle theme commands
    if (command.startsWith('theme-')) {
      const theme = command.replace('theme-', '') as 'morning' | 'evening' | 'night';
      setTheme(theme);
      return;
    }

    // Handle special commands
    switch (command) {
      case 'love-response':
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
  }, [setTheme]);

  // Handle chat opening from voice commands
  const handleVoiceChatOpen = useCallback(() => {
    setIsVoiceTriggeredChat(true);
    // Reset the trigger after a short delay
    setTimeout(() => {
      setIsVoiceTriggeredChat(false);
    }, 1000);
  }, []);

  // Navigation handler for floating navigation
  const handleNavigation = useCallback((section: string) => {
    // Convert old section names to new routes
    const routeMap: Record<string, string> = {
      'hero': '/',
      'memories': '/memories',
      'music': '/music',
      'timeline': '/timeline',
      'personalization': '/personalization',
      'surprises': '/surprises',
      'gallery': '/gallery',
      'settings': '/settings',
    };

    const route = routeMap[section] || `/${section}`;
    navigate(route);
  }, [navigate]);

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
    <PageTransition className="theme-transition gpu-accelerated">
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 morphing-bg opacity-20 pointer-events-none will-change-transform" />
        
        {/* Enhanced 3D Particle System */}
        <Enhanced3DEffects
          theme={state.theme}
          mousePosition={mousePosition}
          isActive={effectsEnabled}
          beatIntensity={beatIntensity}
          biometricData={biometricData}
        />
        
        {/* Original Particle System (Fallback) */}
        <ParticleSystem
          theme={state.theme}
          mousePosition={mousePosition}
          isActive={effectsEnabled && !window.WebGLRenderingContext}
        />
        
        {/* Cursor Effects */}
        <CursorEffects
          theme={state.theme}
          isActive={effectsEnabled}
        />
        
        {/* Revolutionary Floating Navigation */}
        <FloatingNavigation
          onNavigate={handleNavigation}
          currentSection={state.currentPath.slice(1) || 'hero'}
          mousePosition={mousePosition}
        />
        
        {/* AI Companion Chatbot */}
        <AICompanion
          theme={state.theme}
          userName="Beautiful"
          isVoiceTriggered={isVoiceTriggeredChat}
          onVoiceCommand={handleVoiceCommand}
        />

        {/* Advanced Music System */}
        <MusicSystem
          theme={state.theme}
          onMoodChange={handleMoodChange}
        />

        {/* Biometric Awareness */}
        <BiometricAwareness
          theme={state.theme}
          onDataUpdate={handleBiometricUpdate}
        />

        {/* Voice Navigation */}
        <VoiceNavigation
          onCommand={handleVoiceCommand}
          onChatOpen={handleVoiceChatOpen}
        />

        {/* Surprise Generator */}
        <SurpriseGenerator
          theme={state.theme}
          biometricData={biometricData}
          userMood={currentMood}
        />
        
        {/* Theme Controller */}
        <ThemeController
          currentTheme={state.theme}
          onThemeChange={setTheme}
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
          <HeroSection
            theme={state.theme}
            onNavigate={handleNavigation}
          />
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
    </PageTransition>
  );
};

export default Index;