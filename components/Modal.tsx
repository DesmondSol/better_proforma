
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative animate-scale-in flex flex-col max-h-[90vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors z-20 bg-white/80 backdrop-blur-sm"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="overflow-y-auto custom-scrollbar">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
