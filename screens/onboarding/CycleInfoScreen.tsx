
import React, { useState } from 'react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import Chip from '../../components/Chip';
import Dropdown from '../../components/Dropdown';
import { useOnboarding } from '../../context/OnboardingContext';
import Card from '../../components/Card';

interface CycleInfoScreenProps {
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
}

const REGULARITY_OPTIONS = ["Regular", "Somewhat irregular", "Very irregular"];
const CYCLE_LENGTHS = ["21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "Varies"];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const CycleInfoScreen: React.FC<CycleInfoScreenProps> = ({ onNext, onBack, step, totalSteps }) => {
  const { answers, updateAnswers } = useOnboarding();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  // Validation: ensures all fields have values before enabling the "Continue" button
  const isFormValid = !!answers.cycleLength && !!answers.periodRegularity && !!answers.lastPeriodDate;

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleMonthChange = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const monthName = viewDate.toLocaleString('default', { month: 'long' });

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = answers.lastPeriodDate === dateString;
      const isToday = new Date().toISOString().split('T')[0] === dateString;

      days.push(
        <button
          key={d}
          type="button"
          onClick={() => {
            updateAnswers({ lastPeriodDate: dateString });
            setShowDatePicker(false);
          }}
          className={`h-9 w-9 flex items-center justify-center rounded-full text-xs font-medium transition-all ${
            isSelected 
              ? "bg-[#8FAF9D] text-white shadow-sm" 
              : isToday 
                ? "border border-[#8FAF9D] text-[#8FAF9D]" 
                : "text-[#1F2937] hover:bg-gray-50"
          }`}
        >
          {d}
        </button>
      );
    }

    return (
      <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-4 mt-2 animate-in slide-in-from-top-2 duration-300 shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-4 px-2">
          <h4 className="text-sm font-bold text-[#1F2937]">{monthName} {year}</h4>
          <div className="flex gap-1">
            <button type="button" onClick={() => handleMonthChange(-1)} className="p-1 text-[#8FAF9D] hover:bg-gray-50 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button type="button" onClick={() => handleMonthChange(1)} className="p-1 text-[#8FAF9D] hover:bg-gray-50 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {WEEKDAYS.map((w, i) => (
            <div key={i} className="text-[10px] font-bold text-[#6B7280] uppercase opacity-50">{w}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  return (
    <OnboardingLayout
      title="About your cycle"
      subtitle="This helps Cyra predict your rhythm accurately."
      onNext={onNext}
      onBack={onBack}
      currentStep={step}
      totalSteps={totalSteps}
      isNextDisabled={!isFormValid}
    >
      <div className="space-y-6">
        {/* Last Period Selector */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Last period start date</p>
          <button 
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full flex items-center justify-between bg-white border border-[#E5E7EB] rounded-[14px] px-5 py-3.5 text-left"
          >
            <span className={answers.lastPeriodDate ? "text-[#1F2937] font-medium" : "text-[#6B7280]"}>
              {answers.lastPeriodDate ? new Date(answers.lastPeriodDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Select date"}
            </span>
            <svg className="w-5 h-5 text-[#8FAF9D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          
          {showDatePicker && renderCalendar()}
        </div>

        {/* Cycle Length */}
        <Dropdown 
          label="Typical cycle length (days)"
          options={CYCLE_LENGTHS}
          value={answers.cycleLength}
          onSelect={(val) => updateAnswers({ cycleLength: val })}
          placeholder="Select cycle length"
        />

        {/* Regularity */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Period regularity</p>
          <div className="flex flex-wrap gap-2">
            {REGULARITY_OPTIONS.map((opt) => (
              <Chip 
                key={opt}
                label={opt}
                selected={answers.periodRegularity === opt}
                onPress={() => updateAnswers({ periodRegularity: opt })}
              />
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Card className="bg-[#DDEEF4]/30 border-none p-4 flex gap-3 items-start">
            <span className="text-lg">🔒</span>
            <p className="text-[10px] text-[#6B7280] leading-tight">
              Your cycle data is stored locally to calculate your rhythm.
            </p>
          </Card>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default CycleInfoScreen;
