
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

interface ToggleProps {
  label: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, isEnabled, onToggle }) => {
  return (
    <StyledView className="flex-row items-center justify-between py-3">
      <StyledText className="flex-1 text-sm font-semibold text-[#1F2937] pr-4">{label}</StyledText>
      <StyledPressable
        onPress={() => onToggle(!isEnabled)}
        className={`relative h-6 w-11 items-center rounded-full transition-all ${
          isEnabled ? 'bg-[#8FAF9D]' : 'bg-[#E5E7EB]'
        }`}
      >
        <StyledView
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
            isEnabled ? 'right-1' : 'left-1'
          }`}
        />
      </StyledPressable>
    </StyledView>
  );
};

export default Toggle;
