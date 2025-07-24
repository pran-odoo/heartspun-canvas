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

  // Enhanced magnetic following with smooth performance
  useEffect(() => {
    const magneticZone = 100;
    const dx = mousePosition.x - position.x;
    const dy = mousePosition.y - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < magneticZone) {
      const magnetStrength = 0.2; // Reduced for smoother movement
      const newX = position.x + dx * magnetStrength;
      const newY = position.y + dy * magnetStrength;
      
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        setPosition({ x: newX, y: newY });
      });
    }
  }, [mousePosition, position]);

  const handleItemClick = useCallback((sectionId: string) => {
    onNavigate(sectionId);
    setIsExpanded(false);
    
    // Add click feedback
    setHoveredItem(sectionId);
    setTimeout(() => setHoveredItem(null), 200);
  }, [onNavigate]);

  return (
    <motion.div
      className="fixed top-20 right-8 z-50 will-change-transform"
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{ 
        type: "spring", 
        damping: 20, 
        stiffness: 100,
        mass: 0.8
      }}
    >
      {/* Main Navigation Button */}
      <motion.button
        className="glass-romantic rounded-full w-16 h-16 flex items-center justify-center hover-lift transition-smooth will-change-transform"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isExpanded ? 45 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Home className="w-6 h-6 text-romantic" />
      </motion.button>

      {/* Navigation Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="absolute top-20 right-0 space-y-3 will-change-transform"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {navItems.slice(1).map((item, index) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              const isHovered = hoveredItem === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  className="relative group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                  <motion.button
                    className={`glass w-12 h-12 rounded-full flex items-center justify-center transition-smooth will-change-transform ${
                      isActive ? 'glass-romantic scale-110' : 'hover:glass-gold'
                    }`}
                    onClick={() => handleItemClick(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    whileHover={{ 
                      scale: 1.15,
                      boxShadow: `0 8px 25px ${item.color}40`
                    }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      backgroundColor: isActive || isHovered ? `${item.color}20` : 'transparent',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon 
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive ? 'text-romantic' : 'text-muted-foreground'
                      }`} 
                      style={{ color: isHovered ? item.color : undefined }}
                    />
                  </motion.button>

                  {/* Enhanced Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute right-16 top-1/2 transform -translate-y-1/2 px-3 py-1 glass-romantic rounded-lg text-sm font-medium text-romantic whitespace-nowrap will-change-transform"
                        initial={{ opacity: 0, x: 10, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {item.label}
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-romantic/20" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Progress Indicator */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-1 glass rounded-full overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-romantic to-gold"
          initial={{ x: '-100%' }}
          animate={{ x: `${(navItems.findIndex(item => item.id === currentSection) / navItems.length) * 100 - 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};