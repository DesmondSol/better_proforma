
import React, { useState } from 'react';
import { Search, Shield, FileText, User, CreditCard, Lock, HelpCircle, ChevronDown, ChevronUp, Database } from 'lucide-react';

interface SupportPageProps {
  onGetStarted: () => void;
}

const SupportPage: React.FC<SupportPageProps> = ({ onGetStarted }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const categories = [
    { icon: FileText, title: "Quotation Guide", desc: "How to create, edit, and send documents." },
    { icon: User, title: "Account Settings", desc: "Managing your profile, logo, and security." },
    { icon: CreditCard, title: "Billing & Plans", desc: "Understanding Free vs. Pro tiers." },
    { icon: Database, title: "Data & Privacy", desc: "How we handle and secure your information." },
  ];

  const faqs = [
    {
      question: "Is Proforma really free?",
      answer: "Yes! Our 'Free Forever' tier allows you to create unlimited quotations and manage unlimited clients. We believe essential business tools should be accessible to everyone."
    },
    {
      question: "How do I change my currency?",
      answer: "Proforma is optimized for the Ethiopian market, so the default currency is ETB (Ethiopian Birr). Currently, this is fixed to ensure accurate local compliance, but multi-currency support is on our roadmap."
    },
    {
      question: "Can I use Proforma on my phone?",
      answer: "Absolutely. Proforma is a progressive web app (PWA) designed to work seamlessly on smartphones, tablets, and desktops. You can access your data from any device."
    },
    {
      question: "How do I add my company logo?",
      answer: "Go to 'Settings' in your dashboard. Under the 'Assets' section, you can upload your company logo, digital stamp, and signature. These will automatically appear on all your quotations."
    },
    {
      question: "What happens if I lose my internet connection?",
      answer: "Proforma has basic offline capabilities. You can view your dashboard and loaded data offline. However, to save new quotations or sync changes, you will need to reconnect to the internet."
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16 -mt-24 mb-12">
        <div className="container mx-auto px-4 pt-24 text-center">
          <h1 className="text-4xl font-bold mb-6 font-display">How can we help you?</h1>
          <div className="max-w-2xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Search for answers (e.g., 'How to change VAT rate')" 
              className="w-full px-6 py-4 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500 shadow-xl"
            />
            <Search className="absolute right-6 top-4 text-slate-400 w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        
        {/* Knowledge Base Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 -mt-24">
          {categories.map((cat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{cat.title}</h3>
              <p className="text-sm text-slate-500">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* Data Policy Section (Highlighted) */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-white p-4 rounded-full shadow-md text-blue-600 flex-shrink-0">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Policy & Research Usage</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We value transparency. Your business data is encrypted and stored securely.
              </p>
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
                <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Free Tier Research Usage
                </h3>
                <p className="text-sm text-slate-600 mb-0">
                  By using the <strong>Free Forever</strong> tier of Proforma, you acknowledge that we may use 
                  <strong> anonymized</strong> and <strong>aggregated</strong> data from your usage for internal research purposes. 
                  This helps us understand market trends and improve our product features. 
                </p>
                <p className="text-sm text-slate-600 mt-2 font-medium">
                  We strictly <u>never</u> share your personal identifiers, client lists, or specific financial details with third parties.
                  This research usage is solely for platform improvement.
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                * Users on Pro and Enterprise plans enjoy strict data isolation and are opted out of all research datasets by default.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-slate-50"
                >
                  <span className="font-semibold text-slate-800">{faq.question}</span>
                  {openFaq === index ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 pt-0 text-slate-600 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still need help? */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-sm border border-slate-200 max-w-4xl mx-auto">
          <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Still need help?</h2>
          <p className="text-slate-600 mb-8">
            Our support team is just a click away. We usually respond within 24 hours.
          </p>
          <button 
            onClick={() => window.location.href = 'mailto:support@proforma.et'}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
};

export default SupportPage;
