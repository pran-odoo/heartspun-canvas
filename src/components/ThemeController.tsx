import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Sunset } from 'lucide-react';

interface ThemeControllerProps {
  onThemeChange: (theme: 'morning' | 'evening' | 'night') => void;
  currentTheme: 'morning' | 'evening' | 'night';
}

export const ThemeController: React.FC<ThemeControllerProps> = ({
  onThemeChange,
  currentTheme
}) => {
  const [autoMode, setAutoMode] = useState(true);

  const getTimeBasedTheme = useCallback((): 'morning' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 17) {
      return 'morning';
    } else if (hour >= 17 && hour < 21) {
      return 'evening';
    } else {
      return 'night';
    }
  }, []);

  const applyTheme = useCallback((theme: 'morning' | 'evening' | 'night') => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('morning', 'evening', 'night');
    
    // Add new theme class
    root.classList.add(theme);
    
    // Update CSS custom properties based on theme
    const themeColors = {
      morning: {
        '--theme-gradient': 'linear-gradient(135deg, hsl(45 100% 85%), hsl(315 80% 85%))',
        '--theme-particle-color': 'hsl(45 100% 70%)',
        '--theme-accent': 'hsl(315 100% 70%)'
      },
      evening: {
        '--theme-gradient': 'linear-gradient(135deg, hsl(315 100% 65%), hsl(260 80% 40%))',
        '--theme-particle-color': 'hsl(315 100% 75%)',
        '--theme-accent': 'hsl(260 80% 70%)'
      },
      night: {
        '--theme-gradient': 'linear-gradient(135deg, hsl(280 100% 70%), hsl(240 100% 20%))',
        '--theme-particle-color': 'hsl(280 100% 80%)',
        '--theme-accent': 'hsl(240 80% 60%)'
      }
    };

    Object.entries(themeColors[theme]).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    onThemeChange(theme);
  }, [onThemeChange]);

  // Auto theme switching based on time
  useEffect(() => {
    if (!autoMode) return;

    const updateTheme = () => {
      const newTheme = getTimeBasedTheme();
      if (newTheme !== currentTheme) {
        applyTheme(newTheme);
      }
    };

    // Update immediately
    updateTheme();

    // Check every minute for time changes
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, [autoMode, currentTheme, getTimeBasedTheme, applyTheme]);

  const handleManualThemeChange = (theme: 'morning' | 'evening' | 'night') => {
    setAutoMode(false);
    applyTheme(theme);
    
    // Re-enable auto mode after 30 minutes
    setTimeout(() => setAutoMode(true), 30 * 60 * 1000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = "Beautiful"; // Can be made dynamic
    
    if (hour >= 5 && hour < 12) {
      return `Good morning, ${name} ☀️`;
    } else if (hour >= 12 && hour < 17) {
      return `Good afternoon, ${name} 🌤️`;
    } else if (hour >= 17 && hour < 21) {
      return `Good evening, ${name} 🌅`;
    } else {
      return `Good night, ${name} ✨`;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="glass-romantic rounded-2xl p-4 space-y-3">
        <div className="text-sm font-romantic text-romantic">
          {getGreeting()}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={currentTheme === 'morning' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleManualThemeChange('morning')}
            className="glass hover-lift"
          >
            <Sun className="w-4 h-4" />
          </Button>
          
          <Button
            variant={currentTheme === 'evening' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleManualThemeChange('evening')}
            className="glass hover-lift"
          >
            <Sunset className="w-4 h-4" />
          </Button>
          
          <Button
            variant={currentTheme === 'night' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleManualThemeChange('night')}
            className="glass hover-lift"
          >
            <Moon className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {autoMode ? 'Auto mode' : 'Manual mode'}
        </div>
      </div>
    </div>
  );
};