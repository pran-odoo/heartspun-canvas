import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, MapPin, Music, Camera, Plus } from 'lucide-react';

interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'photo' | 'song' | 'milestone' | 'trip' | 'surprise';
  location?: string;
  photos?: string[];
  feeling: 'happy' | 'romantic' | 'adventurous' | 'peaceful' | 'excited';
}

interface MemoryTimelineProps {
  theme: 'morning' | 'evening' | 'night';
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ theme }) => {
  const [memories] = useState<Memory[]>([
    {
      id: '1',
      date: '2023-01-14',
      title: 'Our First Date',
      description: 'The moment I knew you were special. Coffee turned into hours of conversation, and I never wanted it to end.',
      type: 'milestone',
      location: 'That cozy café downtown',
      feeling: 'romantic'
    },
    {
      id: '2',
      date: '2023-03-20',
      title: 'Spring Picnic',
      description: 'Cherry blossoms, homemade sandwiches, and your beautiful laugh echoing through the park.',
      type: 'photo',
      location: 'Central Park',
      feeling: 'happy'
    },
    {
      id: '3',
      date: '2023-06-15',
      title: 'Our Song',
      description: 'The first time we danced together in your living room. Now I hear it everywhere and think of you.',
      type: 'song',
      feeling: 'romantic'
    },
    {
      id: '4',
      date: '2023-09-10',
      title: 'Weekend Adventure',
      description: 'Getting lost in the mountains but finding ourselves. The sunrise was beautiful, but not as beautiful as you.',
      type: 'trip',
      location: 'Blue Ridge Mountains',
      feeling: 'adventurous'
    },
    {
      id: '5',
      date: '2023-12-24',
      title: 'Christmas Magic',
      description: 'Your eyes sparkled brighter than all the lights. The best gift was spending it with you.',
      type: 'surprise',
      feeling: 'excited'
    }
  ]);

  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isAddingMemory, setIsAddingMemory] = useState(false);
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

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-romantic font-bold text-romantic mb-6">
            Our Beautiful Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every memory with you is a treasure. Here's our story, one beautiful moment at a time.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-romantic via-primary to-gold rounded-full opacity-30" />

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
                  <Card
                    className={`glass-romantic p-6 hover-lift cursor-pointer transition-all duration-300 ${
                      selectedMemory?.id === memory.id ? 'ring-2 ring-romantic' : ''
                    }`}
                    onClick={() => setSelectedMemory(memory)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 glass rounded-lg">
                          {getTypeIcon(memory.type)}
                        </div>
                        <div>
                          <h3 className="font-romantic text-xl font-semibold text-romantic">
                            {memory.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {formatDate(memory.date)}
                          </p>
                        </div>
                      </div>
                      <Badge className={getFeelingColor(memory.feeling)}>
                        {memory.feeling}
                      </Badge>
                    </div>

                    <p className="text-foreground mb-4 leading-relaxed">
                      {memory.description}
                    </p>

                    {memory.location && (
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        {memory.location}
                      </div>
                    )}
                  </Card>
                </div>

                {/* Timeline Node */}
                <div className="relative w-2/12 flex justify-center">
                  <div className="w-6 h-6 bg-romantic rounded-full border-4 border-background shadow-lg animate-pulse-romantic" />
                  <div className="absolute top-8 glass rounded-lg px-3 py-1">
                    <span className="text-xs font-semibold text-romantic">
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
              className="glass-gold hover-lift px-8 py-4 text-lg font-semibold"
              size="lg"
            >
              <Plus className="w-6 h-6 mr-2" />
              Add New Memory
            </Button>
          </div>
        </div>

        {/* Memory Detail Modal */}
        {selectedMemory && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="glass-romantic max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-romantic font-bold text-romantic mb-2">
                    {selectedMemory.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {formatDate(selectedMemory.date)}
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedMemory(null)}
                  variant="outline"
                  size="sm"
                  className="glass"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <p className="text-lg leading-relaxed">
                  {selectedMemory.description}
                </p>

                {selectedMemory.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-5 h-5 mr-2" />
                    {selectedMemory.location}
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <Badge className={`${getFeelingColor(selectedMemory.feeling)} px-3 py-1 text-sm`}>
                    {selectedMemory.feeling}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(selectedMemory.type)}
                    <span className="text-sm capitalize">{selectedMemory.type}</span>
                  </div>
                </div>

                {/* Photo placeholder - would connect to real photos */}
                <div className="glass rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Photos and media for this memory would appear here
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Hidden file input for adding photos */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
      />
    </section>
  );
};