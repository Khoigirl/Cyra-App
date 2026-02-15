
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

interface SegmentedControlProps {
  options: string[];
  selectedOption?: string;
  onSelect: (option: string) => void;
  label?: string;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, selectedOption, onSelect, label }) => {
  return (
    <StyledView className="flex flex-col gap-3">
      {label && <StyledText className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest px-1">{label}</StyledText>}
      <StyledView className="flex-row flex-wrap gap-2 p-1.5 bg-white border border-[#E5E7EB] rounded-[18px]">
        {options.map((option) => {
          const isSelected = selectedOption === option;
          return (
            <StyledPressable
              key={option}
              onPress={() => onSelect(option)}
              className={`flex-1 min-w-[60px] py-2.5 rounded-[14px] items-center transition-all ${
                isSelected 
                ? "bg-[#8FAF9D] shadow-sm" 
                : "active:bg-gray-50"
              }`}
            >
              <StyledText className={`text-sm font-bold ${isSelected ? "text-white" : "text-[#6B7280]"}`}>
                {option}
              </StyledText>
            </StyledPressable>
          );
        })}
      </StyledView>
    </StyledView>
  );
};

export default SegmentedControl;
