
import React, { useState } from 'react';
import Modal from './Modal';
import { MessageCircle, Send, HeartCrack, ArrowRight, HelpCircle, X, ShieldAlert, Heart } from 'lucide-react';

interface CancelSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmCancel: (reason: string) => void;
}

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({ isOpen, onClose, onConfirmCancel }) => {
    const [step, setStep] = useState<'reason' | 'support' | 'farewell'>('reason');
    const [reason, setReason] = useState('');

    const handleReasonSubmit = () => {
        if (reason.trim().length > 0) {
            setStep('support');
        }
    };

    const handleFinalCancel = () => {
        onConfirmCancel(reason);
        setStep('farewell');
    };

    const handleClose = () => {
        if (step === 'farewell') {
            // Fully close and reset
            onClose();
            setTimeout(() => {
                setStep('reason');
                setReason('');
            }, 500);
        } else {
            onClose();
        }
    };

    const renderReasonStep = () => (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">We're sorry to see you go</h2>
            <p className="text-slate-600 mb-6">Could you tell us a little bit about why you are cancelling? Your feedback helps us improve.</p>
            
            <textarea 
                className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] resize-none mb-6 text-slate-700"
                placeholder="I'm cancelling because..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex space-x-3">
                <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                    Keep Subscription
                </button>
                <button 
                    onClick={handleReasonSubmit} 
                    disabled={reason.length < 5}
                    className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderSupportStep = () => (
        <div className="animate-fade-in-up text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Before you go...</h2>
            <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                Is there something we can help you with? Our team is available right now to fix any issues you might be having.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <a 
                    href="https://wa.me/251923214663" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all flex flex-col items-center group"
                >
                    <MessageCircle className="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-700">WhatsApp</span>
                </a>
                <a 
                    href="https://t.me/sol_tig" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center group"
                >
                    <Send className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-700">Telegram</span>
                </a>
            </div>

            <div className="flex flex-col space-y-3">
                <button 
                    onClick={onClose} 
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-colors"
                >
                    I'll Stay for Now
                </button>
                <button 
                    onClick={handleFinalCancel} 
                    className="w-full py-3 text-red-500 font-semibold hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                >
                    No thanks, confirm cancellation
                </button>
            </div>
        </div>
    );

    const renderFarewellStep = () => (
        <div className="animate-scale-in text-center py-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartCrack className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Subscription Cancelled</h2>
            <p className="text-slate-600 mb-8 max-w-sm mx-auto leading-relaxed">
                We're truly sorry to see you go. Your account has been downgraded to the Free Plan. 
                <br/><br/>
                We will work hard to improve Proforma. We hope to see you again soon.
            </p>
            
            <button 
                onClick={handleClose} 
                className="px-10 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
                Close
            </button>
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center text-slate-400 text-sm">
                <span>Made with</span>
                <Heart className="w-3 h-3 mx-1 text-slate-300" />
                <span>in Ethiopia</span>
            </div>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={step === 'farewell' ? handleClose : onClose}>
            <div className="p-4">
                {step === 'reason' && renderReasonStep()}
                {step === 'support' && renderSupportStep()}
                {step === 'farewell' && renderFarewellStep()}
            </div>
        </Modal>
    );
};

export default CancelSubscriptionModal;
