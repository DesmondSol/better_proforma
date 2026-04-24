
import React, { useState } from 'react';
import type { UserProfile } from '../types';
import FileUploader from '../components/FileUploader';
import { ArrowLeft } from 'lucide-react';

interface ProfileSetupProps {
  setProfile: (profile: UserProfile) => void;
  onGoHome: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ setProfile, onGoHome }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    tin: '',
    address: '',
    phone: '',
    email: '',
    logoURL: '',
    stampURL: '',
    signatureURL: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (name: string, dataUrl: string) => {
    setFormData({ ...formData, [name]: dataUrl });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      ...formData,
      templateId: 'classic',
      currency: 'ETB', // Default currency
      isPro: true,
      subscriptionStatus: 'active',
      bankAccounts: []
    };
    setProfile(newProfile);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-slate-800 relative">
      <button 
        onClick={onGoHome} 
        className="absolute top-6 left-6 flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </button>
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome to Proforma</h1>
        <p className="text-slate-600 mb-6">Let's set up your business profile to get started.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <div>
            <label className="block text-sm font-medium text-slate-700">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FileUploader label="Company Logo" onFileLoad={(data) => handleFileChange('logoURL', data)} />
            <FileUploader label="Signature Image" onFileLoad={(data) => handleFileChange('signatureURL', data)} />
            <FileUploader label="Stamp Image" onFileLoad={(data) => handleFileChange('stampURL', data)} />
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Save Profile & Get Started
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
