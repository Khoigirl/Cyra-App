
import React from 'react';
import Card from './Card';
import Button from './Button';

export type PermissionType = 'camera' | 'photos' | 'notifications';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: PermissionType;
}

const PERMISSION_CONFIG: Record<PermissionType, { title: string; description: string; icon: string }> = {
  camera: {
    title: 'Camera Access',
    description: 'Cyra uses your camera only to capture and digitize lab results. We do not store or use your photos for any other purpose.',
    icon: '📸'
  },
  photos: {
    title: 'Photo Library',
    description: 'Grant access to your photos to select existing lab reports for digital analysis.',
    icon: '🖼️'
  },
  notifications: {
    title: 'Gentle Reminders',
    description: 'Enable notifications to receive timely nudges for your supplements and cycle check-ins.',
    icon: '🔔'
  }
};

const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onClose, onConfirm, type }) => {
  if (!isOpen) return null;

  const config = PERMISSION_CONFIG[type];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 animate-in fade-in duration-300">
      <div className="fixed inset-0" onClick={onClose} />
      <Card className="w-full max-w-sm p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#8FAF9D]/10 rounded-full flex items-center justify-center text-3xl mb-6">
            {config.icon}
          </div>
          <h3 className="text-xl font-bold text-[#1F2937] mb-3">{config.title}</h3>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-8 px-2">
            {config.description}
          </p>

          <div className="w-full space-y-3">
            <Button label="Continue" onPress={onConfirm} className="w-full" />
            <button 
              onClick={onClose}
              className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest py-2 hover:text-[#8FAF9D] transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PermissionModal;
