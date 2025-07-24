import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { Music2, Play, Pause, SkipForward, SkipBack, Heart, Playlist } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Music: React.FC = () => {
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
                Every song that reminds me of you. Smart playlists that adapt to your mood and the time of day.
              </p>
            </motion.div>

            <motion.div
              className="glass-gold rounded-3xl p-12 text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center justify-center space-x-4 mb-8">
                <Button variant="outline" size="lg" className="glass hover-lift btn-smooth">
                  <SkipBack className="w-6 h-6" />
                </Button>
                <Button size="lg" className="w-16 h-16 rounded-full glass-romantic hover-lift btn-smooth">
                  <Play className="w-8 h-8" />
                </Button>
                <Button variant="outline" size="lg" className="glass hover-lift btn-smooth">
                  <SkipForward className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="glass rounded-2xl p-6 max-w-md mx-auto">
                <p className="text-sm text-gold-deep mb-4">🎶 Coming Soon Features:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Spotify integration</p>
                  <p>• Mood-based playlists</p>
                  <p>• Memory-linked songs</p>
                  <p>• Shared listening sessions</p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Music;