import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'terracotta';
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
  const baseClasses = 'inline-flex items-center justify-center font-sans uppercase tracking-[0.1em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-[var(--sukla-charcoal)]';

  const sizeClasses = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-7 py-3.5 text-xs',
    lg: 'px-10 py-4 text-xs',
    xl: 'px-10 py-5 text-sm'
  };

  const variantClasses = {
    primary: 'bg-[var(--sukla-charcoal)] text-[var(--sukla-ivory)] hover:bg-[var(--sukla-terracotta)] hover:text-white',
    secondary: 'bg-[var(--sukla-ivory)] text-[var(--sukla-charcoal)] border border-[var(--sukla-charcoal)] hover:bg-[var(--sukla-charcoal)] hover:text-[var(--sukla-ivory)]',
    outline: 'border border-[var(--sukla-muted-border)] text-[var(--sukla-charcoal)] hover:border-[var(--sukla-charcoal)] hover:bg-[var(--sukla-charcoal)] hover:text-[var(--sukla-ivory)]',
    ghost: 'text-[var(--sukla-charcoal)] hover:text-[var(--sukla-terracotta)] hover-underline-animation p-0 bg-transparent',
    terracotta: 'bg-[var(--sukla-terracotta)] text-white hover:bg-[var(--sukla-terracotta-dark)]'
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
