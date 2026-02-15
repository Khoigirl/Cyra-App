
import React, { useMemo } from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import Screen from '../components/Screen';
import Card from '../components/Card';
import { useLearn } from '../context/LearnContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useWellness } from '../context/WellnessContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledImage = styled(Image);

const Profile: React.FC<any> = ({ onOpenPaywall, onOpenLegal }) => {
  const { savedItemIds, readItemIds } = useLearn();
  const { isSubscribed, restorePurchases } = useSubscription();
  const { logs } = useWellness();

  return (
    <Screen title="Profile">
      <StyledView className="pt-6 pb-32 gap-y-10">
        
        <StyledView className="items-center">
          <StyledView className="relative">
            <StyledView className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-[#F4F4F1] items-center justify-center">
              <StyledText className="text-4xl">👤</StyledText>
            </StyledView>
            <StyledView className={`absolute bottom-0 right-0 px-3 py-1 rounded-full border-2 border-white shadow-sm bg-gray-400`}>
              <StyledText className="text-[8px] font-extrabold text-white uppercase tracking-widest">
                {isSubscribed ? 'Premium' : 'Basic'}
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledText className="text-2xl font-bold text-[#1F2937] mt-4">Emma Jensen</StyledText>
          <StyledText className="text-[#6B7280] text-sm font-medium">Cyra Member since 2024</StyledText>
        </StyledView>

        <StyledView>
          <StyledText className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.2em] mb-4 px-1">Health Data</StyledText>
          <StyledView className="gap-y-2">
            <ProfileRow icon="🧪" label="Lab Records" onPress={() => !isSubscribed && onOpenPaywall?.('labs')} badge={!isSubscribed ? "Premium" : ""} />
            <ProfileRow icon="🛡️" label="Privacy Policy" onPress={() => onOpenLegal?.('privacy')} />
            <ProfileRow icon="🔄" label="Restore Purchases" onPress={restorePurchases} />
          </StyledView>
        </StyledView>

        <StyledPressable className="mt-6 border border-red-100 rounded-2xl py-4 items-center active:bg-red-50">
           <StyledText className="text-[11px] font-bold text-red-400 uppercase tracking-widest">Sign Out</StyledText>
        </StyledPressable>

        <StyledText className="text-[9px] text-gray-300 text-center font-bold uppercase mt-4">
          Cyra Version 1.2.0 (104)
        </StyledText>
      </StyledView>
    </Screen>
  );
};

const ProfileRow = ({ icon, label, onPress, badge }: any) => (
  <StyledPressable 
    onPress={onPress}
    className="flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm active:opacity-60"
  >
    <StyledView className="flex-row items-center gap-3">
      <StyledText className="text-lg">{icon}</StyledText>
      <StyledText className="font-bold text-sm text-[#1F2937]">{label}</StyledText>
      {badge && (
        <StyledView className="bg-[#8FAF9D]/10 px-2 py-0.5 rounded-full">
          <StyledText className="text-[8px] font-bold text-[#8FAF9D] uppercase">{badge}</StyledText>
        </StyledView>
      )}
    </StyledView>
    <StyledText className="text-gray-200 font-bold">›</StyledText>
  </StyledPressable>
);

export default Profile;
