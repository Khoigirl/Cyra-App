
import React from 'react';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onPress, variant = 'primary', className = '' }) => {
  const baseStyles = "h-[54px] px-8 rounded-[20px] font-medium tracking-wide transition-all active:scale-[0.97] flex items-center justify-center text-sm";
  const variants = {
    primary: "bg-[#8FA899] text-white shadow-sm",
    secondary: "bg-transparent border border-[#8FA899] text-[#8FA899]",
    tertiary: "bg-transparent text-[#828282] underline underline-offset-4 decoration-[#D1D1D1]",
  };

  return (
    <button onClick={onPress} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {label}
    </button>
  );
};

export default Button;
