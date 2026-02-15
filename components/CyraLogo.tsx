
import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

const CyraLogo: React.FC<{ size?: number; showText?: boolean }> = ({ size = 24, showText = true }) => {
  return (
    <StyledView className="flex-row items-center">
      <StyledView 
        style={{ width: size, height: size }} 
        className="rounded-full border-2 border-[#8FAF9D] items-center justify-center"
      >
        <StyledView className="w-1.5 h-1.5 rounded-full bg-[#8FAF9D] absolute top-0.5 right-0.5" />
        <StyledText style={{ fontSize: size * 0.6 }} className="text-[#8FAF9D] font-bold">c</StyledText>
      </StyledView>
      {showText && (
        <StyledText className="text-2xl font-bold tracking-tighter text-[#1F2937] ml-2">cyra</StyledText>
      )}
    </StyledView>
  );
};

export default CyraLogo;
