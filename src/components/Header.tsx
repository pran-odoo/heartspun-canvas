import React from 'react';
import { motion } from 'framer-motion';
import { Music, Sparkles, MessageCircle } from 'lucide-react';
import { LayoutWrapper } from './LayoutWrapper';

interface HeaderProps {
  onMusicClick?: () => void;
  onSparkleClick?: () => void;
  onChatClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMusicClick,
  onSparkleClick,
  onChatClick
}) => {
  return (
    <LayoutWrapper>
      <div className="relative flex items-center justify-between w-full">
        {/* Left Icon - Music */}
        <motion.button
          onClick={onMusicClick}
          className="absolute left-0 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          style={{ minWidth: '2.5rem' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Music className="w-5 h-5 text-white" />
        </motion.button>

        {/* Center Tagline */}
        <div className="flex-1 text-center mx-20">
          <motion.h1 
            className="text-lg sm:text-xl font-semibold text-white/90"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Made with Love for AKSHITA
          </motion.h1>
        </div>

        {/* Right Icons Container */}
        <div className="absolute right-0 flex items-center space-x-2">
          {/* Sparkle Icon */}
          <motion.button
            onClick={onSparkleClick}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.button>

          {/* Chat Icon */}
          <motion.button
            onClick={onChatClick}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>
    </LayoutWrapper>
  );
};