import React from 'react';
import 'Backgrounds/Galaxy.css';

interface LayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <>
      <div className="galaxy-bg fixed inset-0 pointer-events-none -z-10" />
      <div className={`relative z-10 py-6 px-4 sm:py-8 sm:px-6 ${className}`}>
        {children}
      </div>
    </>
  );
};