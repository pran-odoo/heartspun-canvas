import React from 'react';

interface LayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`py-6 px-4 sm:py-8 sm:px-6 ${className}`}>
      {children}
    </div>
  );
};