
import React from 'react';
import type { Invoice, UserProfile, InvoiceItem } from '../types';
import { formatNumber } from '../utils/format';
import { translations, Language } from '../utils/translations';

interface InvoicePreviewProps {
    invoice: Invoice;
    profile: UserProfile;
    itemsOverride?: InvoiceItem[]; 
    isLastPage?: boolean;
    pageNumber?: number;
    totalPages?: number;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ 
    invoice, 
    profile, 
    itemsOverride, 
    isLastPage = true, 
    pageNumber, 
    totalPages 
}) => {
    // Defensive check
    if (!invoice) return <div className="p-8">Error: No invoice data</div>;

    const lang: Language = invoice.language || profile.language || 'en';
    const t = translations[lang];

    const subtotal = invoice.items.reduce((acc, item) => {
        const qty = parseFloat(item.quantity as any) || 0;
        const price = parseFloat(item.unitPrice as any) || 0;
        return acc + (qty * price);
    }, 0);
    
    const vatAmount = subtotal * (invoice.vatRate / 100);
    const totalBeforeDiscount = subtotal + vatAmount;
    const discountAmount = invoice.discount.type === 'percentage' 
        ? totalBeforeDiscount * (invoice.discount.value / 100)
        : invoice.discount.value;
    const total = totalBeforeDiscount - discountAmount;

    const templateId = profile.templateId || 'classic';
    const currency = profile.currency || 'ETB';
    const revisionSuffix = (invoice.revision && invoice.revision > 1) ? `-${invoice.revision}` : '';
    const displayInvoiceNumber = `${invoice.invoiceNumber}${revisionSuffix}`;

    const styles: Record<string, any> = {
        classic: {
            container: 'font-sans text-slate-800',
            header: 'text-slate-900',
            accentText: 'text-slate-900',
            tableHeaderBg: 'bg-slate-100 text-slate-900',
            borderStyle: 'border-slate-200'
        },
        modern: {
            container: 'font-sans text-slate-700',
            header: 'text-blue-700',
            accentText: 'text-blue-600',
            tableHeaderBg: 'bg-blue-600 text-white',
            borderStyle: 'border-blue-100',
            accentBg: 'bg-blue-50'
        },
        bold: {
            container: 'font-sans text-slate-800 text-lg',
            header: 'text-white',
            accentText: 'text-slate-900',
            tableHeaderBg: 'bg-slate-900 text-white',
            borderStyle: 'border-slate-300'
        },
        elegant: {
            container: 'font-serif text-slate-800',
            header: 'text-indigo-900',
            accentText: 'text-indigo-800',
            tableHeaderBg: 'bg-indigo-50 text-indigo-900',
            borderStyle: 'border-indigo-100'
        },
        minimalist: {
            container: 'font-mono text-slate-900 antialiased',
            header: 'text-black',
            accentText: 'text-black',
            tableHeaderBg: 'bg-white border-y-2 border-black',
            borderStyle: 'border-black'
        },
        custom: {
            container: 'font-sans text-slate-900',
            header: 'text-slate-900',
            accentText: 'text-slate-900',
            tableHeaderBg: 'bg-slate-100 text-slate-900',
            borderStyle: 'border-slate-200'
        }
    };

    const S = styles[templateId] || styles.classic;
    const selectedBank = profile.bankAccounts?.find(b => b.id === invoice.selectedBankAccountId);

    let displayItems: InvoiceItem[] = [];
    if (itemsOverride) {
        displayItems = itemsOverride;
    } else {
        const processedGroups = new Set<string>();
        invoice.items.forEach(item => {
            if (item.groupId && invoice.groups) {
                const groupConfig = invoice.groups.find(g => g.id === item.groupId);
                if (groupConfig && !groupConfig.showBreakdown) {
                    if (!processedGroups.has(item.groupId)) {
                         const groupItems = invoice.items.filter(i => i.groupId === item.groupId);
                         const groupTotal = groupItems.reduce((sum, i) => {
                             const q = parseFloat(i.quantity as any) || 0;
                             const p = parseFloat(i.unitPrice as any) || 0;
                             return sum + (q * p);
                         }, 0);
                         displayItems.push({ id: item.groupId, name: `${item.groupName} (Package)`, description: 'Package items', quantity: 1, unitPrice: groupTotal });
                         processedGroups.add(item.groupId);
                    }
                    return;
                }
            }
            displayItems.push(item);
        });
    }

    const isPdfMode = !!itemsOverride;

    return (
        <div 
            className={`relative bg-white ${S.container}`} 
            style={{ 
                fontFamily: templateId === 'minimalist' ? 'monospace' : 'Helvetica, Arial, sans-serif',
                width: isPdfMode ? '210mm' : '100%',
                height: isPdfMode ? '297mm' : 'auto',
                minHeight: isPdfMode ? '297mm' : '100%',
                overflow: 'hidden', boxSizing: 'border-box'
            }}
        >
            {templateId === 'custom' && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {profile.customBackgroundURL && <img src={profile.customBackgroundURL} alt="" className="w-full h-full object-cover" />}
                    <div className="flex flex-col h-full justify-between">
                        {profile.customHeaderURL && <img src={profile.customHeaderURL} alt="" className="w-full h-auto object-contain" />}
                        {profile.customFooterURL && <img src={profile.customFooterURL} alt="" className="w-full h-auto object-contain" />}
                    </div>
                </div>
            )}

            <div className={`relative z-10 p-10 h-full flex flex-col ${isPdfMode ? 'justify-start' : ''}`}>
                <header className={`flex justify-between items-center pb-4 border-b-2 ${S.borderStyle} mb-6 ${templateId === 'bold' ? 'bg-slate-900 p-10 -m-10 mb-10 text-white' : ''} ${templateId === 'custom' && (profile.customHeaderURL || profile.customBackgroundURL) ? 'border-transparent' : ''}`}>
                    <div className="flex items-center space-x-6">
                        {profile.logoURL && templateId !== 'custom' && <img src={profile.logoURL} alt="Logo" className={`h-16 w-auto ${templateId === 'bold' ? 'filter brightness-0 invert' : ''}`} />}
                        {templateId === 'custom' && !profile.customHeaderURL && profile.logoURL && <img src={profile.logoURL} alt="Logo" className="h-16 w-auto" />}
                        <div className="border-l-2 pl-6 py-1">
                            <h2 className="text-xl font-bold leading-none">{profile.businessName}</h2>
                            <p className="text-sm opacity-70 mt-1">{profile.tin ? `${t.tin}: ${profile.tin}` : ''}</p>
                        </div>
                    </div>
                        <div className="text-right">
                            <h1 className={`text-5xl font-black uppercase tracking-tighter leading-none ${S.header}`}>{invoice.isQuotation ? t.quotation : t.invoice}</h1>
                            <p className={`text-base font-bold mt-2 ${templateId === 'bold' ? 'text-slate-400' : 'text-slate-500'}`}>{t.reference}: {displayInvoiceNumber}</p>
                            {totalPages && totalPages > 1 && <p className="text-xs text-slate-400 mt-2 uppercase tracking-[0.2em] font-black">{t.page} {pageNumber} {t.of} {totalPages}</p>}
                        </div>
                </header>
                
                <div className="grid grid-cols-2 gap-8 mb-6">
                    <div className="space-y-4">
                        <div className={`${S.accentBg || 'bg-slate-50'} p-6 rounded-2xl border ${S.borderStyle}`}>
                            <h3 className={`font-black ${S.accentText} uppercase text-xs mb-3 tracking-widest`}>{t.billTo}</h3>
                            <p className="font-bold text-lg text-slate-900">{invoice.client.companyName}</p>
                            <div className="mt-2 text-sm text-slate-600 space-y-1">
                                <p>{invoice.client.address}</p>
                                <p>{invoice.client.email}</p>
                                <p>{invoice.client.phone}</p>
                                {invoice.client.tin && <p className="pt-2 font-semibold">{t.tin}: {invoice.client.tin}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="text-right space-y-4">
                            <div>
                                <h3 className={`font-black ${S.accentText} uppercase text-xs mb-1 tracking-widest`}>{t.date}</h3>
                                <p className="text-lg font-bold text-slate-800">{invoice.date}</p>
                            </div>
                            <div>
                                <h3 className={`font-black ${S.accentText} uppercase text-xs mb-1 tracking-widest`}>{t.dueDate}</h3>
                                <p className="text-lg font-bold text-slate-800">{invoice.dueDate}</p>
                            </div>
                        </div>
                        <div className="text-right pt-4 border-t border-slate-100">
                             <h3 className={`font-black ${S.accentText} uppercase text-xs mb-1 tracking-widest`}>{t.from}</h3>
                             <p className="text-sm font-medium text-slate-700">{profile.email} • {profile.phone}</p>
                             <p className="text-sm text-slate-500">{profile.address}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-grow relative">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`${S.tableHeaderBg} rounded-xl overflow-hidden`}>
                                <th className="p-4 font-black uppercase text-xs tracking-widest rounded-l-xl">{t.description}</th>
                                <th className="p-4 font-black uppercase text-xs tracking-widest text-center w-24">{t.quantity}</th>
                                <th className="p-4 font-black uppercase text-xs tracking-widest text-right w-32">{t.unitPrice}</th>
                                <th className="p-4 font-black uppercase text-xs tracking-widest text-right w-32 rounded-r-xl">{t.total}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {displayItems.map((item, index) => {
                                const qty = parseFloat(item.quantity as any) || 0;
                                const price = parseFloat(item.unitPrice as any) || 0;
                                return (
                                    <tr key={index} className="group transition-colors">
                                        <td className="py-4 px-4 align-top">
                                            <p className="font-bold text-slate-900 text-base">{item.name}</p>
                                            <p className="text-sm text-slate-500 mt-1 whitespace-pre-line leading-relaxed">{item.description}</p>
                                        </td>
                                        <td className="py-4 px-4 text-center align-top text-slate-700 font-medium">{qty}</td>
                                        <td className="py-4 px-4 text-right align-top text-slate-700 font-medium">{formatNumber(price)}</td>
                                        <td className="py-4 px-4 text-right align-top font-bold text-slate-900">{formatNumber(qty * price)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {!isLastPage && isPdfMode && (
                        <div className="mt-8 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold italic">Continue to next page...</p>
                        </div>
                    )}
                </div>

                {isLastPage && (
                    <div className={`pt-10 bg-white mt-auto`}>
                        <div className="grid grid-cols-2 gap-12 items-end mb-8">
                            <div className="space-y-6">
                                {selectedBank && (
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                        <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-3">{t.bankDetails}</h4>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900 text-sm italic">{selectedBank.bankName}</p>
                                            <div className="text-sm text-slate-700 flex justify-between">
                                                <span>{t.accName}:</span>
                                                <span className="font-bold">{selectedBank.accountName}</span>
                                            </div>
                                            <div className="text-sm text-slate-700 flex justify-between border-t border-slate-200 pt-1 mt-1">
                                                <span>{t.accNo}:</span>
                                                <span className="font-mono font-bold text-blue-700">{selectedBank.accountNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-2">{t.terms}</h4>
                                    <p className="text-xs text-slate-500 leading-normal">{invoice.legalText}</p>
                                </div>
                            </div>
                            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl transform scale-105 origin-bottom-right">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm opacity-70">
                                        <span>{t.subtotal}</span>
                                        <span className="font-bold">{formatNumber(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm opacity-70">
                                        <span>{t.tax} ({invoice.vatRate}%)</span>
                                        <span className="font-bold">{formatNumber(vatAmount)}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-sm text-green-400 font-bold">
                                            <span>{t.discount}</span>
                                            <span>-{formatNumber(discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-4 border-t border-white/20">
                                        <span className="text-lg font-black uppercase tracking-tight">{t.totalDue}</span>
                                        <span className="text-3xl font-black">{currency} {formatNumber(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t-2 border-slate-100">
                            <p className="text-xs text-slate-400 font-medium tracking-wide">Thank you for your business</p>
                            <div className="text-center min-w-[240px] relative">
                                <div className="h-20 flex items-center justify-center mb-2 relative">
                                    {invoice.includeSignature && profile.signatureURL && (
                                        <img 
                                            src={profile.signatureURL} 
                                            alt="Signature" 
                                            className="max-h-full w-auto object-contain z-10"
                                            style={{ filter: 'contrast(1.1) brightness(0.9)' }}
                                        />
                                    )}
                                    {invoice.includeStamp && profile.stampURL && (
                                        <img 
                                            src={profile.stampURL} 
                                            alt="Stamp" 
                                            className="absolute w-32 h-32 object-contain opacity-70"
                                            style={{ right: '10px', top: '-10px', mixBlendMode: 'multiply' }}
                                        />
                                    )}
                                </div>
                                <div className="border-t-2 border-slate-900 pt-2">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{t.signature}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Computer Generated</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={`text-center pt-4 border-t border-slate-50 ${isPdfMode ? 'absolute bottom-4 left-6 right-6' : 'mt-4'}`}><p className="text-[9px] text-slate-300 uppercase tracking-widest font-bold">Professional Documents by Proforma.et</p></div>
            </div>
        </div>
    );
};

export default InvoicePreview;
