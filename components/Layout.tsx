
import React from 'react';
import { Tab } from '../types';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F7F4F1] relative overflow-hidden border-x border-gray-100 shadow-xl">
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {children}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Layout;
