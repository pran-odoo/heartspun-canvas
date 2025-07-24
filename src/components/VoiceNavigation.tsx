import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, CheckCircle, XCircle, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface VoiceNavigationProps {
  onNavigate: (section: string) => void;
  onCommand?: (command: string) => void;
  onChatOpen?: () => void;
}

const voiceCommands = {
  'go home': 'hero',
  'show memories': 'memories', 
  'play music': 'music',
  'open chat': 'chat',
  'show chat': 'chat',
  'start chat': 'chat',
  'talk to ai': 'chat',
  'view gallery': 'memories',
  'surprise me': 'surprises',
  'show timeline': 'timeline',
  'personalization': 'personalization',
  'theme morning': 'theme-morning',
  'theme evening': 'theme-evening', 
  'theme night': 'theme-night',
  'help': 'help',
  'voice help': 'help',
  'what can you do': 'help',
};

const commandDescriptions = {
  'Navigation': ['go home', 'show memories', 'play music', 'view gallery', 'surprise me', 'show timeline'],
  'Chat': ['open chat', 'show chat', 'talk to ai'],
  'Themes': ['theme morning', 'theme evening', 'theme night'],
  'Help': ['help', 'voice help', 'what can you do'],
};

export const VoiceNavigation: React.FC<VoiceNavigationProps> = ({
  onNavigate,
  onCommand,
  onChatOpen,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandStatus, setCommandStatus] = useState<'idle' | 'success' | 'error' | 'processing'>('idle');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [confidence, setConfidence] = useState(0);

  // Initialize speech recognition
  useEffect(() => {
    try {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        recognitionInstance.maxAlternatives = 3;

        recognitionInstance.onstart = () => {
          setIsListening(true);
          setCommandStatus('idle');
          setTranscript('');
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onresult = (event: any) => {
          try {
            let finalTranscript = '';
            let interimTranscript = '';
            let maxConfidence = 0;
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const result = event.results[i];
              if (result.isFinal) {
                finalTranscript += result[0].transcript;
                maxConfidence = Math.max(maxConfidence, result[0].confidence || 0);
              } else {
                interimTranscript += result[0].transcript;
              }
            }

            // Show interim results
            if (interimTranscript) {
              setTranscript(interimTranscript.toLowerCase().trim());
            }

            if (finalTranscript) {
              const cleanTranscript = finalTranscript.toLowerCase().trim();
              setTranscript(cleanTranscript);
              setConfidence(maxConfidence);
              setCommandStatus('processing');
              
              setTimeout(() => {
                processVoiceCommand(cleanTranscript);
              }, 500);
            }
          } catch (error) {
            console.warn('Voice processing error:', error);
            setCommandStatus('error');
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setCommandStatus('error');
          
          // Provide user feedback for specific errors
          if (event.error === 'not-allowed') {
            setLastCommand('Microphone access denied. Please enable microphone permissions.');
          } else if (event.error === 'no-speech') {
            setLastCommand('No speech detected. Please try speaking again.');
          } else if (event.error === 'network') {
            setLastCommand('Network error. Please check your connection.');
          } else {
            setLastCommand('Voice recognition error. Please try again.');
          }
          
          setTimeout(() => {
            setCommandStatus('idle');
            setLastCommand('');
          }, 3000);
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
    setLastCommand(command);
    let commandExecuted = false;

    // Check for exact matches first
    if (voiceCommands[command as keyof typeof voiceCommands]) {
      const action = voiceCommands[command as keyof typeof voiceCommands];
      
      if (action === 'chat') {
        onChatOpen?.();
        commandExecuted = true;
      } else if (action.startsWith('theme-')) {
        onCommand?.(action);
        commandExecuted = true;
      } else if (action === 'help') {
        setShowHelp(true);
        commandExecuted = true;
      } else {
        onNavigate(action);
        commandExecuted = true;
      }
    } else {
      // Check for partial matches
      for (const [voiceCommand, action] of Object.entries(voiceCommands)) {
        if (command.includes(voiceCommand)) {
          if (action === 'chat') {
            onChatOpen?.();
            commandExecuted = true;
          } else if (action.startsWith('theme-')) {
            onCommand?.(action);
            commandExecuted = true;
          } else if (action === 'help') {
            setShowHelp(true);
            commandExecuted = true;
          } else {
            onNavigate(action);
            commandExecuted = true;
          }
          break;
        }
      }
    }

    // Special romantic commands
    if (!commandExecuted) {
      if (command.includes('i love you')) {
        onCommand?.('love-response');
        commandExecuted = true;
      } else if (command.includes('you are beautiful')) {
        onCommand?.('compliment-response');
        commandExecuted = true;
      } else if (command.includes('tell me something nice')) {
        onCommand?.('nice-message');
        commandExecuted = true;
      }
    }

    // Set command status
    if (commandExecuted) {
      setCommandStatus('success');
      if (audioEnabled) {
        playSuccessSound();
      }
    } else {
      setCommandStatus('error');
      if (audioEnabled) {
        playErrorSound();
      }
    }

    // Reset status after delay
    setTimeout(() => {
      setCommandStatus('idle');
      if (!showHelp) {
        setLastCommand('');
      }
         }, 3000);
   }, [onNavigate, onCommand, onChatOpen, audioEnabled, showHelp]);

  const playSuccessSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('Audio feedback not available');
    }
  }, []);

  const playErrorSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Audio feedback not available');
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      setTranscript('');
      setCommandStatus('idle');
      recognition.start();
    }
  }, [recognition, isListening]);

  const getStatusColor = () => {
    switch (commandStatus) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'processing': return 'text-yellow-400';
      default: return isListening ? 'text-red-400' : 'text-romantic';
    }
  };

  const getStatusIcon = () => {
    switch (commandStatus) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'processing': return <motion.div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />;
      default: return isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />;
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="fixed top-6 left-6 z-40">
      <motion.div
        className="glass-romantic rounded-2xl p-4 min-w-64 will-change-transform"
        initial={{ opacity: 0, scale: 0.9, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.5, type: "spring", damping: 20 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-romantic text-sm font-semibold text-romantic">
            Voice Commands
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="text-romantic hover:bg-romantic/20 rounded-full"
              title={audioEnabled ? 'Disable Audio Feedback' : 'Enable Audio Feedback'}
            >
              {audioEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="text-romantic hover:bg-romantic/20 rounded-full"
              title="Show Help"
            >
              <HelpCircle className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleListening}
              className={`rounded-full transition-all btn-smooth ${
                isListening 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : commandStatus === 'success'
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : commandStatus === 'error'
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-romantic/20 text-romantic hover:bg-romantic/30'
              }`}
            >
              <motion.div
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
              >
                {getStatusIcon()}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Status Display */}
        <div className="mb-3">
          <motion.div
            className={`text-xs px-3 py-2 rounded-full text-center transition-all ${
              isListening 
                ? 'bg-red-500/20 text-red-400' 
                : commandStatus === 'success'
                ? 'bg-green-500/20 text-green-400'
                : commandStatus === 'error'
                ? 'bg-red-500/20 text-red-400'
                : commandStatus === 'processing'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-muted text-muted-foreground'
            }`}
            animate={
              isListening 
                ? { scale: [1, 1.02, 1] } 
                : commandStatus === 'processing'
                ? { opacity: [0.7, 1, 0.7] }
                : {}
            }
            transition={{ 
              duration: commandStatus === 'processing' ? 1 : 0.5, 
              repeat: (isListening || commandStatus === 'processing') ? Infinity : 0 
            }}
          >
            {commandStatus === 'processing' ? 'Processing...' :
             commandStatus === 'success' ? 'Command executed!' :
             commandStatus === 'error' ? 'Command not recognized' :
             isListening ? 'Listening...' : 'Click mic to start'}
          </motion.div>
        </div>

        {/* Transcript Display */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              className="mb-3 p-3 glass rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-romantic flex-1">
                  "{transcript}"
                </p>
                {confidence > 0 && (
                  <div className="ml-2 text-xs text-muted-foreground">
                    {Math.round(confidence * 100)}%
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Last Command Feedback */}
        <AnimatePresence>
          {lastCommand && !transcript && (
            <motion.div
              className={`mb-3 p-2 rounded-lg text-xs ${
                commandStatus === 'success' ? 'bg-green-500/10 text-green-400' :
                commandStatus === 'error' ? 'bg-red-500/10 text-red-400' :
                'bg-muted/50 text-muted-foreground'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Last: "{lastCommand}"
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Panel */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              className="mb-3 p-3 glass rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4 className="text-xs font-semibold text-romantic mb-2">Available Commands:</h4>
              <div className="space-y-2 text-xs">
                {Object.entries(commandDescriptions).map(([category, commands]) => (
                  <div key={category}>
                    <p className="font-medium text-romantic/80">{category}:</p>
                    <div className="grid grid-cols-1 gap-1 ml-2">
                      {commands.map((cmd) => (
                        <span key={cmd} className="text-muted-foreground">"{cmd}"</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Commands */}
        {!showHelp && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Try saying:</p>
            <div className="grid grid-cols-2 gap-1">
              <button 
                onClick={() => processVoiceCommand('go home')}
                className="text-left hover:text-romantic transition-colors"
              >
                "Go home"
              </button>
              <button 
                onClick={() => processVoiceCommand('show memories')}
                className="text-left hover:text-romantic transition-colors"
              >
                "Show memories"
              </button>
              <button 
                onClick={() => processVoiceCommand('open chat')}
                className="text-left hover:text-romantic transition-colors"
              >
                "Open chat"
              </button>
              <button 
                onClick={() => processVoiceCommand('surprise me')}
                className="text-left hover:text-romantic transition-colors"
              >
                "Surprise me"
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Listening Animation */}
        <AnimatePresence>
          {isListening && (
            <motion.div 
              className="flex justify-center mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex space-x-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-romantic rounded-full"
                    animate={{
                      height: [4, 16, 4],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};