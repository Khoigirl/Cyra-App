
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { styled } from 'nativewind';
import { ChevronDown } from 'lucide-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledScrollView = styled(ScrollView);

interface DropdownProps {
  label?: string;
  options: string[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onSelect, placeholder = "Select option" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledView className="flex flex-col gap-2 relative">
      {label && <StyledText className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">{label}</StyledText>}
      <StyledPressable
        onPress={() => setIsOpen(true)}
        className="w-full flex-row items-center justify-between bg-white border border-[#E5E7EB] rounded-[14px] px-5 py-3.5 active:bg-gray-50"
      >
        <StyledText className={`text-sm font-semibold ${value ? "text-[#1F2937]" : "text-[#6B7280]"}`}>
          {value || placeholder}
        </StyledText>
        <ChevronDown size={20} color="#8FAF9D" style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }} />
      </StyledPressable>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <StyledPressable className="flex-1 bg-black/40 justify-center p-6" onPress={() => setIsOpen(false)}>
          <StyledView className="bg-white rounded-[24px] max-h-80 overflow-hidden shadow-2xl" onPress={(e: any) => e.stopPropagation()}>
            <StyledScrollView>
              {options.map((option) => (
                <StyledPressable
                  key={option}
                  onPress={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  className={`w-full px-6 py-4 border-b border-gray-50 active:bg-gray-50 ${
                    value === option ? "bg-[#F7F4F1]" : ""
                  }`}
                >
                  <StyledText className={`text-sm font-bold ${value === option ? "text-[#8FAF9D]" : "text-[#1F2937]"}`}>
                    {option}
                  </StyledText>
                </StyledPressable>
              ))}
            </StyledScrollView>
          </StyledView>
        </StyledPressable>
      </Modal>
    </StyledView>
  );
};

export default Dropdown;
