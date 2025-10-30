
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
    
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: 'p-0',
  };
    
  const baseClasses = 'bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg';
  const combinedClasses = `${baseClasses} ${paddingClasses[padding]} ${className}`;
  
  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default Card;
