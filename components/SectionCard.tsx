
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { Plus } from 'lucide-react-native';
import Card from './Card';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

interface SectionCardProps {
  title: string;
  icon: string;
  onAdd: () => void;
  children: React.ReactNode;
  emptyStateText: string;
  isEmpty?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ 
  title, 
  icon, 
  onAdd, 
  children, 
  emptyStateText, 
  isEmpty = false 
}) => {
  return (
    <Card className="mb-4 p-5">
      <StyledView className="flex-row justify-between items-center mb-4">
        <StyledView className="flex-row items-center gap-2">
          <StyledText className="text-xl">{icon}</StyledText>
          <StyledText className="text-sm font-bold text-[#1F2937] uppercase tracking-widest">{title}</StyledText>
        </StyledView>
        <StyledPressable 
          onPress={onAdd}
          className="w-8 h-8 rounded-full bg-[#8FAF9D]/10 items-center justify-center active:scale-90 transition-transform"
        >
          <Plus size={18} color="#8FAF9D" strokeWidth={3} />
        </StyledPressable>
      </StyledView>

      {isEmpty ? (
        <StyledView className="py-4 items-center justify-center">
          <StyledView className="w-12 h-12 rounded-full bg-[#F7F4F1] items-center justify-center mb-2 opacity-50">
            <StyledText className="text-xl">⚪</StyledText>
          </StyledView>
          <StyledText className="text-xs text-[#6B7280] font-medium italic text-center px-4">{emptyStateText}</StyledText>
        </StyledView>
      ) : (
        <StyledView>
          {children}
        </StyledView>
      )}
    </Card>
  );
};

export default SectionCard;
