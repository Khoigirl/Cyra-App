
import React from 'react';
import { Pressable, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, selected = false, onPress }) => {
  return (
    <StyledPressable 
      onPress={onPress}
      className={`px-4 py-1.5 rounded-full border active:scale-95 transition-all ${
        selected 
        ? "bg-[#8FAF9D] border-[#8FAF9D]" 
        : "bg-white border-[#E5E7EB]"
      }`}
    >
      <StyledText className={`text-xs font-bold ${selected ? "text-white" : "text-[#6B7280]"}`}>
        {label}
      </StyledText>
    </StyledPressable>
  );
};

export default Chip;
