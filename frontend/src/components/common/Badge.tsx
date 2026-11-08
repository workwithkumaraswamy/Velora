import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'black' | 'ivory' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'sm',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] tracking-widest font-semibold',
    md: 'px-3 py-1 text-xs tracking-wider font-semibold',
  };

  const variantStyles = {
    gold: 'bg-velora-champagne-light text-velora-champagne-dark border border-velora-champagne/40',
    black: 'bg-velora-black text-white border border-velora-black',
    ivory: 'bg-velora-ivory text-velora-charcoal border border-velora-border',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200',
    info: 'bg-sky-50 text-sky-800 border border-sky-200',
  };

  return (
    <span
      className={`inline-flex items-center uppercase ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
