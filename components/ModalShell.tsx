
import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { styled } from 'nativewind';
import { X } from 'lucide-react-native';
import Button from './Button';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}

const ModalShell: React.FC<ModalShellProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <StyledPressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <StyledView 
          className="w-full bg-white rounded-t-[28px] p-8 pb-12 shadow-2xl"
          onPress={(e: any) => e.stopPropagation()}
        >
          <StyledView className="w-12 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mb-8" />
          <StyledView className="flex-row justify-between items-center mb-6">
            <StyledText className="text-xl font-bold text-[#1F2937]">{title}</StyledText>
            <StyledPressable 
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-[#F7F4F1] items-center justify-center"
            >
              <X size={18} color="#6B7280" />
            </StyledPressable>
          </StyledView>
          <StyledView className="min-h-[200px] items-center justify-center text-center space-y-4">
            <StyledView className="w-16 h-16 rounded-full bg-[#F7F4F1] items-center justify-center mb-4">
              <StyledText className="text-3xl">🏗️</StyledText>
            </StyledView>
            <StyledText className="text-[#1F2937] font-bold text-center">Under Construction</StyledText>
            <StyledText className="text-sm text-[#6B7280] text-center mb-4">The logging feature for {title.toLowerCase()} is coming soon.</StyledText>
            {children}
          </StyledView>
          <Button label="Close" onPress={onClose} className="w-full mt-8" />
        </StyledView>
      </StyledPressable>
    </Modal>
  );
};

export default ModalShell;
