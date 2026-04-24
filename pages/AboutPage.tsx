
import React from 'react';
import { Target, Heart, Globe, Users, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onGetStarted: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onGetStarted }) => {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 font-display leading-tight">
            We're building the <span className="text-blue-600">digital infrastructure</span> for Ethiopian businesses.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Proforma was born from a simple observation: creating professional quotations shouldn't be complicated, expensive, or manual.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-slate-50 py-20 mb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="w-full md:w-1/2">
               <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                  <Target className="w-12 h-12 text-blue-600 mb-6" />
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Mission</h2>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    To empower small and medium enterprises across Ethiopia with accessible, intuitive, and professional digital tools that streamline operations and foster growth.
                  </p>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    We believe that by reducing the administrative burden on business owners, we can help them focus on what matters most: serving their customers and growing their ventures.
                  </p>
               </div>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <Globe className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800">Local First</h3>
                    <p className="text-sm text-slate-600">Built specifically for the Ethiopian market context.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800">User Centric</h3>
                    <p className="text-sm text-slate-600">Designed for ease of use, regardless of technical skill.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <Users className="w-8 h-8 text-green-500 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800">Community</h3>
                    <p className="text-sm text-slate-600">Supporting thousands of local entrepreneurs.</p>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-md text-center flex flex-col items-center justify-center bg-blue-50 border border-blue-100">
                    <h3 className="font-bold text-blue-800 text-3xl mb-1">500+</h3>
                    <p className="text-sm text-blue-600">Active Businesses</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 mb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg text-slate-600 mx-auto">
            <p className="mb-6">
              It started in a small café in Addis Ababa. Watching a business owner struggle with a carbon-copy quotation book, doing manual calculations, and worrying about making mistakes, we realized there had to be a better way.
            </p>
            <p className="mb-6">
              Existing software was either too expensive, too complex, or not designed for local needs (like handling TIN numbers or specific VAT rates).
            </p>
            <p>
              So we built Proforma. What began as a simple tool to generate PDFs has grown into a comprehensive quotation platform trusted by freelancers, traders, and service providers across the country. We are proud to be made in Ethiopia, for Ethiopia.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Digital Revolution</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Be part of the community of forward-thinking businesses upgrading their workflow.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
