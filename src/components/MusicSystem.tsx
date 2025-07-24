import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Music, Shuffle, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Howl } from 'howler';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  mood: 'romantic' | 'upbeat' | 'chill' | 'dreamy';
  memories?: string[];
}

interface MusicSystemProps {
  theme: 'morning' | 'evening' | 'night';
  onMoodChange?: (mood: string) => void;
}

const samplePlaylist: Song[] = [
  {
    id: '1',
    title: 'Our Song',
    artist: 'Your Favorite Artist',
    duration: 210,
    mood: 'romantic',
    memories: ['First Dance', 'Anniversary'],
  },
  {
    id: '2',
    title: 'Morning Sunshine',
    artist: 'Dreamy Duo',
    duration: 185,
    mood: 'upbeat',
    memories: ['Coffee Dates'],
  },
  {
    id: '3',
    title: 'Starlight Serenade',
    artist: 'Night Whispers',
    duration: 240,
    mood: 'dreamy',
    memories: ['Stargazing', 'Late Night Talks'],
  },
  {
    id: '4',
    title: 'Lazy Sunday',
    artist: 'Peaceful Hearts',
    duration: 195,
    mood: 'chill',
    memories: ['Lazy Mornings', 'Cuddling'],
  },
];

export const MusicSystem: React.FC<MusicSystemProps> = ({
  theme,
  onMoodChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(samplePlaylist[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isVisible, setIsVisible] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  // Visual sync states
  const [audioData, setAudioData] = useState<number[]>(new Array(32).fill(0));
  const [beatIntensity, setBeatIntensity] = useState(0);

  // Simulate audio visualization
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const newData = Array.from({ length: 32 }, () => Math.random() * 100);
      setAudioData(newData);
      
      const intensity = newData.reduce((sum, val) => sum + val, 0) / newData.length;
      setBeatIntensity(intensity);
      
      if (onMoodChange && currentSong) {
        onMoodChange(currentSong.mood);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentSong, onMoodChange]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    
    // Simulate time progression
    if (!isPlaying && currentSong) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentSong.duration) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  }, [isPlaying, currentSong]);

  const handleNext = useCallback(() => {
    const currentIndex = samplePlaylist.findIndex(song => song.id === currentSong?.id);
    const nextIndex = shuffle 
      ? Math.floor(Math.random() * samplePlaylist.length)
      : (currentIndex + 1) % samplePlaylist.length;
    
    setCurrentSong(samplePlaylist[nextIndex]);
    setCurrentTime(0);
  }, [currentSong, shuffle]);

  const handlePrevious = useCallback(() => {
    const currentIndex = samplePlaylist.findIndex(song => song.id === currentSong?.id);
    const prevIndex = shuffle
      ? Math.floor(Math.random() * samplePlaylist.length)
      : currentIndex === 0 ? samplePlaylist.length - 1 : currentIndex - 1;
    
    setCurrentSong(samplePlaylist[prevIndex]);
    setCurrentTime(0);
  }, [currentSong, shuffle]);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'romantic': return '#FF69B4';
      case 'upbeat': return '#FFD700';
      case 'chill': return '#87CEEB';
      case 'dreamy': return '#DDA0DD';
      default: return '#FF69B4';
    }
  };

  const getThemeGradient = () => {
    switch (theme) {
      case 'morning':
        return 'linear-gradient(135deg, #FFE4E1, #FFF8DC)';
      case 'evening':
        return 'linear-gradient(135deg, #DDA0DD, #FFE4E1)';
      case 'night':
        return 'linear-gradient(135deg, #191970, #4B0082)';
      default:
        return 'linear-gradient(135deg, #FFE4E1, #FFF8DC)';
    }
  };

  if (!currentSong) return null;

  return (
    <>
      {/* Music Control Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
      >
        <motion.button
          className="w-16 h-16 glass-romantic rounded-full flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsVisible(!isVisible)}
          animate={{
            boxShadow: isPlaying
              ? `0 0 30px ${getMoodColor(currentSong.mood)}80`
              : '0 0 20px rgba(255, 105, 180, 0.3)',
          }}
        >
          <Music className="w-6 h-6 text-romantic" />
          
          {/* Beat Pulse */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: getMoodColor(currentSong.mood) }}
              animate={{
                scale: [1, 1 + beatIntensity * 0.01, 1],
              }}
              transition={{ duration: 0.1 }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Music Player Interface */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-24 left-6 z-40"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div 
              className="glass-romantic rounded-3xl p-6 w-80 overflow-hidden relative"
              style={{ background: getThemeGradient() }}
            >
              {/* Audio Visualizer Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="flex items-end justify-center h-full space-x-1 p-4">
                  {audioData.map((height, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full"
                      style={{ backgroundColor: getMoodColor(currentSong.mood) }}
                      animate={{ height: `${Math.max(4, height)}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Song Info */}
                <div className="text-center mb-4">
                  <motion.h3 
                    className="font-romantic text-lg font-bold text-romantic"
                    animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
                    transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                  >
                    {currentSong.title}
                  </motion.h3>
                  <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
                  
                  {/* Mood Badge */}
                  <motion.div
                    className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${getMoodColor(currentSong.mood)}20`,
                      color: getMoodColor(currentSong.mood),
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {currentSong.mood}
                  </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <Slider
                    value={[currentTime]}
                    max={currentSong.duration}
                    step={1}
                    className="w-full"
                    onValueChange={(value) => setCurrentTime(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(currentSong.duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShuffle(!shuffle)}
                    className={`text-romantic hover:bg-romantic/20 ${shuffle ? 'bg-romantic/20' : ''}`}
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    className="text-romantic hover:bg-romantic/20"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  
                  <motion.button
                    className="w-12 h-12 glass rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${getMoodColor(currentSong.mood)}20` }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" style={{ color: getMoodColor(currentSong.mood) }} />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" style={{ color: getMoodColor(currentSong.mood) }} />
                    )}
                  </motion.button>
                  
                  <Button
                    variant="ghost"
                    onClick={handleNext}
                    className="text-romantic hover:bg-romantic/20"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRepeat(!repeat)}
                    className={`text-romantic hover:bg-romantic/20 ${repeat ? 'bg-romantic/20' : ''}`}
                  >
                    <Repeat className="w-4 h-4" />
                  </Button>
                </div>

                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-romantic" />
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    className="flex-1"
                    onValueChange={(value) => setVolume(value[0])}
                  />
                </div>

                {/* Memories */}
                {currentSong.memories && currentSong.memories.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground mb-2">Memories:</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {currentSong.memories.map((memory, i) => (
                        <motion.span
                          key={i}
                          className="text-xs px-2 py-1 glass rounded-full text-romantic"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
                        >
                          {memory}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};