
import React from 'react';
import { 
  Calculator, Users, FileText, Smartphone, 
  ShieldCheck, Zap, Globe, Palette, ArrowRight 
} from 'lucide-react';

interface FeaturesPageProps {
  onGetStarted: () => void;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Calculator,
      title: "Smart Calculations",
      description: "Never use a calculator again. VAT, discounts (percentage or fixed amount), and subtotals are calculated automatically as you type."
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Save client details once and reuse them forever. Search and select clients instantly when creating new documents."
    },
    {
      icon: FileText,
      title: "Catalog System",
      description: "Build a library of your products and services. Add items to quotations with a single click instead of typing details manually."
    },
    {
      icon: Palette,
      title: "Professional Templates",
      description: "Choose from multiple professional designs. Whether you need something classic, modern, or bold, we have a style that fits your brand."
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Create quotations on the go. Our responsive design works perfectly on phones, tablets, and desktop computers."
    },
    {
      icon: ShieldCheck,
      title: "Secure Data",
      description: "Your data is stored securely in the cloud. Access your quotations and client information from any device, anywhere."
    },
    {
      icon: Globe,
      title: "Local Context",
      description: "Built for the Ethiopian market. Handles TIN numbers, VAT (15%), and supports local currency (ETB) formatting natively."
    },
    {
      icon: Zap,
      title: "Instant PDF Generation",
      description: "Generate high-quality, print-ready PDFs instantly. Download them or share directly via Email, Telegram, or WhatsApp."
    }
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
            Everything you need to <span className="text-blue-600">run your business</span>
          </h1>
          <p className="text-xl text-slate-600">
            Proforma provides a comprehensive suite of tools designed to simplify your billing process and help you look professional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to streamline your quotations?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Ethiopian businesses using Proforma today. No credit card required.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>Get Started for Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
