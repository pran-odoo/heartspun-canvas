import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Star, TrendingUp, Palette, Clock } from 'lucide-react';

interface UserPreferences {
  favoriteColors: string[];
  preferredTimes: string[];
  mostVisitedSections: Record<string, number>;
  interactionPatterns: Record<string, number>;
  moodHistory: Array<{ date: string; mood: string; }>;
}

interface PersonalizationEngineProps {
  theme: 'morning' | 'evening' | 'night';
  onPreferenceUpdate: (preferences: UserPreferences) => void;
}

export const PersonalizationEngine: React.FC<PersonalizationEngineProps> = ({
  theme,
  onPreferenceUpdate
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteColors: ['romantic', 'gold'],
    preferredTimes: ['evening'],
    mostVisitedSections: {
      memories: 15,
      timeline: 12,
      music: 8,
      surprises: 5
    },
    interactionPatterns: {
      clicks: 45,
      hovers: 23,
      scrolls: 67
    },
    moodHistory: [
      { date: '2024-01-01', mood: 'happy' },
      { date: '2024-01-02', mood: 'romantic' },
      { date: '2024-01-03', mood: 'excited' }
    ]
  });

  const [isLearning, setIsLearning] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [personalizedMessage, setPersonalizedMessage] = useState('');

  const trackInteraction = useCallback((type: string) => {
    setPreferences(prev => ({
      ...prev,
      interactionPatterns: {
        ...prev.interactionPatterns,
        [type]: (prev.interactionPatterns[type] || 0) + 1
      }
    }));
  }, []);

  const trackSectionVisit = useCallback((section: string) => {
    setPreferences(prev => ({
      ...prev,
      mostVisitedSections: {
        ...prev.mostVisitedSections,
        [section]: (prev.mostVisitedSections[section] || 0) + 1
      }
    }));
  }, []);

  const generateInsights = useCallback(() => {
    const newInsights: string[] = [];

    // Time preference insights
    const currentHour = new Date().getHours();
    if (currentHour >= 17 && currentHour <= 21) {
      newInsights.push("You seem to love our evening time together 🌅");
    }

    // Color preference insights
    if (preferences.favoriteColors.includes('romantic')) {
      newInsights.push("Pink and romantic colors make you smile 💗");
    }

    // Section preference insights
    const topSection = Object.entries(preferences.mostVisitedSections)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topSection) {
      newInsights.push(`You absolutely love the ${topSection[0]} section! ✨`);
    }

    // Interaction pattern insights
    if (preferences.interactionPatterns.hovers > preferences.interactionPatterns.clicks * 2) {
      newInsights.push("You love exploring with gentle touches 🎈");
    }

    setInsights(newInsights);
  }, [preferences]);

  const generatePersonalizedMessage = useCallback(() => {
    const messages = [
      "I notice you love spending time here in the evenings. This feels like our special time together. 💕",
      "Your favorite colors seem to be the romantic pinks and golds - they suit you perfectly! 🌸",
      "You've been exploring our memories a lot lately. I love reliving those moments with you. 📸",
      "The way you gently hover over everything shows how thoughtful and careful you are. 💫",
      "I'm learning more about what makes you happy every day. You're amazing! ⭐"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setPersonalizedMessage(randomMessage);
  }, []);

  const startLearningSession = () => {
    setIsLearning(true);
    
    // Simulate learning process
    setTimeout(() => {
      generateInsights();
      generatePersonalizedMessage();
      setIsLearning(false);
      onPreferenceUpdate(preferences);
    }, 2000);
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'romantic': return '💕';
      case 'excited': return '🎉';
      case 'peaceful': return '😌';
      case 'adventurous': return '🌟';
      default: return '💖';
    }
  };

  useEffect(() => {
    // Auto-track theme preferences
    setPreferences(prev => ({
      ...prev,
      preferredTimes: [...new Set([...prev.preferredTimes, theme])]
    }));
  }, [theme]);

  useEffect(() => {
    // Generate initial insights
    generateInsights();
    generatePersonalizedMessage();
  }, [generateInsights, generatePersonalizedMessage]);

  // Track interactions automatically
  useEffect(() => {
    const handleClick = () => trackInteraction('clicks');
    const handleScroll = () => trackInteraction('scrolls');
    
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [trackInteraction]);

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-romantic mr-4" />
            <h2 className="text-4xl font-romantic font-bold text-romantic">
              Learning About You
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every interaction teaches me more about what makes you smile. Here's what I've discovered...
          </p>
        </div>

        {/* Personalized Message */}
        {personalizedMessage && (
          <Card className="glass-romantic p-8 mb-12 text-center">
            <div className="text-2xl font-romantic text-romantic mb-4">
              💌 A Personal Note
            </div>
            <p className="text-lg leading-relaxed">{personalizedMessage}</p>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Preferences Dashboard */}
          <Card className="glass p-6">
            <div className="flex items-center mb-6">
              <Palette className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-xl font-semibold">Your Preferences</h3>
            </div>

            <div className="space-y-6">
              {/* Favorite Colors */}
              <div>
                <h4 className="font-medium mb-3">Favorite Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {preferences.favoriteColors.map((color, index) => (
                    <Badge key={index} variant="outline" className="glass-romantic">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Preferred Times */}
              <div>
                <h4 className="font-medium mb-3">Favorite Times</h4>
                <div className="flex gap-2">
                  {preferences.preferredTimes.map((time, index) => (
                    <Badge key={index} variant="outline" className="glass-gold">
                      <Clock className="w-3 h-3 mr-1" />
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recent Moods */}
              <div>
                <h4 className="font-medium mb-3">Recent Moods</h4>
                <div className="flex gap-2">
                  {preferences.moodHistory.slice(-3).map((mood, index) => (
                    <Badge key={index} variant="outline" className="glass">
                      {getMoodEmoji(mood.mood)} {mood.mood}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Analytics */}
          <Card className="glass p-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-romantic mr-3" />
              <h3 className="text-xl font-semibold">Activity Insights</h3>
            </div>

            <div className="space-y-6">
              {/* Most Visited Sections */}
              <div>
                <h4 className="font-medium mb-3">Favorite Sections</h4>
                {Object.entries(preferences.mostVisitedSections)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([section, count]) => (
                    <div key={section} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{section}</span>
                        <span>{count} visits</span>
                      </div>
                      <Progress 
                        value={(count / Math.max(...Object.values(preferences.mostVisitedSections))) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
              </div>

              {/* Interaction Patterns */}
              <div>
                <h4 className="font-medium mb-3">Interaction Style</h4>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(preferences.interactionPatterns).map(([type, count]) => (
                    <div key={type} className="text-center glass rounded-lg p-3">
                      <div className="text-2xl font-bold text-romantic">{count}</div>
                      <div className="text-xs text-muted-foreground capitalize">{type}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="glass-romantic p-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Heart className="w-6 h-6 text-romantic mr-3" />
              <h3 className="text-xl font-semibold">AI Insights About You</h3>
            </div>
            <Button
              onClick={startLearningSession}
              disabled={isLearning}
              className="glass hover-lift"
              size="sm"
            >
              {isLearning ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  Learning...
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 mr-2" />
                  Update Insights
                </>
              )}
            </Button>
          </div>

          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 glass rounded-xl"
                >
                  <div className="text-romantic text-xl">✨</div>
                  <p className="text-foreground">{insight}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Click "Update Insights" to see what I've learned about you!</p>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};