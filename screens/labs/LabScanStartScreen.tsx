
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { styled } from 'nativewind';
import * as Haptics from 'expo-haptics';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { extractTextFromImage } from '../../labs/ocrService';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

interface LabScanStartScreenProps {
  onBack: () => void;
  onTextExtracted: (text: string) => void;
}

const LabScanStartScreen: React.FC<LabScanStartScreenProps> = ({ onBack, onTextExtracted }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.8 });
      setIsCameraActive(false);
      setIsProcessing(true);
      
      try {
        const text = await extractTextFromImage(photo.base64 || "");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onTextExtracted(text);
      } catch (e) {
        alert("Failed to read report. Please try a clearer photo.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (isCameraActive) {
    return (
      <StyledView className="flex-1 bg-black">
        <Camera ref={cameraRef} style={StyleSheet.absoluteFill} ratio="16:9" />
        
        {/* Overlay */}
        <StyledView className="flex-1 justify-center items-center">
          <StyledView className="w-64 h-80 border-2 border-white/50 rounded-3xl" />
          <StyledText className="text-white font-bold text-xs uppercase tracking-widest mt-6">Align report in frame</StyledText>
        </StyledView>

        <StyledView className="h-40 bg-black/60 items-center justify-around flex-row px-10 pb-10">
          <StyledPressable onPress={() => setIsCameraActive(false)} className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
             <StyledText className="text-white text-xl">✕</StyledText>
          </StyledPressable>
          
          <StyledPressable onPress={takePicture} className="w-20 h-20 rounded-full border-4 border-white items-center justify-center p-1">
             <StyledView className="w-full h-full rounded-full bg-white active:opacity-50" />
          </StyledPressable>
          
          <View className="w-12 h-12" />
        </StyledView>
      </StyledView>
    );
  }

  return (
    <Screen hideHeader={true}>
      <StyledView className="pt-10 flex-1">
        <StyledPressable onPress={onBack} className="flex-row items-center mb-10">
          <StyledText className="text-[#8FAF9D] font-bold text-xs">← CANCEL</StyledText>
        </StyledPressable>

        <StyledView className="items-center text-center mb-12">
          <StyledView className="w-24 h-24 bg-[#8FAF9D]/10 rounded-full items-center justify-center mb-4">
            <StyledText className="text-4xl">📄</StyledText>
          </StyledView>
          <StyledText className="text-3xl font-bold text-[#1F2937]">Lab Digitizer</StyledText>
          <StyledText className="text-sm text-[#6B7280] text-center mt-2 px-6">
            Cyra uses AI to extract medical markers from your paper reports to build your historical trend.
          </StyledText>
        </StyledView>

        <StyledView className="flex-1 gap-4">
          <Card onPress={() => setIsCameraActive(true)} className="items-center py-10 border-dashed border-[#8FAF9D]">
            <StyledText className="text-2xl mb-2">📸</StyledText>
            <StyledText className="font-bold text-[#1F2937]">Use Camera</StyledText>
          </Card>
          
          <Card className="items-center py-10 border-dashed border-[#E5E7EB]">
            <StyledText className="text-2xl mb-2">🖼️</StyledText>
            <StyledText className="font-bold text-[#1F2937]">Upload File</StyledText>
          </Card>
        </StyledView>

        {isProcessing && (
          <StyledView className="absolute inset-0 bg-white/95 items-center justify-center z-50">
            <StyledView className="w-12 h-12 border-4 border-t-[#8FAF9D] border-gray-100 rounded-full animate-spin mb-4" />
            <StyledText className="font-bold text-[#1F2937]">AI Scanning...</StyledText>
          </StyledView>
        )}
      </StyledView>
    </Screen>
  );
};

export default LabScanStartScreen;
