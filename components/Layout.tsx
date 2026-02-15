
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { styled } from 'nativewind';
import { Tab } from '../types';
import BottomNav from './BottomNav';

const StyledView = styled(View);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <StyledView className="flex-1 bg-[#F7F4F1]">
      <StyledView className="flex-1">
        {children}
      </StyledView>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </StyledView>
  );
};

export default Layout;
