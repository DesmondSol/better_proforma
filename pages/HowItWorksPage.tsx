
import React from 'react';
import { UserPlus, PackagePlus, FileEdit, Share2, ArrowRight } from 'lucide-react';

interface HowItWorksPageProps {
  onGetStarted: () => void;
}

const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onGetStarted }) => {
  const steps = [
    {
      num: "01",
      title: "Set Up Your Profile",
      description: "Enter your business details, upload your logo, and add your digital signature and stamp. This information will appear on every document you create, ensuring a professional look.",
      icon: UserPlus,
      color: "bg-blue-500"
    },
    {
      num: "02",
      title: "Build Your Catalog",
      description: "Add your frequently sold products or services to your catalog. Define names, descriptions, and unit prices once, so you never have to type them manually again.",
      icon: PackagePlus,
      color: "bg-indigo-500"
    },
    {
      num: "03",
      title: "Create Quotation or Invoice",
      description: "Select a client, choose items from your catalog (or add custom ones), and let the system handle the math. Toggle between 'Quotation' and 'Invoice' mode with a single click.",
      icon: FileEdit,
      color: "bg-purple-500"
    },
    {
      num: "04",
      title: "Share & Get Paid",
      description: "Download your document as a PDF. Share it directly via Telegram, WhatsApp, or Email. Your clients get a clear, professional document they can pay easily.",
      icon: Share2,
      color: "bg-green-500"
    }
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
            From setup to sent <span className="text-blue-600">in minutes</span>
          </h1>
          <p className="text-xl text-slate-600">
            We've designed Proforma to be intuitive and fast. Follow these simple steps to modernize your business operations.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center mb-20 last:mb-0 group">
              {/* Visual Side */}
              <div className={`w-full md:w-1/2 flex justify-center mb-8 md:mb-0 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="relative">
                  <div className={`absolute inset-0 ${step.color} opacity-20 blur-3xl rounded-full`}></div>
                  <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-64 h-64 flex flex-col items-center justify-center transform transition-transform duration-500 group-hover:scale-105">
                    <step.icon className={`w-20 h-20 ${step.color.replace('bg-', 'text-')} mb-4`} />
                    <div className="text-4xl font-bold text-slate-200">{step.num}</div>
                  </div>
                </div>
              </div>

              {/* Text Side */}
              <div className={`w-full md:w-1/2 text-center md:text-left px-4 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-bold mb-4 ${step.color}`}>
                  Step {step.num}
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">{step.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
            <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-xl inline-flex items-center space-x-2"
            >
            <span>Start Creating Quotations</span>
            <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
