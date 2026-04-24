
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { CheckCircle, AlertTriangle, Smartphone, Building } from 'lucide-react';

interface SubscriptionPageProps {
    profile: UserProfile;
    onUpdateProfile: (profile: UserProfile) => void;
    onGoBack?: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ profile, onUpdateProfile, onGoBack }) => {
    const [transactionId, setTransactionId] = useState('');
    const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate submission to backend
        const updatedProfile: UserProfile = {
            ...profile,
            paymentStatus: 'pending',
            subscriptionStatus: 'pending_verification'
        };
        onUpdateProfile(updatedProfile);
        setIsSubmitted(true);
    };

    if (isSubmitted || profile.paymentStatus === 'pending') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full p-8 rounded-xl shadow-lg text-center">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ClockIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Verification Pending</h2>
                    <p className="text-slate-600 mb-6">
                        Thank you for your payment! We are currently verifying transaction <strong>{transactionId}</strong>. 
                        This usually takes 1-2 hours. You can contact us on WhatsApp/Telegram for faster activation.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <p className="text-blue-800 font-semibold">Support: +251 923 214 663</p>
                    </div>
                    {onGoBack && <button onClick={onGoBack} className="text-slate-500 hover:text-slate-700">Go to Dashboard (Restricted)</button>}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Upgrade to Proforma Pro</h1>
                    <p className="text-xl text-slate-600">Your 15-day trial has ended. Continue creating professional invoices with Pro.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${plan === 'monthly' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'}`} onClick={() => setPlan('monthly')}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900">Monthly</h3>
                            {plan === 'monthly' && <CheckCircle className="text-blue-600" />}
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-2">300 ETB<span className="text-sm text-slate-500 font-normal">/mo</span></p>
                        <p className="text-slate-600">Flexible, cancel anytime.</p>
                    </div>
                    <div className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${plan === 'yearly' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'}`} onClick={() => setPlan('yearly')}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900">Yearly</h3>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">SAVE 600 ETB</span>
                            {plan === 'yearly' && <CheckCircle className="text-blue-600" />}
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-2">3,000 ETB<span className="text-sm text-slate-500 font-normal">/yr</span></p>
                        <p className="text-slate-600">Two months free!</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Methods</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="border border-slate-200 p-4 rounded-lg flex items-start space-x-4">
                            <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Building className="w-6 h-6" /></div>
                            <div>
                                <h4 className="font-bold text-slate-900">CBE (Commercial Bank)</h4>
                                <p className="text-slate-600 font-mono my-1 select-all">1000217950736</p>
                                <p className="text-sm text-slate-500">Account Name: Solomon Tigabu</p>
                            </div>
                        </div>
                         <div className="border border-slate-200 p-4 rounded-lg flex items-start space-x-4">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Smartphone className="w-6 h-6" /></div>
                            <div>
                                <h4 className="font-bold text-slate-900">Telebirr</h4>
                                <p className="text-slate-600 font-mono my-1 select-all">0923214663</p>
                                <p className="text-sm text-slate-500">Account Name: Solomon Tigabu</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="border-t pt-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Confirm Payment</h3>
                        <p className="text-slate-600 mb-4 text-sm">Please make the transfer using one of the methods above, then enter the transaction reference number below.</p>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Transaction ID / Reference Number</label>
                            <input 
                                type="text" 
                                required 
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="e.g. FT23456789 or 8X456..." 
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors">
                            I Have Made The Payment
                        </button>
                    </form>
                </div>
                
                <div className="text-center mt-8">
                    <p className="text-slate-600">Need help? Contact us on <a href="https://t.me/sol_tig" className="text-blue-600 hover:underline">Telegram</a> or <a href="https://wa.me/251923214663" className="text-blue-600 hover:underline">WhatsApp</a> (+251 923 214 663)</p>
                </div>
            </div>
        </div>
    );
};

const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

export default SubscriptionPage;
