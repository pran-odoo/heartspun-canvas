import React from 'react';
import '../styles/Galaxy.css';
import { Galaxy } from './Galaxy';

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
      <Galaxy transparent={true} />
      <div className={`relative z-10 py-6 px-4 sm:py-8 sm:px-6 ${className}`}>
        {children}
      </div>
    </>
  );
};