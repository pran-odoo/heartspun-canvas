import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Note: This is a simplified implementation
// For production, you would use react-speech-recognition or Web Speech API

interface VoiceNavigationProps {
  onNavigate: (section: string) => void;
  onCommand?: (command: string) => void;
}

const voiceCommands = {
  'go home': 'hero',
  'show memories': 'memories',
  'play music': 'music',
  'open chat': 'chat',
  'view gallery': 'gallery',
  'surprise me': 'surprises',
  'settings': 'settings',
  'theme morning': 'theme-morning',
  'theme evening': 'theme-evening',
  'theme night': 'theme-night',
};

export const VoiceNavigation: React.FC<VoiceNavigationProps> = ({
  onNavigate,
  onCommand,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    try {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onstart = () => {
          setIsListening(true);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onresult = (event: any) => {
          try {
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              }
            }

            if (finalTranscript) {
              const cleanTranscript = finalTranscript.toLowerCase().trim();
              setTranscript(cleanTranscript);
              processVoiceCommand(cleanTranscript);
            }
          } catch (error) {
            console.warn('Voice processing error:', error);
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          // Handle specific errors
          if (event.error === 'not-allowed') {
            console.warn('Microphone access denied');
          } else if (event.error === 'no-speech') {
            console.warn('No speech detected');
          }
        };

        setRecognition(recognitionInstance);
        setIsSupported(true);
      } else {
        console.warn('Speech Recognition not supported in this browser');
        setIsSupported(false);
      }
    } catch (error) {
      console.error('Failed to initialize voice recognition:', error);
      setIsSupported(false);
    }
  }, []);

  const processVoiceCommand = useCallback((command: string) => {
    // Check for exact matches first
    if (voiceCommands[command as keyof typeof voiceCommands]) {
      const action = voiceCommands[command as keyof typeof voiceCommands];
      
      if (action.startsWith('theme-')) {
        onCommand?.(action);
      } else {
        onNavigate(action);
      }
      return;
    }

    // Check for partial matches
    for (const [voiceCommand, action] of Object.entries(voiceCommands)) {
      if (command.includes(voiceCommand)) {
        if (action.startsWith('theme-')) {
          onCommand?.(action);
        } else {
          onNavigate(action);
        }
        return;
      }
    }

    // Special romantic commands
    if (command.includes('i love you')) {
      onCommand?.('love-response');
    } else if (command.includes('you are beautiful')) {
      onCommand?.('compliment-response');
    } else if (command.includes('tell me something nice')) {
      onCommand?.('nice-message');
    }
  }, [onNavigate, onCommand]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  }, [recognition, isListening]);

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <div className="fixed top-6 left-6 z-40">
      <motion.div
        className="glass-romantic rounded-2xl p-4 min-w-64"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-romantic text-sm font-semibold text-romantic">
            Voice Commands
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleListening}
            className={`rounded-full ${
              isListening 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-romantic/20 text-romantic hover:bg-romantic/30'
            }`}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Status */}
        <div className="mb-3">
          <motion.div
            className={`text-xs px-2 py-1 rounded-full text-center ${
              isListening 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-muted text-muted-foreground'
            }`}
            animate={isListening ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
          >
            {isListening ? 'Listening...' : 'Click mic to start'}
          </motion.div>
        </div>

        {/* Transcript */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              className="mb-3 p-2 glass rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="text-xs text-romantic">
                "{transcript}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Commands */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Try saying:</p>
          <div className="grid grid-cols-2 gap-1">
            <span>"Go home"</span>
            <span>"Show memories"</span>
            <span>"Play music"</span>
            <span>"Open chat"</span>
            <span>"Theme night"</span>
            <span>"Surprise me"</span>
          </div>
        </div>

        {/* Listening Animation */}
        {isListening && (
          <div className="flex justify-center mt-3">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-4 bg-romantic rounded-full"
                  animate={{
                    scaleY: [1, 2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};