import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { Settings2, Palette, Volume2, Keyboard, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Settings: React.FC = () => {
  return (
    <PageTransition className="theme-transition gpu-accelerated">
      <div className="min-h-screen relative overflow-x-hidden">
        <div className="fixed inset-0 morphing-bg opacity-20 pointer-events-none will-change-transform" />
        
        <main className="relative z-10 pt-8 pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="text-8xl mb-6">⚙️</div>
              <h1 className="text-4xl md:text-6xl font-romantic font-bold text-romantic mb-6">
                Settings
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Customize your experience with personalized preferences and controls.
              </p>
            </motion.div>

            <motion.div
              className="glass-romantic rounded-3xl p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: <Palette className="w-6 h-6" />, title: "Theme Settings", desc: "Customize colors and appearance" },
                  { icon: <Volume2 className="w-6 h-6" />, title: "Audio Settings", desc: "Voice feedback and sound controls" },
                  { icon: <Keyboard className="w-6 h-6" />, title: "Keyboard Shortcuts", desc: "Customize navigation hotkeys" },
                  { icon: <Smartphone className="w-6 h-6" />, title: "Mobile Settings", desc: "Touch and gesture preferences" }
                ].map((setting, index) => (
                  <motion.div
                    key={setting.title}
                    className="glass rounded-xl p-6 hover-lift transition-smooth"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-romantic mb-4">{setting.icon}</div>
                    <h3 className="text-lg font-semibold text-romantic mb-2">{setting.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{setting.desc}</p>
                    <Button variant="outline" size="sm" className="glass hover-lift btn-smooth">
                      Configure
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Settings;