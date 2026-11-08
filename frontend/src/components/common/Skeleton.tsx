import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-velora-beige/80 rounded-none ${className}`}
    />
  );
};
