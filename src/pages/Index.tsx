import React, { useState, useEffect, useCallback } from 'react';
import { ParticleSystem } from '@/components/ParticleSystem';
import { ThemeController } from '@/components/ThemeController';
import { HeroSection } from '@/components/HeroSection';
import { MemoryTimeline } from '@/components/MemoryTimeline';
import { CursorEffects } from '@/components/CursorEffects';
import { PersonalizationEngine } from '@/components/PersonalizationEngine';

const Index = () => {
  const [currentTheme, setCurrentTheme] = useState<'morning' | 'evening' | 'night'>('morning');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [userPreferences, setUserPreferences] = useState({});

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

  // Navigation handler
  const handleNavigation = (section: string) => {
    setActiveSection(section);
    
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Theme change handler
  const handleThemeChange = (theme: 'morning' | 'evening' | 'night') => {
    setCurrentTheme(theme);
  };

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
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 morphing-bg opacity-20 pointer-events-none" />
      
      {/* Particle System */}
      <ParticleSystem
        theme={currentTheme}
        mousePosition={mousePosition}
        isActive={effectsEnabled}
      />
      
      {/* Cursor Effects */}
      <CursorEffects
        theme={currentTheme}
        isActive={effectsEnabled}
      />
      
      {/* Theme Controller */}
      <ThemeController
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />
      
      {/* Effects Toggle */}
      <div className="fixed bottom-4 right-4 z-50">
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

      {/* Navigation Dots */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 space-y-4">
        {['hero', 'memories', 'timeline', 'personalization'].map((section) => (
          <button
            key={section}
            onClick={() => handleNavigation(section)}
            className={`w-3 h-3 rounded-full transition-all hover-lift ${
              activeSection === section 
                ? 'bg-romantic shadow-lg' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            title={section.charAt(0).toUpperCase() + section.slice(1)}
          />
        ))}
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