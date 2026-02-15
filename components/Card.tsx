
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, style }) => {
  return (
    <div 
      onClick={onClick}
      style={style}
      className={`bg-white rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-[#F0EFEA] transition-all active:scale-[0.99] ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
