
import React from 'react';
import { Pressable, Text } from 'react-native';
import { styled } from 'nativewind';
import * as Haptics from 'expo-haptics';

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'tertiary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onPress, variant = 'primary', className = "" }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const variants = {
    primary: "bg-[#8FA899]",
    secondary: "bg-white border border-[#8FA899]",
    ghost: "bg-transparent",
    tertiary: "bg-transparent"
  };

  const textVariants = {
    primary: "text-white",
    secondary: "text-[#8FA899]",
    ghost: "text-[#828282]",
    tertiary: "text-[#8FAF9D]"
  };

  return (
    <StyledPressable 
      onPress={handlePress}
      className={`h-14 rounded-[20px] items-center justify-center active:opacity-70 transition-all ${variants[variant]} ${className}`}
    >
      <StyledText className={`font-bold uppercase tracking-widest text-[11px] ${textVariants[variant]}`}>
        {label}
      </StyledText>
    </StyledPressable>
  );
};

export default Button;
