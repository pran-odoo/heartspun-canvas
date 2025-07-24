import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { useNavigation } from '@/contexts/NavigationContext';
import { Camera, Upload, Heart, Download, Share, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Memories: React.FC = () => {
  const { state } = useNavigation();

  return (
    <PageTransition className="theme-transition gpu-accelerated">
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 morphing-bg opacity-20 pointer-events-none will-change-transform" />
        
        <main className="relative z-10 pt-8 pb-20">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="text-8xl mb-6">📸</div>
              <h1 className="text-4xl md:text-6xl font-romantic font-bold text-romantic mb-6">
                Photo Gallery
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Our beautiful memories captured in time. Upload and organize photos with AI-powered recognition.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="glass-romantic hover-lift btn-smooth">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Photos
                </Button>
                <Button variant="outline" className="glass hover-lift btn-smooth">
                  <Camera className="w-5 h-5 mr-2" />
                  Take Photo
                </Button>
                <Button variant="outline" className="glass hover-lift btn-smooth">
                  <Grid className="w-5 h-5 mr-2" />
                  Gallery View
                </Button>
              </div>
            </motion.div>

            {/* Coming Soon Content */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {/* Feature Cards */}
              {[
                {
                  icon: <Upload className="w-8 h-8" />,
                  title: "Drag & Drop Upload",
                  description: "Simply drag photos to upload instantly with smart organization",
                  color: "glass-romantic"
                },
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: "AI Recognition", 
                  description: "Automatically tag and categorize your precious moments",
                  color: "glass-gold"
                },
                {
                  icon: <Share className="w-8 h-8" />,
                  title: "Share Memories",
                  description: "Create beautiful albums and share with loved ones",
                  color: "glass"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className={`${feature.color} rounded-2xl p-8 text-center hover-lift transition-smooth`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-romantic mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-romantic mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Photo Grid Placeholder */}
            <motion.div
              className="glass-romantic rounded-3xl p-12 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="aspect-square glass rounded-xl flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <h3 className="text-2xl font-romantic font-bold text-romantic mb-4">
                  Your Memory Collection
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start building your digital memory book. Upload your first photos to see the magic happen!
                </p>
                <Button size="lg" className="glass-gold hover-lift btn-smooth">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Your First Memory
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Memories;