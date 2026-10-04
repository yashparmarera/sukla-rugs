import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'terracotta';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-sans uppercase tracking-[0.1em] text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-[var(--shukla-charcoal)]';

  const sizeClasses = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-7 py-3.5 text-xs',
    lg: 'px-10 py-4 text-xs'
  };

  const variantClasses = {
    primary: 'bg-[var(--shukla-charcoal)] text-[var(--shukla-ivory)] hover:bg-[var(--shukla-terracotta)] hover:text-white',
    secondary: 'bg-[var(--shukla-ivory)] text-[var(--shukla-charcoal)] border border-[var(--shukla-charcoal)] hover:bg-[var(--shukla-charcoal)] hover:text-[var(--shukla-ivory)]',
    outline: 'border border-[var(--shukla-muted-border)] text-[var(--shukla-charcoal)] hover:border-[var(--shukla-charcoal)] hover:bg-[var(--shukla-charcoal)] hover:text-[var(--shukla-ivory)]',
    ghost: 'text-[var(--shukla-charcoal)] hover:text-[var(--shukla-terracotta)] hover-underline-animation p-0 bg-transparent',
    terracotta: 'bg-[var(--shukla-terracotta)] text-white hover:bg-[var(--shukla-terracotta-dark)]'
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
