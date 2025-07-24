import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Heart, Music, MessageCircle, Camera, Star, Settings } from 'lucide-react';

interface FloatingNavigationProps {
  onNavigate: (section: string) => void;
  currentSection: string;
  mousePosition: { x: number; y: number };
}

const navItems = [
  { id: 'hero', icon: Home, label: 'Home', color: '#FF69B4' },
  { id: 'memories', icon: Heart, label: 'Memories', color: '#FF1493' },
  { id: 'music', icon: Music, label: 'Music', color: '#9370DB' },
  { id: 'chat', icon: MessageCircle, label: 'Chat', color: '#FF6347' },
  { id: 'gallery', icon: Camera, label: 'Gallery', color: '#20B2AA' },
  { id: 'surprises', icon: Star, label: 'Surprises', color: '#FFD700' },
  { id: 'settings', icon: Settings, label: 'Settings', color: '#FF69B4' },
];

export const FloatingNavigation: React.FC<FloatingNavigationProps> = ({
  onNavigate,
  currentSection,
  mousePosition,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  // Follow cursor with magnetic effect
  useEffect(() => {
    const magneticZone = 100;
    const dx = mousePosition.x - position.x;
    const dy = mousePosition.y - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < magneticZone) {
      const magnetStrength = 0.3;
      setPosition(prev => ({
        x: prev.x + dx * magnetStrength,
        y: prev.y + dy * magnetStrength,
      }));
    }
  }, [mousePosition, position]);

  const handleItemClick = useCallback((sectionId: string) => {
    onNavigate(sectionId);
    setIsExpanded(false);
  }, [onNavigate]);

  return (
    <div className="fixed z-50 pointer-events-none">
      <motion.div
        className="pointer-events-auto"
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
      >
        <motion.div
          className="relative"
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
        >
          {/* Central Hub */}
          <motion.div
            className="w-16 h-16 glass-romantic rounded-full flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: isExpanded
                ? '0 0 40px rgba(255, 105, 180, 0.6)'
                : '0 0 20px rgba(255, 105, 180, 0.3)',
            }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className="w-6 h-6 text-romantic" />
            </motion.div>
          </motion.div>

          {/* Orbiting Navigation Items */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {navItems.map((item, index) => {
                  const angle = (index * 360) / navItems.length;
                  const radius = 80;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;

                  return (
                    <motion.div
                      key={item.id}
                      className="absolute top-1/2 left-1/2 origin-center"
                      initial={{ scale: 0, x: -8, y: -8 }}
                      animate={{
                        scale: 1,
                        x: x - 8,
                        y: y - 8,
                      }}
                      exit={{ scale: 0, x: -8, y: -8 }}
                      transition={{
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                    >
                      <motion.button
                        className="w-12 h-12 glass rounded-full flex items-center justify-center relative overflow-hidden"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onHoverStart={() => setHoveredItem(item.id)}
                        onHoverEnd={() => setHoveredItem(null)}
                        onClick={() => handleItemClick(item.id)}
                        style={{
                          backgroundColor: currentSection === item.id
                            ? `${item.color}20`
                            : 'transparent',
                        }}
                      >
                        <item.icon 
                          className="w-5 h-5"
                          style={{ color: item.color }}
                        />
                        
                        {/* Ripple Effect */}
                        {hoveredItem === item.id && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: `${item.color}30` }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          />
                        )}
                      </motion.button>

                      {/* Label */}
                      <AnimatePresence>
                        {hoveredItem === item.id && (
                          <motion.div
                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <div className="glass-romantic px-3 py-1 rounded-full text-xs text-romantic font-romantic">
                              {item.label}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Connection Lines */}
          <AnimatePresence>
            {isExpanded && (
              <motion.svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                style={{ width: '200px', height: '200px', left: '-60px', top: '-60px' }}
              >
                {navItems.map((_, index) => {
                  const angle = (index * 360) / navItems.length;
                  const radius = 80;
                  const x = Math.cos((angle * Math.PI) / 180) * radius + 100;
                  const y = Math.sin((angle * Math.PI) / 180) * radius + 100;

                  return (
                    <motion.line
                      key={index}
                      x1="100"
                      y1="100"
                      x2={x}
                      y2={y}
                      stroke="url(#gradient)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: index * 0.1 }}
                    />
                  );
                })}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF69B4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FF1493" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};