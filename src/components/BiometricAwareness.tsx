import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Clock, Thermometer, Eye } from 'lucide-react';

interface BiometricData {
  heartRate?: number;
  location?: {
    city: string;
    weather: string;
    temperature: number;
  };
  timeZone?: string;
  mood?: 'happy' | 'calm' | 'energetic' | 'thoughtful';
  interactionPattern?: {
    clicksPerMinute: number;
    scrollSpeed: number;
    timeSpent: number;
  };
}

interface BiometricAwarenessProps {
  onDataUpdate?: (data: BiometricData) => void;
  theme: 'morning' | 'evening' | 'night';
}

export const BiometricAwareness: React.FC<BiometricAwarenessProps> = ({
  onDataUpdate,
  theme,
}) => {
  const [biometricData, setBiometricData] = useState<BiometricData>({});
  const [isActive, setIsActive] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [sessionStart] = useState(Date.now());

  // Simulate heart rate monitoring
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate realistic heart rate variations
      const baseRate = 70;
      const variation = Math.sin(Date.now() / 10000) * 10 + Math.random() * 5;
      const heartRate = Math.round(baseRate + variation);

      setBiometricData(prev => ({
        ...prev,
        heartRate,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Track user interactions
  useEffect(() => {
    const handleClick = () => setClicks(prev => prev + 1);
    const handleScroll = () => setScrollDistance(prev => prev + 1);

    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    const interval = setInterval(() => {
      const timeSpent = (Date.now() - sessionStart) / 1000 / 60; // minutes
      const clicksPerMinute = clicks / Math.max(timeSpent, 1);
      const scrollSpeed = scrollDistance / Math.max(timeSpent, 1);

      setBiometricData(prev => ({
        ...prev,
        interactionPattern: {
          clicksPerMinute: Math.round(clicksPerMinute * 10) / 10,
          scrollSpeed: Math.round(scrollSpeed * 10) / 10,
          timeSpent: Math.round(timeSpent * 10) / 10,
        },
      }));
    }, 10000);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [clicks, scrollDistance, sessionStart]);

  // Get weather data (simulated)
  useEffect(() => {
    const getLocation = async () => {
      try {
        // Simulate getting location and weather
        const locations = [
          { city: 'New York', weather: 'Sunny', temperature: 22 },
          { city: 'London', weather: 'Cloudy', temperature: 16 },
          { city: 'Tokyo', weather: 'Rainy', temperature: 19 },
          { city: 'Paris', weather: 'Partly Cloudy', temperature: 20 },
        ];
        
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        
        setBiometricData(prev => ({
          ...prev,
          location: randomLocation,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }));
      } catch (error) {
        console.log('Location access not available');
      }
    };

    getLocation();
  }, []);

  // Analyze mood based on interaction patterns
  useEffect(() => {
    const pattern = biometricData.interactionPattern;
    if (!pattern) return;

    let mood: BiometricData['mood'] = 'calm';
    
    if (pattern.clicksPerMinute > 5 && pattern.scrollSpeed > 10) {
      mood = 'energetic';
    } else if (pattern.clicksPerMinute < 2 && pattern.scrollSpeed < 5) {
      mood = 'thoughtful';
    } else if (pattern.timeSpent > 10 && pattern.clicksPerMinute > 3) {
      mood = 'happy';
    }

    setBiometricData(prev => ({ ...prev, mood }));
  }, [biometricData.interactionPattern]);

  // Notify parent of data updates
  useEffect(() => {
    onDataUpdate?.(biometricData);
  }, [biometricData, onDataUpdate]);

  const requestPermissions = async () => {
    setIsActive(true);
    
    // Request geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location access granted');
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'happy': return '#FFD700';
      case 'calm': return '#87CEEB';
      case 'energetic': return '#FF6347';
      case 'thoughtful': return '#DDA0DD';
      default: return '#FF69B4';
    }
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'energetic': return '🚀';
      case 'thoughtful': return '🤔';
      default: return '💖';
    }
  };

  return (
    <div className="fixed top-6 right-6 z-30">
      {!isActive ? (
        <motion.button
          className="glass-romantic rounded-2xl p-4 text-center"
          onClick={requestPermissions}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Eye className="w-6 h-6 text-romantic mx-auto mb-2" />
          <p className="text-xs text-romantic">Enable Smart Features</p>
        </motion.button>
      ) : (
        <motion.div
          className="glass-romantic rounded-2xl p-4 space-y-3 w-64"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="font-romantic text-sm font-semibold text-romantic text-center">
            Biometric Awareness
          </h3>

          {/* Heart Rate */}
          {biometricData.heartRate && (
            <motion.div 
              className="flex items-center space-x-2"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: biometricData.heartRate ? 60/biometricData.heartRate : 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-xs text-romantic">
                {biometricData.heartRate} BPM
              </span>
              <div className="flex space-x-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-4 bg-red-400 rounded"
                    animate={{ 
                      scaleY: [0.3, 1, 0.3],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Location & Weather */}
          {biometricData.location && (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-romantic">
                  {biometricData.location.city}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-romantic">
                  {biometricData.location.weather}, {biometricData.location.temperature}°C
                </span>
              </div>
            </div>
          )}

          {/* Time Zone */}
          {biometricData.timeZone && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-romantic">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          )}

          {/* Mood */}
          {biometricData.mood && (
            <motion.div 
              className="flex items-center space-x-2 justify-center p-2 rounded-xl"
              style={{ backgroundColor: `${getMoodColor(biometricData.mood)}20` }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-lg">{getMoodEmoji(biometricData.mood)}</span>
              <span className="text-xs font-medium" style={{ color: getMoodColor(biometricData.mood) }}>
                {biometricData.mood}
              </span>
            </motion.div>
          )}

          {/* Interaction Pattern */}
          {biometricData.interactionPattern && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Clicks/min: {biometricData.interactionPattern.clicksPerMinute}</div>
              <div>Scroll speed: {biometricData.interactionPattern.scrollSpeed}</div>
              <div>Time: {biometricData.interactionPattern.timeSpent}min</div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};