
import React, { useState } from 'react';
import type { Invoice } from '../types';
import Modal from './Modal';
import { Mail, MessageCircle, Send, Copy, Check, Share2, Download } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice;
    message: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, invoice, message }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const encodedMessage = encodeURIComponent(message);
    const subject = encodeURIComponent(`${invoice.isQuotation ? 'Quotation' : 'Invoice'} ${invoice.invoiceNumber}`);

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            url: `https://wa.me/?text=${encodedMessage}`,
            color: 'bg-green-500 hover:bg-green-600',
            description: 'Send message'
        },
        {
            name: 'Telegram',
            icon: Send,
            url: `https://t.me/share/url?url=${encodeURIComponent('https://www.proforma.et')}&text=${encodedMessage}`,
            color: 'bg-blue-500 hover:bg-blue-600',
            description: 'Share text'
        },
        {
            name: 'Email',
            icon: Mail,
            url: `mailto:?subject=${subject}&body=${encodedMessage}`,
            color: 'bg-slate-500 hover:bg-slate-600',
            description: 'Send email'
        }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <Share2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Share Document</h2>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
                    <Download className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                        The PDF has been <strong>downloaded to your device</strong>. Please attach it manually when sharing via the apps below.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {shareLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex flex-col items-center justify-center p-4 rounded-xl text-white transition-all transform hover:scale-105 shadow-md ${link.color}`}
                        >
                            <link.icon className="w-8 h-8 mb-2" />
                            <span className="font-bold">{link.name}</span>
                            <span className="text-xs opacity-90">{link.description}</span>
                        </a>
                    ))}
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-700">Message to share</label>
                        <button 
                            onClick={handleCopy}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3 h-3" />
                                    <span>Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Text</span>
                                </>
                            )}
                        </button>
                    </div>
                    <p className="text-slate-600 text-sm bg-white p-3 rounded border border-slate-200">
                        {message}
                    </p>
                </div>
                
                <button 
                    onClick={onClose}
                    className="w-full mt-6 bg-slate-100 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default ShareModal;
