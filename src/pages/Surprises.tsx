import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { Gift, Sparkles, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Surprises: React.FC = () => {
  return (
    <PageTransition className="theme-transition gpu-accelerated">
      <div className="min-h-screen relative overflow-x-hidden">
        <div className="fixed inset-0 morphing-bg opacity-20 pointer-events-none will-change-transform" />
        
        <main className="relative z-10 pt-8 pb-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="text-8xl mb-6">🎁</div>
              <h1 className="text-4xl md:text-6xl font-romantic font-bold text-primary mb-6">
                Surprise Generator
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Weather-aware, time-sensitive surprises just for you. Love notes that appear at perfect moments.
              </p>
            </motion.div>

            <motion.div
              className="glass rounded-3xl p-12 text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: <Sparkles className="w-8 h-8" />, title: "Daily Surprises", desc: "Something special every day" },
                  { icon: <Heart className="w-8 h-8" />, title: "Love Notes", desc: "Personalized messages of love" },
                  { icon: <Zap className="w-8 h-8" />, title: "Smart Timing", desc: "Perfect moments, every time" }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="glass-romantic rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="text-primary mb-4">{item.icon}</div>
                    <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="glass rounded-2xl p-6">
                <p className="text-sm text-primary">✨ AI-powered surprises loading...</p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Surprises;