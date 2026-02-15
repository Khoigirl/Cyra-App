
import React from 'react';
import { View, Pressable } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  onClick?: () => void;
  style?: any;
}

const Card: React.FC<CardProps> = ({ children, className = "", onPress, onClick, style }) => {
  const finalOnPress = onPress || onClick;
  const Container = finalOnPress ? StyledPressable : StyledView;
  
  return (
    <Container 
      onPress={finalOnPress}
      className={`bg-white rounded-[32px] p-6 border border-[#F0EFEA] ${className}`}
      style={[{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 20,
        elevation: 2,
      }, style]}
    >
      {children}
    </Container>
  );
};

export default Card;
