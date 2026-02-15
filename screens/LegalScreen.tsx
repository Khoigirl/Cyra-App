
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

export type LegalType = 'privacy' | 'terms' | 'disclaimer';

interface LegalScreenProps {
  type: LegalType;
  onBack: () => void;
}

const LegalScreen: React.FC<LegalScreenProps> = ({ type, onBack }) => {
  const [understood, setUnderstood] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      if (type === 'disclaimer') {
        const saved = await AsyncStorage.getItem('cyra_disclaimer_ack');
        if (saved === 'true') setUnderstood(true);
      }
    };
    hydrate();
  }, [type]);

  const handleAcknowledge = async () => {
    await AsyncStorage.setItem('cyra_disclaimer_ack', 'true');
    setUnderstood(true);
    onBack();
  };

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          summary: 'Last Updated: May 2024. This policy describes how Cyra ("we", "us") handles your sensitive health data.',
          sections: [
            { 
              title: '1. Data Collection & Health Privacy', 
              content: 'Cyra is designed with data minimization as a core principle. We collect information you voluntarily provide: Cycle dates, hormonal symptoms, supplement logs, and meal descriptions. This data is considered sensitive health information. We use industry-standard encryption to protect this data.' 
            },
            { 
              title: '2. Local-First Storage', 
              content: 'By default, your wellness history is stored locally on your device. If you create an account, your data is synced to a secure private cloud solely to provide cross-device access and backup. We do not sell or lease your health data to third-party advertisers.' 
            },
            { 
              title: '3. Data Subject Rights (GDPR/CCPA)', 
              content: 'You have the right to access, export, or delete your data at any time. Using the "Delete Account" feature in your profile permanently erases all records from our servers within 24 hours.' 
            }
          ]
        };
      case 'terms':
        return {
          title: 'Terms of Use (EULA)',
          summary: 'By using Cyra, you agree to these terms and the Standard Apple EULA.',
          sections: [
            { 
              title: '1. Personal Use Only', 
              content: 'Cyra is provided for your personal, non-commercial education and tracking. You agree not to misuse the platform or attempt to scrape content.' 
            },
            { 
              title: '2. Subscriptions', 
              content: 'Payments are handled via the Apple App Store. Subscriptions auto-renew unless cancelled 24 hours before the end of the period.' 
            }
          ]
        };
      case 'disclaimer':
        return {
          title: 'Medical Disclaimer',
          summary: 'Cyra is an educational companion. It is NOT a medical device.',
          sections: [
            { title: 'Not Medical Advice', content: 'The insights and suggestions provided by Cyra are based on wellness patterns and literature. They do not constitute medical advice, diagnosis, or treatment.' },
            { title: 'Not for Emergencies', content: 'If you are experiencing severe pain or a medical emergency, please contact local emergency services immediately.' },
            { title: 'Consult Your Doctor', content: 'Always seek the advice of your physician regarding a medical condition.' }
          ]
        };
    }
  };

  const data = getContent();

  return (
    <Screen hideHeader title={data.title}>
      <StyledView className="pt-4 pb-20">
        <StyledPressable onPress={onBack} className="flex-row items-center mb-8 px-1">
          <StyledText className="text-[#8FAF9D] font-bold text-[10px] uppercase tracking-widest mr-2">← Back</StyledText>
        </StyledPressable>

        <StyledView className="mb-8 px-1">
          <StyledText className="text-2xl font-bold text-[#1F2937] mb-3">{data.title}</StyledText>
          <StyledText className="text-sm text-[#6B7280] leading-relaxed">{data.summary}</StyledText>
        </StyledView>

        <StyledView className="gap-y-4">
          {data.sections.map((section, idx) => (
            <StyledView key={idx} className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
               <StyledText className="text-sm font-bold text-[#1F2937] mb-2">{section.title}</StyledText>
               <StyledText className="text-xs text-[#6B7280] leading-relaxed italic">{section.content}</StyledText>
            </StyledView>
          ))}
        </StyledView>

        {type === 'disclaimer' && (
          <StyledView className="mt-12 px-1 gap-y-4">
             <StyledPressable 
              onPress={() => setUnderstood(!understood)}
              className="flex-row items-center gap-4 p-4 bg-white rounded-2xl border border-[#E5E7EB]"
             >
                <StyledView className={`w-6 h-6 rounded-lg border-2 items-center justify-center transition-colors ${understood ? 'bg-[#8FAF9D] border-[#8FAF9D]' : 'border-gray-200'}`}>
                  {understood && <StyledText className="text-white text-xs font-bold">✓</StyledText>}
                </StyledView>
                <StyledText className="text-xs font-semibold text-[#1F2937]">I understand and acknowledge the above.</StyledText>
             </StyledPressable>
             <Button 
              label="Continue" 
              onPress={handleAcknowledge} 
              className={`w-full ${!understood ? 'opacity-50' : 'opacity-100'}`}
             />
          </StyledView>
        )}
      </StyledView>
    </Screen>
  );
};

export default LegalScreen;
