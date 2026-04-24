
import React from 'react';
import { Check, X, Star, Zap, Building, FolderOpen, LayoutTemplate, CreditCard } from 'lucide-react';

interface PricingPageProps {
  onGetStarted: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
            Simple, transparent <span className="text-blue-600">pricing</span>
          </h1>
          <p className="text-xl text-slate-600">
            Start for free, upgrade as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Free Forever</h3>
            <p className="text-slate-500 mb-6">Perfect for freelancers and small shops.</p>
            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-bold text-slate-900">0</span>
              <span className="text-slate-500 ml-2">ETB / month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">Unlimited Quotations & Invoices</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">Unlimited Clients</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">Standard 'Classic' Template</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">PDF Downloads</span>
              </li>
            </ul>

            <button
              onClick={onGetStarted}
              className="w-full py-3 px-4 bg-slate-100 text-slate-800 font-bold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Tier (Active) */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl border border-blue-500 p-8 flex flex-col relative text-white transform scale-105 z-10">
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                15-DAY FREE TRIAL
            </div>
            <h3 className="text-2xl font-bold mb-2 flex items-center">
                Pro
                <Zap className="w-5 h-5 text-yellow-400 ml-2 fill-current" />
            </h3>
            <p className="text-blue-100 mb-6">For professional businesses.</p>
            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-bold">300</span>
              <span className="text-blue-200 ml-2">ETB / month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                <span className="font-medium">Everything in Free</span>
              </li>
              <li className="flex items-start">
                <FolderOpen className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                <span className="font-medium">Client Folders & Version History</span>
              </li>
              <li className="flex items-start">
                <LayoutTemplate className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                <span className="font-medium">Industry-Specific Templates</span>
              </li>
              <li className="flex items-start">
                <CreditCard className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                <span className="font-medium">Multiple Bank Accounts</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                <span className="font-medium">Custom Branding (No Watermark)</span>
              </li>
            </ul>

            <button
              onClick={onGetStarted}
              className="w-full py-4 px-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start 15-Day Free Trial
            </button>
            <p className="text-center text-xs text-blue-200 mt-3">Then 300 ETB/mo. Cancel anytime.</p>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col transition-transform hover:-translate-y-1">
             <div className="absolute top-4 right-4 bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">
                CONTACT US
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
                Enterprise
                <Building className="w-5 h-5 text-slate-400 ml-2" />
            </h3>
            <p className="text-slate-500 mb-6">For large organizations.</p>
            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-bold text-slate-900">Custom</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">Multi-user Access</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">Advanced Analytics</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">API Access</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">Dedicated Account Manager</span>
              </li>
            </ul>

            <button
               disabled
              className="w-full py-3 px-4 bg-slate-100 text-slate-400 font-bold rounded-lg cursor-not-allowed"
            >
              Contact Sales
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PricingPage;
