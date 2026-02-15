
import React from 'react';

const DateStrip: React.FC = () => {
  const days = [
    { day: 'Mon', date: 12, current: false },
    { day: 'Tue', date: 13, current: false },
    { day: 'Wed', date: 14, current: true }, // Highlighted as today
    { day: 'Thu', date: 15, current: false },
    { day: 'Fri', date: 16, current: false },
    { day: 'Sat', date: 17, current: false },
    { day: 'Sun', date: 18, current: false },
  ];

  return (
    <div className="flex justify-between items-center py-4 mb-4">
      {days.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{item.day}</span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
            item.current 
            ? "bg-[#8FAF9D] text-white shadow-sm" 
            : "bg-white text-[#1F2937] border border-[#E5E7EB]"
          }`}>
            {item.date}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DateStrip;
