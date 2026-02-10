import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'category';
  fullWidth?: boolean;
  colorClass?: string; // For dynamic category colors
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  colorClass,
  ...props 
}) => {
  const baseStyles = "font-bold rounded-lg transition-transform active:scale-95 touch-manipulation select-none flex items-center justify-center";
  
  let variantStyles = "";
  switch (variant) {
    case 'primary':
      variantStyles = "bg-white text-black hover:bg-gray-200 shadow-[0_4px_0_rgb(100,100,100)] active:shadow-none active:translate-y-1";
      break;
    case 'secondary':
      variantStyles = "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700";
      break;
    case 'danger':
      variantStyles = "bg-red-600 text-white shadow-[0_4px_0_rgb(150,0,0)] active:shadow-none active:translate-y-1";
      break;
    case 'ghost':
      variantStyles = "bg-transparent text-gray-400 hover:text-white";
      break;
    case 'category':
      // Dynamic background, white text, tactile shadow
      variantStyles = `${colorClass || 'bg-blue-600'} text-white shadow-lg border-b-4 border-black/30 h-16 text-lg tracking-wide`;
      break;
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${fullWidth ? 'w-full' : ''} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
