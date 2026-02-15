
import React from 'react';
import CyraLogo from './CyraLogo';

interface ScreenProps {
  children: React.ReactNode;
  title?: string;
  scrollable?: boolean;
  hideHeader?: boolean;
  hideLogo?: boolean;
  hasTabBar?: boolean;
}

const Screen: React.FC<ScreenProps> = ({ 
  children, 
  title, 
  scrollable = true, 
  hideHeader = false,
  hideLogo = false,
  hasTabBar = false 
}) => {
  return (
    <div className={`flex flex-col h-full bg-[#FBFBF9] ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'} hide-scrollbar`}>
      <div style={{ paddingTop: 'var(--sat)' }} />
      
      {!hideHeader && (
        <header className="px-8 py-5 bg-[#FBFBF9]/80 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center border-b border-[#F0EFEA]/50">
          {!hideLogo ? <CyraLogo size={20} /> : <div className="w-5" />}
          {title && <h1 className="text-[10px] font-bold text-[#3A3A3A] uppercase tracking-[0.25em]">{title}</h1>}
          <div className="w-5" />
        </header>
      )}
      
      <div className={`flex-1 flex flex-col px-8 ${hasTabBar ? 'pb-32' : 'pb-12'}`}>
        {children}
      </div>

      {!hasTabBar && <div style={{ height: 'var(--sab)' }} />}
    </div>
  );
};

export default Screen;
