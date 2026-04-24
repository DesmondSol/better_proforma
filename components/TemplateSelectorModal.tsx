
import React, { useState } from 'react';
import type { TemplateId } from '../types';
import Modal from './Modal';
import { CheckCircle, UploadCloud, Layout, Image as ImageIcon, ArrowLeft, Lock } from 'lucide-react';
import FileUploader from './FileUploader';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId, customAssets?: { bg?: string, header?: string, footer?: string }) => void;
  isPro?: boolean;
  onTriggerPro?: () => void;
}

const TemplatePreview: React.FC<{ name: string, colors: { bg: string, accent: string, text: string } }> = ({ name, colors }) => (
    <div className={`w-full h-48 rounded-lg shadow-md p-3 flex flex-col ${colors.bg}`}>
        <div className="flex justify-between items-center mb-2">
            <div className={`w-8 h-8 rounded-full ${colors.accent}`}></div>
            <div className={`w-20 h-5 rounded ${colors.accent}`}></div>
        </div>
        <div className={`w-1/3 h-3 rounded ${colors.text} mb-4`}></div>
        <div className={`flex-grow border-t border-dashed ${colors.text} opacity-30 pt-2 space-y-2`}>
            {[...Array(3)].map((_, i) => (
                 <div key={i} className="flex justify-between">
                    <div className={`w-1/2 h-2 rounded ${colors.text}`}></div>
                    <div className={`w-1/4 h-2 rounded ${colors.text}`}></div>
                 </div>
            ))}
        </div>
    </div>
);

const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({ isOpen, onClose, currentTemplate, onSelectTemplate, isPro = false, onTriggerPro }) => {
    const [view, setView] = useState<'list' | 'custom_setup'>('list');
    const [customType, setCustomType] = useState<'full' | 'parts'>('full'); // full = bg, parts = header/footer
    
    // Custom Asset State
    const [customBg, setCustomBg] = useState<string>('');
    const [customHeader, setCustomHeader] = useState<string>('');
    const [customFooter, setCustomFooter] = useState<string>('');

    const templates: { id: TemplateId; name: string; colors: any; isPremium?: boolean }[] = [
        { id: 'classic', name: 'Classic', colors: { bg: 'bg-white', accent: 'bg-gray-700', text: 'bg-gray-400' }, isPremium: false },
        { id: 'modern', name: 'Modern', colors: { bg: 'bg-white', accent: 'bg-blue-500', text: 'bg-gray-400' }, isPremium: true },
        { id: 'bold', name: 'Bold', colors: { bg: 'bg-gray-800', accent: 'bg-yellow-400', text: 'bg-gray-500' }, isPremium: true },
        { id: 'elegant', name: 'Elegant', colors: { bg: 'bg-rose-50', accent: 'bg-rose-800', text: 'bg-rose-300' }, isPremium: true },
        { id: 'minimalist', name: 'Minimalist', colors: { bg: 'bg-gray-100', accent: 'bg-gray-400', text: 'bg-gray-300' }, isPremium: true },
    ];

    const handleApplyCustom = () => {
        onSelectTemplate('custom', {
            bg: customType === 'full' ? customBg : undefined,
            header: customType === 'parts' ? customHeader : undefined,
            footer: customType === 'parts' ? customFooter : undefined
        });
        setView('list');
        onClose();
    };

    const handleTemplateClick = (template: typeof templates[0]) => {
        onSelectTemplate(template.id);
    };

    const handleCustomClick = () => {
        setView('custom_setup');
    }

    if (view === 'custom_setup') {
        return (
            <Modal isOpen={isOpen} onClose={() => setView('list')}>
                <div className="p-6 h-full flex flex-col">
                    <button onClick={() => setView('list')} className="flex items-center text-slate-500 hover:text-slate-800 mb-4 font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Templates
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Your Design</h2>
                    <p className="text-slate-600 mb-6">We will overlay your content on top of your design.</p>

                    <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                        <button 
                            onClick={() => setCustomType('full')} 
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${customType === 'full' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
                        >
                            Full A4 Background
                        </button>
                        <button 
                            onClick={() => setCustomType('parts')} 
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${customType === 'parts' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
                        >
                            Header & Footer
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto">
                        {customType === 'full' ? (
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start space-x-3 mb-4">
                                    <Layout className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-bold">Full Page Mode</p>
                                        <p>Upload a single A4 image (210mm x 297mm). We will print the invoice data directly on top of this image.</p>
                                    </div>
                                </div>
                                <FileUploader label="Upload A4 Background (PNG/JPG)" onFileLoad={setCustomBg} initialPreview={customBg} />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                 <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start space-x-3 mb-4">
                                    <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-bold">Header & Footer Mode</p>
                                        <p>Upload separate images for the top and bottom of the page. Content will be placed in between.</p>
                                    </div>
                                </div>
                                <FileUploader label="Header Image" onFileLoad={setCustomHeader} initialPreview={customHeader} />
                                <FileUploader label="Footer Image" onFileLoad={setCustomFooter} initialPreview={customFooter} />
                            </div>
                        )}
                    </div>

                    <div className="pt-6 mt-auto">
                        <button 
                            onClick={handleApplyCustom} 
                            disabled={(customType === 'full' && !customBg) || (customType === 'parts' && (!customHeader && !customFooter))}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
                        >
                            Apply Custom Template
                        </button>
                    </div>
                </div>
            </Modal>
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col h-full max-h-[90vh] p-6">
                <div className="flex-shrink-0">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Choose a Template</h2>
                    <p className="text-slate-600 mb-6">Select a design for your invoices and quotations.</p>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Standard Templates */}
                        {templates.map(template => (
                            <div key={template.id} className="cursor-pointer group relative" onClick={() => handleTemplateClick(template)}>
                                <div className={`relative p-2 rounded-xl transition-all duration-300 ${currentTemplate === template.id ? 'bg-blue-500 shadow-lg' : 'bg-slate-200 hover:bg-slate-300'}`}>
                                    <TemplatePreview name={template.name} colors={template.colors} />
                                    {currentTemplate === template.id && (
                                        <div className="absolute top-4 right-4 bg-white text-blue-600 rounded-full p-1 z-10">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-center font-semibold mt-3 text-slate-700 flex items-center justify-center">
                                    {template.name}
                                </h3>
                            </div>
                        ))}
                        
                        {/* Custom Template Card */}
                        <div className="cursor-pointer group relative" onClick={handleCustomClick}>
                            <div className={`relative p-2 rounded-xl transition-all duration-300 ${currentTemplate === 'custom' ? 'bg-purple-500 shadow-lg' : 'bg-slate-200 hover:bg-slate-300'}`}>
                               <div className="w-full h-48 rounded-lg shadow-md p-3 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300">
                                    <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                                    <span className="font-semibold text-slate-500">Upload Your Own</span>
                                    <span className="text-xs text-slate-400 mt-1">Full Page or Header/Footer</span>
                               </div>
                               {currentTemplate === 'custom' && (
                                    <div className="absolute top-4 right-4 bg-white text-purple-600 rounded-full p-1 z-10">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-center font-semibold mt-3 text-slate-700 flex items-center justify-center">
                                Custom Design
                            </h3>
                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default TemplateSelectorModal;
