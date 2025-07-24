import React from 'react';
import { PageTransition } from '@/components/PageTransition';
import { MemoryTimeline } from '@/components/MemoryTimeline';
import { useNavigation } from '@/contexts/NavigationContext';

const Timeline: React.FC = () => {
  const { state } = useNavigation();

  return (
    <PageTransition className="theme-transition gpu-accelerated">
      <div className="min-h-screen relative overflow-x-hidden">
        <div className="fixed inset-0 morphing-bg opacity-20 pointer-events-none will-change-transform" />
        
        <main className="relative z-10 pt-8 pb-20">
          <MemoryTimeline theme={state.theme} />
        </main>
      </div>
    </PageTransition>
  );
};

export default Timeline;