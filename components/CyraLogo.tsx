
import React from 'react';

const CyraLogo: React.FC<{ size?: number; showText?: boolean }> = ({ size = 24, showText = true }) => {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="#8FAF9D" strokeWidth="1.5" />
        <circle cx="17" cy="7" r="2.5" fill="#8FAF9D" />
      </svg>
      {showText && <span className="text-xl font-semibold tracking-tight text-[#1F2937]">cyra</span>}
    </div>
  );
};

export default CyraLogo;
