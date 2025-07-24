import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface RollingGalleryProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
  images: string[];
  autoplayInterval?: number;
  className?: string;
}

export const RollingGallery: React.FC<RollingGalleryProps> = ({
  autoplay = true,
  pauseOnHover = true,
  images,
  autoplayInterval = 4000,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState(0);
  
  const dragX = useMotionValue(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform drag value to rotation
  const dragRotation = useTransform(dragX, [-200, 0, 200], [-15, 0, 15]);

  const nextImage = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && !isPaused && !isDragging) {
      intervalRef.current = setInterval(nextImage, autoplayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, isPaused, isDragging, nextImage, autoplayInterval]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    dragX.set(0);

    const threshold = 50;
    if (info.offset.x > threshold) {
      prevImage();
    } else if (info.offset.x < -threshold) {
      nextImage();
    }
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 90 : -90,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 90 : -90,
    }),
  };

  if (!images || images.length === 0) {
    return (
      <div className={`rolling-gallery-placeholder ${className}`}>
        <div className="flex items-center justify-center h-96 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <p className="text-white/60">No images to display</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`rolling-gallery relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {/* Main Image Container */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/20">
        <motion.div
          className="relative w-full h-full"
          style={{ x: dragX, rotateX: dragRotation }}
        >
          {images.map((image, index) => (
            index === currentIndex && (
              <motion.div
                key={`${image}-${index}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  rotateY: { duration: 0.6 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <img
                  src={image}
                  alt={`AKSHITA memory ${index + 1}`}
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
                
                {/* Beautiful overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl" />
                
                {/* Image counter */}
                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <span className="text-white text-sm font-medium">
                    {index + 1} / {images.length}
                  </span>
                </div>
              </motion.div>
            )
          ))}
        </motion.div>

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/20 transition-all duration-300 hover:scale-110"
          disabled={isDragging}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/20 transition-all duration-300 hover:scale-110"
          disabled={isDragging}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Autoplay Control */}
        {autoplay && (
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-full border border-white/20 transition-all duration-300"
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-white" />
            ) : (
              <Pause className="w-5 h-5 text-white" />
            )}
          </button>
        )}

        {/* Drag Hint */}
        {!isDragging && (
          <motion.div
            className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-white text-xs">Drag to explore</span>
          </motion.div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center mt-6 space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              index === currentIndex 
                ? 'border-purple-400 scale-110 shadow-lg shadow-purple-400/30' 
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {index === currentIndex && (
              <div className="absolute inset-0 bg-purple-400/20 backdrop-blur-[1px]" />
            )}
          </button>
        ))}
      </div>

      {/* Progress Indicator */}
      {autoplay && !isPaused && !isDragging && (
        <div className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: autoplayInterval / 1000, ease: "linear" }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  );
};

export default RollingGallery;