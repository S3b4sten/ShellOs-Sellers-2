import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`
      relative overflow-hidden
      bg-white 
      border border-slate-200
      shadow-sm
      rounded-lg
      ${noPadding ? '' : 'p-5'}
      ${className}
    `}>
      {children}
    </div>
  );
};