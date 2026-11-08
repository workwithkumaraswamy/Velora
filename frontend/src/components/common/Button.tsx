import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'champagne' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 tracking-wider uppercase text-xs disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[11px] rounded-none',
    md: 'px-5 py-2.5 text-xs rounded-none',
    lg: 'px-7 py-3.5 text-sm rounded-none',
  };

  const variantStyles = {
    primary: 'bg-velora-black text-white hover:bg-neutral-800 active:bg-black border border-velora-black',
    secondary: 'bg-velora-beige text-velora-black hover:bg-velora-sand border border-velora-border',
    outline: 'bg-transparent text-velora-black border border-velora-black hover:bg-velora-black hover:text-white',
    champagne: 'bg-velora-champagne text-white hover:bg-velora-champagne-dark active:bg-velora-champagne-dark border border-velora-champagne',
    ghost: 'bg-transparent text-velora-black hover:bg-neutral-100 border border-transparent',
    danger: 'bg-rose-700 text-white hover:bg-rose-800 border border-rose-700',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
