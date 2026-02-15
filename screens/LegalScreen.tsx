
import React, { useEffect, useState } from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import CollapsibleSection from '../components/CollapsibleSection';

export type LegalType = 'privacy' | 'terms' | 'disclaimer';

interface LegalScreenProps {
  type: LegalType;
  onBack: () => void;
}

const LegalScreen: React.FC<LegalScreenProps> = ({ type, onBack }) => {
  const [understood, setUnderstood] = useState(false);

  useEffect(() => {
    if (type === 'disclaimer') {
      const saved = localStorage.getItem('cyra_disclaimer_ack');
      if (saved === 'true') setUnderstood(true);
    }
  }, [type]);

  const handleAcknowledge = () => {
    localStorage.setItem('cyra_disclaimer_ack', 'true');
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
              content: 'By default, your wellness history is stored locally on your device. If you create an account, your data is synced to a secure private cloud (AWS/Google Cloud) solely to provide cross-device access and backup. We do not sell or lease your health data to third-party advertisers or data brokers.' 
            },
            { 
              title: '3. Data Subject Rights (GDPR/CCPA)', 
              content: 'You have the right to access, export, or delete your data at any time. Using the "Delete Account" feature in your profile permanently erases all records from our servers within 24 hours. We do not use your health data for automated insurance or employment decisions.' 
            },
            { 
              title: '4. Third-Party Services', 
              content: 'We use anonymized identifiers for crash reporting and AI-powered educational summaries. No identifiable health data is shared with these services beyond what is necessary to perform the requested function (e.g., summarizing a lab result).' 
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
              content: 'Payments are handled via the Apple App Store. Subscriptions auto-renew unless cancelled 24 hours before the end of the period. Refunds are subject to Apple’s refund policies.' 
            },
            { 
              title: '3. Content Accuracy', 
              content: 'While we strive for scientific accuracy, wellness trends evolve. Cyra does not guarantee specific health outcomes or medical cures.' 
            }
          ]
        };
      case 'disclaimer':
        return {
          title: 'Medical Disclaimer',
          summary: 'Cyra is an educational companion. It is NOT a medical device.',
          sections: [
            { title: 'Not Medical Advice', content: 'The insights and suggestions provided by Cyra are based on wellness patterns and literature. They do not constitute medical advice, diagnosis, or treatment.' },
            { title: 'Not for Emergencies', content: 'If you are experiencing severe pain, unusual bleeding, or a medical emergency, please contact your local emergency services immediately.' },
            { title: 'Consult Your Doctor', content: 'Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.' }
          ]
        };
    }
  };

  const data = getContent();

  return (
    <Screen hideHeader title={data.title}>
      <div className="pt-4 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-8 px-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="mb-8 px-1">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-3">{data.title}</h2>
          <p className="text-sm text-[#6B7280] leading-relaxed">{data.summary}</p>
        </div>

        <div className="space-y-4">
          {data.sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
               <h4 className="text-sm font-bold text-[#1F2937] mb-2">{section.title}</h4>
               <p className="text-xs text-[#6B7280] leading-relaxed italic">{section.content}</p>
            </div>
          ))}
        </div>

        {type === 'disclaimer' && (
          <div className="mt-12 px-1 space-y-4">
             <div 
              onClick={() => setUnderstood(!understood)}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#E5E7EB] cursor-pointer"
             >
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${understood ? 'bg-[#8FAF9D] border-[#8FAF9D]' : 'border-gray-200'}`}>
                  {understood && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-xs font-semibold text-[#1F2937]">I understand and acknowledge the above.</span>
             </div>
             <Button 
              label="Continue" 
              onPress={handleAcknowledge} 
              className={`w-full ${!understood ? 'opacity-50 pointer-events-none' : ''}`}
             />
          </div>
        )}
      </div>
    </Screen>
  );
};

export default LegalScreen;
