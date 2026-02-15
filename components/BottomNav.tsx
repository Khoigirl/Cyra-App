
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { Tab } from '../types';
import { Home, Utensils, Calendar, BookOpen, User } from 'lucide-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { name: Tab.Today, Icon: Home },
    { name: Tab.Recipes, Icon: Utensils },
    { name: Tab.Track, Icon: Calendar },
    { name: Tab.Learn, Icon: BookOpen },
    { name: Tab.Profile, Icon: User },
  ];

  return (
    <StyledView className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex-row justify-around items-center px-4 pt-3 pb-8">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        const Icon = tab.Icon;
        return (
          <StyledPressable
            key={tab.name}
            onPress={() => onTabChange(tab.name)}
            className="flex flex-col items-center gap-1 min-w-[64px] active:opacity-60"
          >
            <Icon 
              size={24} 
              color={isActive ? '#8FAF9D' : '#6B7280'} 
              strokeWidth={isActive ? 2.5 : 1.5} 
            />
            <StyledText className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'text-[#8FAF9D]' : 'text-[#6B7280]'}`}>
              {tab.name}
            </StyledText>
          </StyledPressable>
        );
      })}
    </StyledView>
  );
};

export default BottomNav;
