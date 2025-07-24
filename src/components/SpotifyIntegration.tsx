import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TargetCursor } from './TargetCursor';

interface SpotifyIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'morning' | 'evening' | 'night';
}

interface Track {
  id: string;
  name: string;
  artist: string;
  duration: number;
  preview_url?: string;
  external_urls: {
    spotify: string;
  };
  album: {
    images: Array<{ url: string }>;
  };
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
}

const ROMANTIC_PLAYLISTS: Playlist[] = [
  {
    id: 'akshita-love-songs',
    name: 'AKSHITA\'s Love Symphony',
    description: 'Our most romantic moments in melody',
    tracks: [
      {
        id: '1',
        name: 'Perfect',
        artist: 'Ed Sheeran',
        duration: 263,
        external_urls: { spotify: 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v' },
        album: { images: [{ url: '/api/placeholder/300/300' }] }
      },
      {
        id: '2',
        name: 'All of Me',
        artist: 'John Legend',
        duration: 269,
        external_urls: { spotify: 'https://open.spotify.com/track/3U4isOIWM3VvDubwSI3y7a' },
        album: { images: [{ url: '/api/placeholder/300/300' }] }
      },
      {
        id: '3',
        name: 'Thinking Out Loud',
        artist: 'Ed Sheeran',
        duration: 281,
        external_urls: { spotify: 'https://open.spotify.com/track/lp-NjVQmaZ9H1pYFWM8hD' },
        album: { images: [{ url: '/api/placeholder/300/300' }] }
      }
    ]
  },
  {
    id: 'akshita-memories',
    name: 'AKSHITA\'s Memory Lane',
    description: 'Songs that remind us of our beautiful journey',
    tracks: [
      {
        id: '4',
        name: 'A Thousand Years',
        artist: 'Christina Perri',
        duration: 285,
        external_urls: { spotify: 'https://open.spotify.com/track/6Lpe1ddu5HgKOaWbHevFXj' },
        album: { images: [{ url: '/api/placeholder/300/300' }] }
      },
      {
        id: '5',
        name: 'Make You Feel My Love',
        artist: 'Adele',
        duration: 213,
        external_urls: { spotify: 'https://open.spotify.com/track/7dLEwQ6MHjb5AMSo06J9DQ' },
        album: { images: [{ url: '/api/placeholder/300/300' }] }
      }
    ]
  }
];

export const SpotifyIntegration: React.FC<SpotifyIntegrationProps> = ({
  isOpen,
  onClose,
  theme
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Spotify Authentication (simplified for demo)
  const handleSpotifyAuth = useCallback(() => {
    // In a real implementation, this would redirect to Spotify OAuth
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin + '/callback');
    const scopes = encodeURIComponent('playlist-read-private playlist-read-collaborative streaming user-read-playback-state user-modify-playback-state');
    
    if (clientId) {
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;
      window.location.href = authUrl;
    } else {
      // Demo mode - simulate authentication
      setIsAuthenticated(true);
      setCurrentPlaylist(ROMANTIC_PLAYLISTS[0]);
    }
  }, []);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    
    // In a real implementation, this would use Spotify Web API
    console.log('Playing track:', track.name, 'by', track.artist);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 100
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 100,
      transition: {
        duration: 0.2
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70"
          onClick={onClose}
          style={{ backdropFilter: 'blur(8px)' }}
        />

        {/* Modal Content */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-3xl border border-purple-500/30 overflow-hidden"
          variants={modalVariants}
          style={{ backdropFilter: 'blur(20px)' }}
        >
          {/* Header */}
          <div className="p-6 border-b border-purple-500/30">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  🎵 AKSHITA's Musical Journey
                </h2>
                <p className="text-purple-200">
                  Our romantic playlist collection
                </p>
              </div>
              <TargetCursor
                cursorText="Close"
                variant="romantic"
              >
                <button
                  onClick={onClose}
                  className="w-12 h-12 rounded-full bg-purple-500/20 hover:bg-purple-500/30 flex items-center justify-center text-white text-xl transition-colors"
                >
                  ✕
                </button>
              </TargetCursor>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {!isAuthenticated ? (
              // Authentication Screen
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🎧</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Connect to Spotify
                </h3>
                <p className="text-purple-200 mb-8 max-w-md mx-auto">
                  Connect your Spotify account to play our romantic playlist collection and create magical musical moments together.
                </p>
                <TargetCursor
                  cursorText="Connect Spotify"
                  variant="romantic"
                >
                  <button
                    onClick={handleSpotifyAuth}
                    className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-colors text-lg"
                  >
                    🎵 Connect with Spotify
                  </button>
                </TargetCursor>
              </div>
            ) : (
              // Main Interface
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Playlists */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    💕 Our Playlists
                  </h3>
                  <div className="space-y-4">
                    {ROMANTIC_PLAYLISTS.map((playlist) => (
                      <TargetCursor
                        key={playlist.id}
                        cursorText={`Play ${playlist.name}`}
                        variant="magnetic"
                      >
                        <div
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            currentPlaylist?.id === playlist.id
                              ? 'border-pink-400 bg-pink-500/20'
                              : 'border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20'
                          }`}
                          onClick={() => setCurrentPlaylist(playlist)}
                        >
                          <h4 className="font-semibold text-white mb-1">
                            {playlist.name}
                          </h4>
                          <p className="text-purple-200 text-sm">
                            {playlist.description}
                          </p>
                          <p className="text-purple-300 text-xs mt-2">
                            {playlist.tracks.length} songs
                          </p>
                        </div>
                      </TargetCursor>
                    ))}
                  </div>
                </div>

                {/* Current Playlist Tracks */}
                {currentPlaylist && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      🎶 {currentPlaylist.name}
                    </h3>
                    <div className="space-y-3">
                      {currentPlaylist.tracks.map((track, index) => (
                        <TargetCursor
                          key={track.id}
                          cursorText={`Play ${track.name}`}
                          variant="voice-command"
                        >
                          <div
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              currentTrack?.id === track.id
                                ? 'border-pink-400 bg-pink-500/20'
                                : 'border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/15'
                            }`}
                            onClick={() => playTrack(track)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-white font-semibold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-white text-sm">
                                  {track.name}
                                </h5>
                                <p className="text-purple-200 text-xs">
                                  {track.artist}
                                </p>
                              </div>
                              <div className="text-purple-300 text-xs">
                                {formatTime(track.duration)}
                              </div>
                            </div>
                          </div>
                        </TargetCursor>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Now Playing */}
            {currentTrack && (
              <div className="mt-8 p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl border border-pink-400/30">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white text-2xl">
                    🎵
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">
                      {currentTrack.name}
                    </h4>
                    <p className="text-pink-200">
                      {currentTrack.artist}
                    </p>
                  </div>
                  <TargetCursor
                    cursorText={isPlaying ? "Pause" : "Play"}
                    variant="romantic"
                  >
                    <button
                      onClick={togglePlayPause}
                      className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center text-white text-xl transition-colors"
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                  </TargetCursor>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};