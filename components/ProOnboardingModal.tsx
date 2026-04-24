
import React, { useState } from 'react';
import Modal from './Modal';
import { JOB_TYPES } from '../utils/banks';
import { 
    Briefcase, CheckCircle, Zap, Crown, FolderOpen, 
    Palette, LayoutTemplate, Star, ArrowRight, MessageCircle, Send,
    PartyPopper, Sparkles, Building2
} from 'lucide-react';

interface ProOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (jobTypes: string[]) => void;
}

const ProOnboardingModal: React.FC<ProOnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState<'intro' | 'selection' | 'success'>('intro');
    const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

    const toggleJob = (job: string) => {
        if (selectedJobs.includes(job)) {
            setSelectedJobs(selectedJobs.filter(j => j !== job));
        } else {
            setSelectedJobs([...selectedJobs, job]);
        }
    };

    const handleComplete = () => {
        // Use a timeout to simulate loading/processing
        onComplete(selectedJobs);
    };

    const renderIntro = () => (
        <div className="animate-fade-in p-4 md:p-6">
            {/* Header */}
            <div className="text-center mb-6 md:mb-8 mt-4">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg mb-4 transform hover:scale-110 transition-transform">
                    <Crown className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
                    Upgrade to Professional
                </h2>
                <p className="text-slate-600 mt-2 text-base md:text-lg">
                    Unlock the full potential of your business with our premium suite.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 md:mb-8">
                <div className="p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg"><FolderOpen className="w-5 h-5 text-blue-600" /></div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm md:text-base">Client Folders</h4>
                        <p className="text-xs md:text-sm text-slate-600">Organize invoices by client history.</p>
                    </div>
                </div>
                <div className="p-3 md:p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg"><LayoutTemplate className="w-5 h-5 text-purple-600" /></div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm md:text-base">Job Templates</h4>
                        <p className="text-xs md:text-sm text-slate-600">Pre-filled items for your industry.</p>
                    </div>
                </div>
                <div className="p-3 md:p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start space-x-3">
                    <div className="bg-amber-100 p-2 rounded-lg"><Palette className="w-5 h-5 text-amber-600" /></div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm md:text-base">Custom Branding</h4>
                        <p className="text-xs md:text-sm text-slate-600">Remove watermarks, custom colors.</p>
                    </div>
                </div>
                <div className="p-3 md:p-4 bg-green-50 rounded-xl border border-green-100 flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg"><Building2 className="w-5 h-5 text-green-600" /></div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm md:text-base">Bank Accounts</h4>
                        <p className="text-xs md:text-sm text-slate-600">Display multiple payment methods.</p>
                    </div>
                </div>
            </div>

            {/* Pricing Toggle */}
            <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200 mb-6 md:mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-bl-lg z-10">
                    15 DAY FREE TRIAL
                </div>
                <div className="flex justify-center mb-4 md:mb-6 mt-2">
                    <div className="bg-slate-200 p-1 rounded-xl flex">
                        <button 
                            onClick={() => setSelectedPlan('monthly')}
                            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${selectedPlan === 'monthly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                        >
                            Monthly
                        </button>
                        <button 
                            onClick={() => setSelectedPlan('yearly')}
                            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${selectedPlan === 'yearly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                        >
                            Yearly (-20%)
                        </button>
                    </div>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center text-3xl md:text-4xl font-black text-slate-900 mb-1">
                        {selectedPlan === 'monthly' ? '300 ETB' : '3,000 ETB'}
                        <span className="text-base md:text-lg font-medium text-slate-500 ml-2">
                             / {selectedPlan === 'monthly' ? 'mo' : 'yr'}
                        </span>
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm">Cancel anytime. No questions asked.</p>
                </div>
            </div>

            {/* Contact Support */}
            <div className="flex justify-center space-x-4 mb-6 md:mb-8 text-xs md:text-sm text-slate-500">
                <a href="https://t.me/sol_tig" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600 transition-colors"><MessageCircle className="w-4 h-4 mr-1"/> Telegram Support</a>
                <span className="text-slate-300">|</span>
                <a href="https://wa.me/251923214663" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-600 transition-colors"><Send className="w-4 h-4 mr-1"/> WhatsApp Support</a>
            </div>

            <div className="flex space-x-3 md:space-x-4 pb-2">
                <button onClick={onClose} className="flex-1 py-3 md:py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors text-sm md:text-base">
                    Maybe Later
                </button>
                <button 
                    onClick={() => setStep('selection')}
                    className="flex-[2] py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center text-sm md:text-base"
                >
                    Continue <ArrowRight className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );

    const renderSelection = () => (
        <div className="animate-fade-in-up p-4 md:p-6">
             <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Customize Your Workspace</h2>
                <p className="text-slate-600 text-sm">Select all the industries that apply to you. We'll load the relevant templates.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-1 mb-6 custom-scrollbar">
                {JOB_TYPES.map(job => (
                    <button
                        key={job}
                        onClick={() => toggleJob(job)}
                        className={`p-3 md:p-4 rounded-xl border-2 text-left font-medium transition-all flex items-center justify-between group ${
                            selectedJobs.includes(job) 
                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                                : 'border-slate-100 bg-white hover:border-blue-200 text-slate-600'
                        }`}
                    >
                        <span className="text-sm md:text-base">{job}</span>
                        <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-2 ${
                             selectedJobs.includes(job) ? 'bg-blue-500 border-blue-500' : 'border-slate-300'
                        }`}>
                            {selectedJobs.includes(job) && <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />}
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button onClick={() => setStep('intro')} className="text-slate-500 font-medium hover:text-slate-800 text-sm">
                    Back
                </button>
                <button 
                    onClick={() => setStep('success')}
                    disabled={selectedJobs.length === 0}
                    className="py-3 px-6 md:px-8 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center text-sm md:text-base"
                >
                    Start 15-Day Trial
                </button>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="text-center py-10 px-4 animate-scale-in relative overflow-hidden">
            {/* Simple confetti-like background elements */}
            <div className="absolute top-0 left-10 text-yellow-400 animate-bounce delay-100"><Star className="w-6 h-6 fill-current" /></div>
            <div className="absolute bottom-10 right-10 text-blue-400 animate-bounce delay-300"><Sparkles className="w-8 h-8" /></div>
            
            <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <PartyPopper className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Welcome to Pro!</h2>
            <p className="text-base md:text-lg text-slate-600 mb-8 max-w-md mx-auto">
                Your workspace is ready. We've added <strong>{selectedJobs.length}</strong> template packs and enabled all premium features for you.
            </p>

            <button 
                onClick={handleComplete}
                className="py-3 md:py-4 px-10 md:px-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base md:text-lg font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all"
            >
                Let's Go!
            </button>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={() => { if(step !== 'success') onClose(); }}>
            <div className="w-full">
                {step === 'intro' && renderIntro()}
                {step === 'selection' && renderSelection()}
                {step === 'success' && renderSuccess()}
            </div>
        </Modal>
    );
};

export default ProOnboardingModal;
