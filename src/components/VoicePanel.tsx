import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, ChevronDown, ChevronUp } from 'lucide-react';
import Draggable from 'react-draggable';

interface VoicePanelProps {
  onNavigate: (section: string) => void;
  onCommand?: (command: string) => void;
}

export const VoicePanel: React.FC<VoicePanelProps> = ({
  onNavigate,
  onCommand,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth < 640) {
        setIsCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => setIsListening(true);
      recognitionInstance.onend = () => setIsListening(false);
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        setTranscript(transcript);
        
        if (event.results[event.results.length - 1].isFinal) {
          handleVoiceCommand(transcript);
        }
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    }
  }, []);

  const handleVoiceCommand = useCallback((command: string) => {
    const commands: Record<string, string> = {
      'go home': 'hero',
      'show memories': 'memories',
      'play music': 'music',
      'open chat': 'chat',
      'surprise me': 'surprises',
      'show timeline': 'timeline',
    };

    const matchedCommand = Object.keys(commands).find(cmd => 
      command.includes(cmd)
    );

    if (matchedCommand) {
      onNavigate(commands[matchedCommand]);
      setTranscript('');
    }

    if (onCommand) {
      onCommand(command);
    }
  }, [onNavigate, onCommand]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Draggable
      handle=".drag-handle"
      bounds="parent"
      disabled={isMobile}
    >
      <motion.div
        className="fixed top-4 left-4 z-50 select-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          {/* Header with drag handle and collapse button */}
          <div className="drag-handle flex items-center justify-between p-3 cursor-move">
            <div className="flex items-center space-x-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-400' : 'bg-gray-400'}`}
                animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <span className="text-white/80 text-sm font-medium">Voice</span>
            </div>
            
            {!isMobile && (
              <button
                onClick={toggleCollapse}
                className="text-white/60 hover:text-white/80 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Collapsible content */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-white/10"
              >
                <div className="p-4 space-y-3">
                  {/* Mic button */}
                  <motion.button
                    onClick={toggleListening}
                    disabled={!isSupported}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                      isListening
                        ? 'bg-red-500/20 border border-red-400/30 text-red-300'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    } disabled:opacity-50`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {isListening ? 'Stop' : 'Start'} Listening
                    </span>
                  </motion.button>

                  {/* Transcript display */}
                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <p className="text-white/70 text-xs font-medium mb-1">Transcript:</p>
                      <p className="text-white/90 text-sm">{transcript}</p>
                    </motion.div>
                  )}

                  {/* Commands hint */}
                  <div className="text-white/50 text-xs">
                    Try: "go home", "show memories", "play music"
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile collapsed state - just mic icon */}
          {isMobile && isCollapsed && (
            <div className="p-3">
              <motion.button
                onClick={toggleListening}
                disabled={!isSupported}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-white/10 hover:bg-white/20 text-white/80'
                } disabled:opacity-50`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </Draggable>
  );
};