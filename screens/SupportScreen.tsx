
import React, { useState } from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import CollapsibleSection from '../components/CollapsibleSection';

interface SupportScreenProps {
  onBack: () => void;
}

const FAQs = [
  { q: "How is my data stored?", a: "Your wellness data is stored locally on your device. If you create an account, it's backed up to a secure, private cloud server." },
  { q: "Is Cyra a replacement for my doctor?", a: "No. Cyra is a wellness and tracking tool. Always consult a medical professional for diagnosis or treatment plans." },
  { q: "How do I cancel my subscription?", a: "Cyra Premium is managed through your Apple ID settings. You can cancel or change your plan anytime there." }
];

const SupportScreen: React.FC<SupportScreenProps> = ({ onBack }) => {
  const [bugDescription, setBugDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!bugDescription.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Thanks for your report! Our team will look into it.");
      setBugDescription('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Screen hideHeader title="Support & FAQ">
      <div className="pt-4 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-8 px-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h2 className="text-2xl font-bold text-[#1F2937] mb-6 px-1">Help Center</h2>

        <section className="mb-10">
          <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Frequent Questions</h3>
          <div className="space-y-2">
            {FAQs.map((faq, i) => (
              <CollapsibleSection key={i} title={faq.q} variant="card">
                <p className="text-xs text-[#6B7280] leading-relaxed py-2">{faq.a}</p>
              </CollapsibleSection>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Contact Support</h3>
          <Card className="bg-white border-gray-100 p-6 shadow-sm">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#8FAF9D]/10 flex items-center justify-center text-xl">✉️</div>
                <div>
                   <p className="text-sm font-bold text-[#1F2937]">Email Us</p>
                   <p className="text-xs text-[#6B7280]">hello@cyra.health</p>
                </div>
             </div>
             <p className="text-[10px] text-gray-400 italic">We typically respond within 24–48 hours.</p>
          </Card>
        </section>

        <section>
          <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Report a Bug</h3>
          <Card className="p-6 bg-white border-gray-100 shadow-sm">
             <textarea 
               value={bugDescription}
               onChange={(e) => setBugDescription(e.target.value)}
               placeholder="Describe what happened..."
               className="w-full h-32 bg-[#F7F4F1] border border-transparent rounded-xl p-4 text-sm outline-none focus:border-[#8FAF9D] resize-none mb-4"
             />
             <Button 
               label={isSubmitting ? "Sending..." : "Submit Report"} 
               onPress={handleSubmit} 
               className={`w-full ${!bugDescription.trim() || isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
             />
          </Card>
        </section>
      </div>
    </Screen>
  );
};

export default SupportScreen;
