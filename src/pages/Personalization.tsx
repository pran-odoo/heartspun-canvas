import React from 'react';
import { PageTransition } from '@/components/PageTransition';
import { PersonalizationEngine } from '@/components/PersonalizationEngine';
import { useNavigation } from '@/contexts/NavigationContext';

const Personalization: React.FC = () => {
  const { state } = useNavigation();

  const handlePreferenceUpdate = (preferences: any) => {
    console.log('Updated user preferences:', preferences);
  };

  return (
    <PageTransition className="theme-transition gpu-accelerated">
      <div className="min-h-screen relative overflow-x-hidden">
        <div className="fixed inset-0 morphing-bg opacity-20 pointer-events-none will-change-transform" />
        
        <main className="relative z-10 pt-8 pb-20">
          <PersonalizationEngine
            theme={state.theme}
            onPreferenceUpdate={handlePreferenceUpdate}
          />
        </main>
      </div>
    </PageTransition>
  );
};

export default Personalization;