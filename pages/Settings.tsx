
import React, { useState, useEffect } from 'react';
import type { UserProfile, TemplateId, BankAccount } from '../types';
import FileUploader from '../components/FileUploader';
import TemplateSelectorModal from '../components/TemplateSelectorModal';
import CancelSubscriptionModal from '../components/CancelSubscriptionModal';
import { Edit, Plus, Trash2, Building, Smartphone, Zap, AlertTriangle, Lock } from 'lucide-react';
import { ETHIOPIAN_BANKS } from '../utils/banks';

interface SettingsProps {
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  onTriggerPro?: () => void;
}

const CURRENCY_OPTIONS = [
    { code: 'ETB', name: 'Ethiopian Birr (ETB)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'AED', name: 'UAE Dirham (AED)' },
    { code: 'KES', name: 'Kenyan Shilling (KSh)' },
    { code: 'CNY', name: 'Chinese Yuan (¥)' },
];

const TemplatePreviewMini: React.FC<{ colors: { bg: string, accent: string, text: string } }> = ({ colors }) => (
    <div className={`w-full h-24 rounded-md shadow-inner p-2 flex flex-col ${colors.bg}`}>
        <div className="flex justify-between items-center mb-1">
            <div className={`w-4 h-4 rounded-full ${colors.accent}`}></div>
            <div className={`w-10 h-3 rounded ${colors.accent}`}></div>
        </div>
        <div className={`w-1/3 h-2 rounded ${colors.text} mb-2`}></div>
        <div className={`flex-grow border-t border-dashed ${colors.text} opacity-30 pt-1 space-y-1`}>
            {[...Array(2)].map((_, i) => (
                 <div key={i} className="flex justify-between">
                    <div className={`w-1/2 h-1 rounded ${colors.text}`}></div>
                    <div className={`w-1/4 h-1 rounded ${colors.text}`}></div>
                 </div>
            ))}
        </div>
    </div>
);

const Settings: React.FC<SettingsProps> = ({ profile, setProfile, onTriggerPro }) => {
  const [formData, setFormData] = useState<UserProfile | null>(profile);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [newBank, setNewBank] = useState<Partial<BankAccount>>({ type: 'bank', bankName: ETHIOPIAN_BANKS[0].name, isVisible: true });

  useEffect(() => {
    const profileWithDefaults = profile ? { 
        ...profile, 
        templateId: profile.templateId || 'classic',
        currency: profile.currency || 'ETB',
        bankAccounts: profile.bankAccounts || []
    } : null;
    setFormData(profileWithDefaults);
  }, [profile]);

  if (!formData) {
    return <div>Loading profile...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  
  const handleFileChange = (name: string, dataUrl: string) => {
    if (formData) {
      setFormData({ ...formData, [name]: dataUrl });
    }
  };

  const handleTemplateChange = (templateId: TemplateId, customAssets?: { bg?: string, header?: string, footer?: string }) => {
    if (formData) {
        let updatedProfile = { ...formData, templateId };
        
        if (templateId === 'custom' && customAssets) {
            updatedProfile = {
                ...updatedProfile,
                customBackgroundURL: customAssets.bg || '',
                customHeaderURL: customAssets.header || '',
                customFooterURL: customAssets.footer || ''
            };
        }
        
        setFormData(updatedProfile);
        setTemplateModalOpen(false);
    }
  };

  const handleAddBank = () => {
      if(newBank.bankName && newBank.accountNumber && formData) {
          const bank: BankAccount = {
              id: Date.now().toString(),
              bankName: newBank.bankName,
              accountNumber: newBank.accountNumber,
              accountName: newBank.accountName || formData.businessName,
              isVisible: true,
              type: newBank.type as 'bank' | 'wallet'
          };
          setFormData({ ...formData, bankAccounts: [...(formData.bankAccounts || []), bank] });
          setNewBank({ type: 'bank', bankName: ETHIOPIAN_BANKS[0].name, isVisible: true, accountNumber: '', accountName: '' });
      }
  };

  const removeBank = (id: string) => {
      if(formData) {
          setFormData({ ...formData, bankAccounts: formData.bankAccounts.filter(b => b.id !== id) });
      }
  };

  const handleDowngrade = (reason: string) => {
      if(formData) {
          const updatedProfile: UserProfile = {
              ...formData,
              isPro: false,
              subscriptionStatus: 'canceled',
              cancellationReason: reason,
              // Keep old data but disable pro flag
          };
          // Immediately update global profile state to reflect change in DB (handled by App.tsx wrapper via setProfile)
          setProfile(updatedProfile); 
          setFormData(updatedProfile);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    alert('Profile updated successfully!');
  };

  const templateDetails: Record<string, {name: string, colors: any}> = {
    classic: { name: 'Classic', colors: { bg: 'bg-white', accent: 'bg-gray-700', text: 'bg-gray-400' } },
    modern: { name: 'Modern', colors: { bg: 'bg-white', accent: 'bg-blue-500', text: 'bg-gray-400' } },
    bold: { name: 'Bold', colors: { bg: 'bg-gray-800', accent: 'bg-yellow-400', text: 'bg-gray-500' } },
    elegant: { name: 'Elegant', colors: { bg: 'bg-rose-50', accent: 'bg-rose-800', text: 'bg-rose-300' } },
    minimalist: { name: 'Minimalist', colors: { bg: 'bg-gray-100', accent: 'bg-gray-400', text: 'bg-gray-300' } },
    custom: { name: 'Custom Design', colors: { bg: 'bg-purple-50', accent: 'bg-purple-600', text: 'bg-purple-300' } },
  };
  
  const currentTemplateDetails = templateDetails[formData.templateId || 'classic'];

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-slate-800">Settings</h1>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Subscription Section Hidden */}

            {/* Profile Info */}
            <section>
                <h2 className="text-2xl font-semibold text-slate-700 border-b pb-2 mb-4">Business Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Business Name</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">TIN / Business Number</label>
                    <input type="text" name="tin" value={formData.tin} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                </div>
                <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                </div>
            </section>
            
            {/* Bank Accounts Section (Pro Feature but visible to add) */}
            <section>
                 <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-2xl font-semibold text-slate-700">Payment Methods</h2>
                 </div>
                 
                 <div className="space-y-3 mb-4">
                     {formData.bankAccounts?.map(bank => (
                         <div key={bank.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                             <div className="flex items-center space-x-3">
                                 <div className={`p-2 rounded-full ${bank.type === 'wallet' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                                     {bank.type === 'wallet' ? <Smartphone className="w-5 h-5"/> : <Building className="w-5 h-5"/>}
                                 </div>
                                 <div>
                                     <p className="font-bold text-slate-800">{bank.bankName}</p>
                                     <p className="text-sm text-slate-600">{bank.accountNumber} <span className="text-xs text-slate-400">({bank.accountName})</span></p>
                                 </div>
                             </div>
                             <button type="button" onClick={() => removeBank(bank.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5"/></button>
                         </div>
                     ))}
                     {(!formData.bankAccounts || formData.bankAccounts.length === 0) && (
                         <p className="text-slate-500 italic text-sm">No bank accounts added. These can be displayed on your invoices.</p>
                     )}
                 </div>
                 
                 <div className="bg-slate-100 p-4 rounded-lg relative overflow-hidden">
                     <h4 className="font-semibold text-sm mb-3 text-slate-700">Add New Account</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                         <select 
                            value={newBank.bankName} 
                            onChange={e => {
                                const b = ETHIOPIAN_BANKS.find(x => x.name === e.target.value);
                                setNewBank({...newBank, bankName: e.target.value, type: b?.type as any})
                            }}
                            className="p-2 border rounded-md"
                         >
                             {ETHIOPIAN_BANKS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                         </select>
                         <input 
                            placeholder="Account Number" 
                            value={newBank.accountNumber || ''} 
                            onChange={e => setNewBank({...newBank, accountNumber: e.target.value})}
                            className="p-2 border rounded-md"
                         />
                         <input 
                            placeholder="Account Name (Optional)" 
                            value={newBank.accountName || ''} 
                            onChange={e => setNewBank({...newBank, accountName: e.target.value})}
                            className="p-2 border rounded-md"
                         />
                     </div>
                     <button type="button" onClick={handleAddBank} className="flex items-center space-x-1 text-blue-600 font-bold text-sm hover:underline">
                         <Plus className="w-4 h-4" /> <span>Add Account</span>
                     </button>
                 </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-slate-700 border-b pb-2 mb-4">Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Default Currency</label>
                        <select 
                            name="currency" 
                            value={formData.currency} 
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            {CURRENCY_OPTIONS.map(opt => (
                                <option key={opt.code} value={opt.code}>{opt.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Document Language</label>
                        <select 
                            name="language" 
                            value={formData.language || 'en'} 
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="en">English</option>
                            <option value="am">Amharic (አማርኛ)</option>
                        </select>
                        <p className="mt-1 text-xs text-slate-500">Affects labels on generated invoices/quotations.</p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-slate-700 border-b pb-2 mb-4">Assets</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FileUploader label="Company Logo" onFileLoad={(data) => handleFileChange('logoURL', data)} initialPreview={formData.logoURL} />
                <FileUploader label="Signature Image" onFileLoad={(data) => handleFileChange('signatureURL', data)} initialPreview={formData.signatureURL} />
                <FileUploader label="Stamp Image" onFileLoad={(data) => handleFileChange('stampURL', data)} initialPreview={formData.stampURL} />
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-slate-700 border-b pb-2 mb-4">Invoice Template</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-1">
                    <div className="p-1.5 bg-slate-200 rounded-lg">
                        <TemplatePreviewMini colors={currentTemplateDetails.colors} />
                    </div>
                    <p className="text-center text-sm mt-2 font-medium text-slate-600">{currentTemplateDetails.name}</p>
                    </div>
                    <div className="md:col-span-2">
                    <button 
                        type="button" 
                        onClick={() => setTemplateModalOpen(true)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all duration-200 border border-slate-300"
                    >
                        <Edit className="w-4 h-4" />
                        <span>Change Template</span>
                    </button>
                    </div>
                </div>
            </section>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <TemplateSelectorModal 
          isOpen={isTemplateModalOpen}
          onClose={() => setTemplateModalOpen(false)}
          currentTemplate={formData.templateId}
          onSelectTemplate={handleTemplateChange}
          isPro={true}
          onTriggerPro={() => {}}
      />
      <CancelSubscriptionModal 
          isOpen={isCancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirmCancel={handleDowngrade}
      />
    </>
  );
};

export default Settings;
