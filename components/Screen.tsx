
import React from 'react';
import { View, ScrollView, Text, Platform } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
  title?: string;
  hideHeader?: boolean;
  hasTabBar?: boolean;
}

const Screen: React.FC<ScreenProps> = ({ 
  children, 
  scrollable = true, 
  className = "", 
  title, 
  hideHeader = false 
}) => {
  const content = (
    <StyledView className={`flex-1 px-5 pb-24 ${className}`}>
      {title && !hideHeader && (
        <StyledView className="pt-6 mb-6">
          <StyledText className="text-3xl font-bold text-[#1F2937] tracking-tight">{title}</StyledText>
        </StyledView>
      )}
      {children}
    </StyledView>
  );

  return (
    <StyledView className="flex-1 bg-[#FBFBF9]">
      {scrollable ? (
        <StyledScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {content}
        </StyledScrollView>
      ) : (
        content
      )}
    </StyledView>
  );
};

export default Screen;
