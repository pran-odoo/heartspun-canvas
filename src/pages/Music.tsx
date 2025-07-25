import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { Music2, Play, Pause, SkipForward, SkipBack, Heart, List, Volume2, Repeat, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  audioUrl?: string; // In a real app, this would be actual audio files
  memory: string;
  mood: 'romantic' | 'happy' | 'peaceful' | 'energetic';
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  coverGradient: string;
}

const Music: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // AKSHITA's Romantic Songs Database
  const akshitaPlaylists: Playlist[] = [
    {
      id: 'romantic',
      name: 'Our Love Songs',
      description: 'Songs that remind me of AKSHITA',
      coverGradient: 'from-pink-500 to-rose-500',
      songs: [
        {
          id: '1',
          title: 'Perfect',
          artist: 'Ed Sheeran',
          duration: '4:23',
          coverUrl: '/api/placeholder/300/300',
          memory: 'The song that was playing during our first dance',
          mood: 'romantic'
        },
        {
          id: '2',
          title: 'All of Me',
          artist: 'John Legend',
          duration: '4:29',
          coverUrl: '/api/placeholder/300/300',
          memory: 'AKSHITA hummed this while cooking together',
          mood: 'romantic'
        },
        {
          id: '3',
          title: 'Thinking Out Loud',
          artist: 'Ed Sheeran',
          duration: '4:41',
          coverUrl: '/api/placeholder/300/300',
          memory: 'Our song for quiet evenings together',
          mood: 'peaceful'
        },
        {
          id: '4',
          title: 'Can\'t Help Myself',
          artist: 'Four Tops',
          duration: '2:54',
          coverUrl: '/api/placeholder/300/300',
          memory: 'AKSHITA\'s favorite oldies song',
          mood: 'happy'
        }
      ]
    },
    {
      id: 'morning',
      name: 'Morning with AKSHITA',
      description: 'Songs for beautiful mornings together',
      coverGradient: 'from-yellow-400 to-orange-500',
      songs: [
        {
          id: '5',
          title: 'Here Comes the Sun',
          artist: 'The Beatles',
          duration: '3:05',
          coverUrl: '/api/placeholder/300/300',
          memory: 'AKSHITA\'s wake-up song',
          mood: 'happy'
        },
        {
          id: '6',
          title: 'Good Morning Beautiful',
          artist: 'Steve Holy',
          duration: '3:45',
          coverUrl: '/api/placeholder/300/300',
          memory: 'How I greet AKSHITA every morning',
          mood: 'romantic'
        }
      ]
    },
    {
      id: 'chill',
      name: 'Chill Vibes with AKSHITA',
      description: 'Relaxing songs for cozy moments',
      coverGradient: 'from-blue-400 to-purple-500',
      songs: [
        {
          id: '7',
          title: 'Stay',
          artist: 'Rihanna',
          duration: '4:00',
          coverUrl: '/api/placeholder/300/300',
          memory: 'Rainy day cuddles with AKSHITA',
          mood: 'peaceful'
        },
        {
          id: '8',
          title: 'Wonderful Tonight',
          artist: 'Eric Clapton',
          duration: '3:43',
          coverUrl: '/api/placeholder/300/300',
          memory: 'How AKSHITA looks every night',
          mood: 'romantic'
        }
      ]
    }
  ];

  // Initialize with first playlist
  useEffect(() => {
    if (akshitaPlaylists.length > 0) {
      setCurrentPlaylist(akshitaPlaylists[0]);
      setCurrentSong(akshitaPlaylists[0].songs[0]);
    }
  }, []);

  // Simulate audio playback (in a real app, would use actual audio)
  useEffect(() => {
    if (isPlaying && currentSong) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          // Simulate song ending
          if (newTime >= parseDuration(currentSong.duration)) {
            // Use setTimeout to avoid state update during render
            setTimeout(() => handleNext(), 0);
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSong, handleNext]);

  const parseDuration = (duration: string) => {
    const [minutes, seconds] = duration.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = useCallback(() => {
    if (!currentPlaylist || !currentSong) return;
    
    const currentIndex = currentPlaylist.songs.findIndex(song => song.id === currentSong.id);
    let nextIndex;
    
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * currentPlaylist.songs.length);
    } else {
      nextIndex = (currentIndex + 1) % currentPlaylist.songs.length;
    }
    
    setCurrentSong(currentPlaylist.songs[nextIndex]);
    setCurrentTime(0);
  }, [currentPlaylist, currentSong, isShuffle]);

  const handlePrevious = () => {
    if (!currentPlaylist || !currentSong) return;
    
    const currentIndex = currentPlaylist.songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentPlaylist.songs.length - 1;
    
    setCurrentSong(currentPlaylist.songs[prevIndex]);
    setCurrentTime(0);
  };

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const progress = currentSong ? (currentTime / parseDuration(currentSong.duration)) * 100 : 0;

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
              <div className="text-8xl mb-6">🎵</div>
              <h1 className="text-4xl md:text-6xl font-romantic font-bold text-gold-deep mb-6">
                Our Soundtrack
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Every song that reminds me of AKSHITA. Our special playlist for every moment together.
              </p>
            </motion.div>

            {/* Music Player */}
            <motion.div
              className="glass-gold rounded-3xl p-8 mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {currentSong && (
                <>
                  {/* Now Playing Display */}
                  <div className="text-center mb-6">
                    <div className="w-48 h-48 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-6xl">
                      🎼
                    </div>
                    <h3 className="text-2xl font-bold text-gold-deep mb-2">{currentSong.title}</h3>
                    <p className="text-lg text-muted-foreground mb-2">{currentSong.artist}</p>
                    <p className="text-sm text-gold-deep italic">"{currentSong.memory}"</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{currentSong.duration}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <motion.div
                        className="h-2 bg-gradient-to-r from-gold to-romantic rounded-full"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <Button
                      variant="outline"
                      size="lg"
                      className="glass hover-lift btn-smooth"
                      onClick={() => setIsShuffle(!isShuffle)}
                    >
                      <Shuffle className={`w-5 h-5 ${isShuffle ? 'text-gold' : ''}`} />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="glass hover-lift btn-smooth"
                      onClick={handlePrevious}
                    >
                      <SkipBack className="w-6 h-6" />
                    </Button>
                    
                    <Button
                      size="lg"
                      className="w-16 h-16 rounded-full glass-romantic hover-lift btn-smooth"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="glass hover-lift btn-smooth"
                      onClick={handleNext}
                    >
                      <SkipForward className="w-6 h-6" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="glass hover-lift btn-smooth"
                      onClick={() => setIsRepeat(!isRepeat)}
                    >
                      <Repeat className={`w-5 h-5 ${isRepeat ? 'text-gold' : ''}`} />
                    </Button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center justify-center space-x-3">
                    <Volume2 className="w-4 h-4" />
                    <div className="w-24 bg-white/20 rounded-full h-1">
                      <div
                        className="h-1 bg-gold rounded-full"
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Playlists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {akshitaPlaylists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  className={`glass rounded-2xl p-6 cursor-pointer hover-lift ${
                    currentPlaylist?.id === playlist.id ? 'ring-2 ring-gold' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  onClick={() => setCurrentPlaylist(playlist)}
                >
                  <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${playlist.coverGradient} mb-4 flex items-center justify-center text-4xl`}>
                    <List />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{playlist.description}</p>
                  <p className="text-xs text-gold">{playlist.songs.length} songs</p>
                </motion.div>
              ))}
            </div>

            {/* Current Playlist Songs */}
            {currentPlaylist && (
              <motion.div
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <List className="w-5 h-5 mr-2" />
                  {currentPlaylist.name}
                </h3>
                <div className="space-y-3">
                  {currentPlaylist.songs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                        currentSong?.id === song.id 
                          ? 'bg-gold/20 border border-gold/30' 
                          : 'hover:bg-white/10'
                      }`}
                      onClick={() => handleSongSelect(song)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mr-4">
                        {currentSong?.id === song.id && isPlaying ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          >
                            🎵
                          </motion.div>
                        ) : (
                          <Music2 className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{song.title}</h4>
                        <p className="text-sm text-muted-foreground">{song.artist}</p>
                        <p className="text-xs text-gold italic">"{song.memory}"</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-romantic" />
                        <span className="text-sm text-muted-foreground">{song.duration}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Music;