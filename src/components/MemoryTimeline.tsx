import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, MapPin, Music, Camera, Plus, Edit } from 'lucide-react';
import { ReactBitsLightning } from '@/components/ReactBitsLightning';
import { motion, AnimatePresence } from 'framer-motion';
import { MemoryEditModal } from '@/components/MemoryEditModal';
import { RollingGallery } from '@/components/RollingGallery';
import { akshitaPhotos } from '@/data/akshitaPhotos';

interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'photo' | 'song' | 'milestone' | 'trip' | 'surprise';
  location?: string;
  photos?: string[];
  feeling: 'happy' | 'romantic' | 'adventurous' | 'peaceful' | 'excited';
  tags?: string[];
}

interface MemoryTimelineProps {
  theme: 'morning' | 'evening' | 'night';
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ theme }) => {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      date: '2024-01-14',
      title: 'Our First Date',
      description: 'The moment I knew you were special. Coffee turned into hours of conversation, and I never wanted it to end.',
      type: 'milestone',
      location: 'That cozy café downtown',
      feeling: 'romantic',
      photos: []
    },
    {
      id: '2',
      date: '2024-03-20',
      title: 'Spring Picnic',
      description: 'Cherry blossoms, homemade sandwiches, and your beautiful laugh echoing through the park.',
      type: 'photo',
      location: 'Central Park',
      feeling: 'happy',
      photos: []
    },
    {
      id: '3',
      date: '2024-06-15',
      title: 'Our Song',
      description: 'The first time we danced together in your living room. Now I hear it everywhere and think of you.',
      type: 'song',
      feeling: 'romantic',
      photos: []
    },
    {
      id: '4',
      date: '2024-09-10',
      title: 'Weekend Adventure',
      description: 'Getting lost in the mountains but finding ourselves. The sunrise was beautiful, but not as beautiful as you.',
      type: 'trip',
      location: 'Blue Ridge Mountains',
      feeling: 'adventurous',
      photos: []
    },
    {
      id: '5',
      date: '2024-12-24',
      title: 'Christmas Magic',
      description: 'Your eyes sparkled brighter than all the lights. The best gift was spending it with you.',
      type: 'surprise',
      feeling: 'excited',
      photos: []
    },
    {
      id: '6',
      date: '2025-01-14',
      title: 'One Year Anniversary',
      description: 'Celebrating our beautiful journey together. A whole year of amazing memories with you, AKSHITA.',
      type: 'milestone',
      location: 'Our special place',
      feeling: 'romantic',
      photos: []
    }
  ]);

  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [hoveredMemoryId, setHoveredMemoryId] = useState<string | null>(null);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getTypeIcon = (type: Memory['type']) => {
    switch (type) {
      case 'photo': return <Camera className="w-5 h-5" />;
      case 'song': return <Music className="w-5 h-5" />;
      case 'milestone': return <Heart className="w-5 h-5" />;
      case 'trip': return <MapPin className="w-5 h-5" />;
      case 'surprise': return <Calendar className="w-5 h-5" />;
    }
  };

  const getFeelingColor = (feeling: Memory['feeling']) => {
    switch (feeling) {
      case 'happy': return 'bg-gold/20 text-gold-deep border-gold/30';
      case 'romantic': return 'bg-romantic/20 text-romantic-deep border-romantic/30';
      case 'adventurous': return 'bg-primary/20 text-primary-deep border-primary/30';
      case 'peaceful': return 'bg-accent/20 text-accent-foreground border-accent/30';
      case 'excited': return 'bg-gold/20 text-gold-deep border-gold/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setIsEditModalOpen(true);
  };

  const handleSaveMemory = (updatedMemory: Memory) => {
    setMemories(prevMemories => 
      prevMemories.map(memory => 
        memory.id === updatedMemory.id ? updatedMemory : memory
      )
    );
    setIsEditModalOpen(false);
    setEditingMemory(null);
  };

  const handleDeleteMemory = (memoryId: string) => {
    setMemories(prevMemories => 
      prevMemories.filter(memory => memory.id !== memoryId)
    );
    setIsEditModalOpen(false);
    setEditingMemory(null);
  };

  const handleMouseEnter = (memoryId: string) => {
    setHoveredMemoryId(memoryId);
  };

  const handleMouseLeave = () => {
    setHoveredMemoryId(null);
  };

  return (
    <section className="min-h-screen relative memory-section" data-background="dark" id="memories">
      {/* MANDATORY REACTBITS LIGHTNING BACKGROUND */}
      <ReactBitsLightning 
        intensity="high"
        color="#8B5CF6"
        isActive={true}
        className="lightning-background"
      />
      
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-romantic font-bold text-white mb-6">
              Our Beautiful Journey
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Every memory with you is a treasure. Here's our story, one beautiful moment at a time.
            </p>
          </div>

          {/* Rolling Gallery with AKSHITA Photos */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-romantic font-bold text-white mb-4">
                Precious Moments with AKSHITA
              </h3>
              <p className="text-lg text-white/70">
                Swipe through our beautiful memories together
              </p>
            </div>
            <RollingGallery 
              autoplay={true} 
              pauseOnHover={true}
              images={akshitaPhotos}
              autoplayInterval={5000}
              className="max-w-4xl mx-auto"
            />
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-400 via-pink-400 to-purple-600 rounded-full opacity-60" />

            {/* Memory Cards */}
            <div className="space-y-16">
              {memories.map((memory, index) => (
                <div
                  key={memory.id}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div 
                      className="relative memory-card group"
                      onMouseEnter={() => handleMouseEnter(memory.id)}
                      onMouseLeave={handleMouseLeave}
                      data-interactive
                    >
                      <Card
                        className={`glass-romantic p-6 hover-lift cursor-pointer transition-all duration-300 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 ${
                          selectedMemory?.id === memory.id ? 'ring-2 ring-purple-400' : ''
                        }`}
                        onClick={() => setSelectedMemory(memory)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                              {getTypeIcon(memory.type)}
                            </div>
                            <div>
                              <h3 className="font-romantic text-xl font-semibold text-white">
                                {memory.title}
                              </h3>
                              <p className="text-white/70 text-sm">
                                {formatDate(memory.date)}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                            {memory.feeling}
                          </Badge>
                        </div>

                        <p className="text-white/90 mb-4 leading-relaxed">
                          {memory.description}
                        </p>

                        {memory.location && (
                          <div className="flex items-center text-white/70 text-sm">
                            <MapPin className="w-4 h-4 mr-2" />
                            {memory.location}
                          </div>
                        )}
                      </Card>

                      {/* MANDATORY EDIT ME BUTTON */}
                      <AnimatePresence>
                        {hoveredMemoryId === memory.id && (
                          <motion.div
                            className="absolute top-4 right-4 z-20"
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                          >
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditMemory(memory);
                              }}
                              className="edit-button bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-400/90 hover:to-pink-400/90 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-purple-400/50 hover:border-purple-300/70 shadow-lg"
                              whileHover={{ 
                                scale: 1.1,
                                boxShadow: "0 0 25px rgba(139, 92, 246, 0.6)",
                                rotate: 5
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                <span className="font-semibold text-sm">Edit Me</span>
                              </div>
                              
                              {/* Electric glow effect */}
                              <motion.div
                                className="absolute inset-0 rounded-full bg-purple-400/30"
                                animate={{
                                  scale: [1, 1.4, 1],
                                  opacity: [0, 0.8, 0]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Timeline Node */}
                  <div className="relative w-2/12 flex justify-center">
                    <div className="w-6 h-6 bg-purple-400 rounded-full border-4 border-white shadow-lg animate-pulse" />
                    <div className="absolute top-8 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
                      <span className="text-xs font-semibold text-white">
                        {new Date(memory.date).getFullYear()}
                      </span>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="w-5/12" />
                </div>
              ))}
            </div>

            {/* Add Memory Button */}
            <div className="flex justify-center mt-16">
              <Button
                onClick={() => setIsAddingMemory(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold border-none shadow-lg"
                size="lg"
              >
                <Plus className="w-6 h-6 mr-2" />
                Add New Memory
              </Button>
            </div>
          </div>

          {/* Memory Detail Modal */}
          {selectedMemory && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-romantic font-bold text-white mb-2">
                      {selectedMemory.title}
                    </h3>
                    <p className="text-white/70">
                      {formatDate(selectedMemory.date)}
                    </p>
                  </div>
                  <Button
                    onClick={() => setSelectedMemory(null)}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  <p className="text-lg leading-relaxed text-white/90">
                    {selectedMemory.description}
                  </p>

                  {selectedMemory.location && (
                    <div className="flex items-center text-white/70">
                      <MapPin className="w-5 h-5 mr-2" />
                      {selectedMemory.location}
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 px-3 py-1 text-sm">
                      {selectedMemory.feeling}
                    </Badge>
                    <div className="flex items-center space-x-2 text-white/70">
                      {getTypeIcon(selectedMemory.type)}
                      <span className="text-sm capitalize">{selectedMemory.type}</span>
                    </div>
                  </div>

                  {/* Photo placeholder - would connect to real photos */}
                  <div className="bg-white/5 rounded-lg p-8 text-center border border-white/10">
                    <Camera className="w-12 h-12 mx-auto mb-4 text-white/50" />
                    <p className="text-white/50">
                      Photos and media for this memory would appear here
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Memory Edit Modal */}
          <MemoryEditModal
            memory={editingMemory}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingMemory(null);
            }}
            onSave={handleSaveMemory}
            onDelete={handleDeleteMemory}
          />
        </div>

        {/* Hidden file input for adding photos */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
        />
      </div>
    </section>
  );
};