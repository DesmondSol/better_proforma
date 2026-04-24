
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import type { Invoice, InvoiceItem, Client, CatalogItem, UserProfile, BankAccount, InvoiceStatus, JobTemplate } from '../types';
import InvoicePreview from '../components/InvoicePreview';
import { formatNumber } from '../utils/format';
import { XCircle, Download, Save, Plus, ChevronDown, ChevronUp, Lock, Camera as CameraIcon } from 'lucide-react';
import { getTemplatesForJobType } from '../utils/proDefaults';
import Modal from '../components/Modal';
import OCRScanner from '../components/OCRScanner';
import { ExtractedInvoiceData } from '../services/ocrService';

interface InvoiceEditorProps {
    profile: UserProfile;
    clients: Client[];
    catalog: CatalogItem[];
    onSave: (invoice: Invoice) => void;
    initialInvoice: Invoice | null;
    onCancel: () => void;
    onNavigate?: (page: any) => void;
    userJobTemplates?: JobTemplate[];
    onTriggerPro?: () => void;
}

const INVOICE_LEGAL_TEXT = 'Payment is due within 15 days. Thank you for your business.';

const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ profile, clients, catalog, onSave, initialInvoice, onCancel, onNavigate, userJobTemplates = [], onTriggerPro }) => {
    const currency = profile.currency || 'ETB';
    const QUOTATION_LEGAL_TEXT = `This quotation is valid for 15 days. Thank you for your business.\nAll prices are in ${currency === 'ETB' ? 'Ethiopian Birr (ETB)' : currency}.`;

    const defaultInvoice: Invoice = {
        id: '',
        userProfileID: profile.id,
        client: clients[0] || { id: '', name: '', companyName: 'Select a Client', tin: '', phone: '', email: '', address: '', tags: [] },
        invoiceNumber: 'Not generated',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [],
        vatRate: 15,
        discount: { type: 'amount', value: 0 },
        legalText: QUOTATION_LEGAL_TEXT,
        isQuotation: true,
        includeStamp: true,
        includeSignature: true,
        revision: 1,
        language: profile.language || 'en',
        status: 'draft',
        groups: []
    };
    
    const [invoice, setInvoice] = useState<Invoice>(initialInvoice || defaultInvoice);
    const [showPreview, setShowPreview] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const [catalogSelection, setCatalogSelection] = useState('');
    const [templateSelection, setTemplateSelection] = useState('');
    const [manualNumbering, setManualNumbering] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    useEffect(() => {
        if(initialInvoice) {
            setInvoice(initialInvoice)
        }
    }, [initialInvoice])

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedClient = clients.find(c => c.id === e.target.value);
        if (selectedClient) {
            setInvoice({ ...invoice, client: selectedClient });
        }
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...invoice.items];
        // Ensure numeric fields are cleaned from NaN
        let finalValue = value;
        if (field === 'quantity' || field === 'unitPrice') {
            finalValue = typeof value === 'string' ? parseFloat(value) : value;
            if (isNaN(finalValue as number)) finalValue = 0;
        }
        (newItems[index] as any)[field] = finalValue;
        setInvoice({ ...invoice, items: newItems });
    };

    const addItemFromCatalog = (item: CatalogItem) => {
        const newItem: InvoiceItem = {
            id: Date.now().toString() + Math.random(),
            name: item.name,
            description: item.description,
            quantity: 1,
            unitPrice: item.unitPrice,
        };
        setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
    };

    const effectiveJobTypes = profile.jobTypes || (profile.jobType ? [profile.jobType] : undefined);
    const defaultTemplates = getTemplatesForJobType(effectiveJobTypes);
    
    const jobTemplates = [
        ...userJobTemplates,
        ...defaultTemplates
    ].filter(t => {
        if (userJobTemplates.some(ut => ut.id === t.id)) return true;
        if (!effectiveJobTypes || effectiveJobTypes.length === 0) return true;
        return effectiveJobTypes.includes(t.category);
    });

    const addJobTemplate = (templateId: string) => {
        const template = jobTemplates.find(t => t.id === templateId);
        if (!template) return;

        const groupId = Date.now().toString();
        const newGroup = { id: groupId, name: template.name, showBreakdown: true, total: 0 };
        const newItems = template.items.map(item => ({
            id: Date.now().toString() + Math.random(),
            name: item.name,
            description: item.description,
            quantity: 1,
            unitPrice: item.unitPrice,
            groupId: groupId,
            groupName: template.name
        }));

        setInvoice(prev => ({
            ...prev,
            items: [...prev.items, ...newItems],
            groups: [...(prev.groups || []), newGroup]
        }));
    };

    const handleDataExtracted = (data: ExtractedInvoiceData) => {
        const newItems: InvoiceItem[] = (data.items || []).map(item => ({
            id: Date.now().toString() + Math.random(),
            name: item.name || 'Unnamed Item',
            description: item.description || '',
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
        }));

        let matchedClient = invoice.client;
        if (data.client?.companyName) {
            const existing = clients.find(c => 
                c.companyName.toLowerCase().includes(data.client!.companyName!.toLowerCase()) ||
                data.client!.companyName!.toLowerCase().includes(c.companyName.toLowerCase())
            );
            if (existing) {
                matchedClient = existing;
            } else {
                // Create a temporary client object
                matchedClient = {
                    id: 'temp-' + Date.now(),
                    name: data.client.name || '',
                    companyName: data.client.companyName || '',
                    tin: data.client.tin || '',
                    phone: data.client.phone || '',
                    email: data.client.email || '',
                    address: data.client.address || '',
                    tags: []
                };
            }
        }

        setInvoice(prev => ({
            ...prev,
            client: matchedClient,
            items: [...prev.items, ...newItems],
            invoiceNumber: data.invoiceNumber || prev.invoiceNumber,
            date: data.date || prev.date,
            vatRate: data.vatRate || prev.vatRate,
            isQuotation: data.isQuotation !== undefined ? data.isQuotation : prev.isQuotation,
        }));
        setIsScannerOpen(false);
    };
    
    const toggleGroupVisibility = (groupId: string) => {
        const groups = invoice.groups || [];
        const index = groups.findIndex(g => g.id === groupId);
        if (index > -1) {
            const newGroups = [...groups];
            newGroups[index] = { ...newGroups[index], showBreakdown: !newGroups[index].showBreakdown };
            setInvoice(prev => ({ ...prev, groups: newGroups }));
        }
    };

    const addCustomItem = () => {
        const newItem: InvoiceItem = { id: Date.now().toString(), name: '', description: '', quantity: 1, unitPrice: 0 };
        setInvoice({ ...invoice, items: [...invoice.items, newItem] });
    };
    
    const removeItem = (index: number) => {
        setInvoice({ ...invoice, items: invoice.items.filter((_, i) => i !== index) });
    };
    
    const generatePdf = async () => {
        if (typeof (window as any).html2canvas === 'undefined' || typeof (window as any).jspdf === 'undefined') {
            alert("PDF generation libraries are still loading. Please wait a moment.");
            return;
        }

        const displayItems: InvoiceItem[] = [];
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

        // Adjusting items per page for the new spacious modern layout
        const ITEMS_PER_PAGE = 6;
        const pages: InvoiceItem[][] = [];
        if (displayItems.length === 0) pages.push([]);
        else {
            for (let i = 0; i < displayItems.length; i += ITEMS_PER_PAGE) {
                pages.push(displayItems.slice(i, i + ITEMS_PER_PAGE));
            }
        }

        const container = document.createElement('div');
        container.style.position = 'fixed'; container.style.top = '0'; container.style.left = '-9999px';
        document.body.appendChild(container);

        const root = createRoot(container);
        root.render(
            <div className="pdf-export-wrapper">
                {pages.map((pageItems, index) => (
                    <div key={index} id={`pdf-page-${index}`} style={{ width: '210mm', height: '297mm', backgroundColor: 'white', overflow: 'hidden' }}>
                        <InvoicePreview 
                            invoice={invoice} profile={profile} itemsOverride={pageItems}
                            isLastPage={index === pages.length - 1} pageNumber={index + 1} totalPages={pages.length}
                        />
                    </div>
                ))}
            </div>
        );

        setTimeout(async () => {
            try {
                const { jsPDF } = (window as any).jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                for (let i = 0; i < pages.length; i++) {
                    const pageElement = document.getElementById(`pdf-page-${i}`);
                    if (!pageElement) continue;
                    const canvas = await (window as any).html2canvas(pageElement, {
                        scale: 2, useCORS: true, logging: false, windowWidth: 800, height: 1123, width: 794
                    });
                    const imgData = canvas.toDataURL('image/jpeg', 0.9);
                    if (i > 0) pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
                }
                const fileName = `${invoice.isQuotation ? 'Quotation' : 'Invoice'}-${invoice.invoiceNumber}.pdf`;
                pdf.save(fileName);
            } catch (err) {
                console.error(err); alert("Failed to generate PDF.");
            } finally {
                setTimeout(() => { root.unmount(); if(document.body.contains(container)) document.body.removeChild(container); }, 100);
            }
        }, 1800);
    };

    const subtotal = invoice.items.reduce((acc, item) => {
        const q = parseFloat(item.quantity as any) || 0;
        const p = parseFloat(item.unitPrice as any) || 0;
        return acc + (q * p);
    }, 0);
    
    const vatAmount = subtotal * (invoice.vatRate / 100);
    const totalBeforeDiscount = subtotal + vatAmount;
    const discountAmount = invoice.discount.type === 'percentage' 
        ? totalBeforeDiscount * (invoice.discount.value / 100)
        : invoice.discount.value;
    const total = totalBeforeDiscount - discountAmount;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-4xl font-bold text-slate-800 font-sans">{initialInvoice ? 'Edit' : 'Create'} {invoice.isQuotation ? 'Quotation' : 'Invoice'}</h1>
                 <div className="flex items-center space-x-2 relative group">
                     <span className="text-sm font-bold text-slate-600">Status:</span>
                     <div className="relative">
                        <select 
                            value={invoice.status || 'draft'} 
                            onChange={(e) => setInvoice({...invoice, status: e.target.value as InvoiceStatus})}
                            className="bg-white border border-slate-300 rounded-md px-2 py-1 text-sm font-semibold capitalize"
                        >
                             {['draft', 'pending', 'accepted', 'failed', 'processing', 'paid'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>
                 </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-slate-200 p-1 rounded-full w-max">
                    <button onClick={() => setInvoice({...invoice, isQuotation: false, legalText: INVOICE_LEGAL_TEXT})} className={`px-4 py-1 rounded-full text-sm font-semibold ${!invoice.isQuotation ? 'bg-white text-blue-600 shadow' : 'text-slate-600'}`}>Invoice</button>
                    <button onClick={() => setInvoice({...invoice, isQuotation: true, legalText: QUOTATION_LEGAL_TEXT})} className={`px-4 py-1 rounded-full text-sm font-semibold ${invoice.isQuotation ? 'bg-white text-blue-600 shadow' : 'text-slate-600'}`}>Quotation</button>
                </div>
                
                <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
                    <span className="text-xs font-bold text-slate-500 ml-2">Language:</span>
                    <select 
                        value={invoice.language || 'en'} 
                        onChange={(e) => setInvoice({...invoice, language: e.target.value as any})}
                        className="bg-transparent text-sm font-semibold text-slate-700 outline-none pr-2"
                    >
                        <option value="en">English</option>
                        <option value="am">Amharic</option>
                    </select>
                </div>
            </div>

            <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <CameraIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-lg">Scan Physical Proforma</p>
                        <p className="text-xs text-blue-100">Auto-fill this form using Gemini AI OCR</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsScannerOpen(true)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm"
                >
                    Start Scan
                </button>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-slate-700">Client</label>
                        <button 
                            type="button"
                            onClick={() => onNavigate?.('clients')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center bg-blue-50 px-2 py-1 rounded-md transition-colors"
                        >
                            <Plus className="w-3 h-3 mr-1" />
                            {clients.length === 0 ? 'Create First Client' : 'New Client'}
                        </button>
                    </div>
                    <select 
                        value={invoice.client.id} 
                        onChange={handleClientChange} 
                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition-all ${clients.length === 0 ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white text-slate-800 border-slate-300'}`}
                    >
                        {clients.length === 0 ? (
                            <option value="">⚠️ No clients added yet</option>
                        ) : (
                            <>
                                <option value="">Select a client</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                            </>
                        )}
                    </select>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Invoice #</label>
                        {(manualNumbering || !invoice.id) ? (
                             <input type="text" value={invoice.invoiceNumber} onChange={e => setInvoice({ ...invoice, invoiceNumber: e.target.value })} className="mt-1 block w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md" />
                        ) : (
                            <div className="mt-1 p-2 bg-slate-100 text-slate-600 rounded-md flex justify-between items-center relative">
                                <span>{invoice.invoiceNumber}</span>
                                <button onClick={() => setManualNumbering(true)} className="text-xs text-blue-600 hover:underline flex items-center">
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Date</label>
                        <input type="date" value={invoice.date} onChange={e => setInvoice({ ...invoice, date: e.target.value })} className="mt-1 block w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md" />
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-700">Items</h2>
                    {jobTemplates.length > 0 && (
                        <div className="flex space-x-2 relative">
                            <select value={templateSelection} onChange={e => { if(e.target.value) { addJobTemplate(e.target.value); setTemplateSelection(''); } }} className="text-sm border border-blue-300 rounded-md px-2 py-1 bg-blue-50 text-blue-700">
                                <option value="">+ Add Job Template</option>
                                {jobTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2 font-semibold text-slate-600">Item</th>
                                <th className="text-left p-2 font-semibold text-slate-600 w-24">Qty</th>
                                <th className="text-left p-2 font-semibold text-slate-600 w-32">Price</th>
                                <th className="text-left p-2 font-semibold text-slate-600 w-32">Total</th>
                                <th className="w-12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => {
                                const q = parseFloat(item.quantity as any) || 0;
                                const p = parseFloat(item.unitPrice as any) || 0;
                                return (
                                    <tr key={item.id} className="border-b border-slate-100 align-top">
                                        <td className="p-2">
                                            {item.groupId && (index === 0 || invoice.items[index - 1].groupId !== item.groupId) && (
                                                <div className="flex items-center space-x-2 mb-2 bg-slate-100 p-1 rounded">
                                                     <span className="text-xs font-bold text-slate-500 uppercase">{item.groupName}</span>
                                                     <button onClick={() => toggleGroupVisibility(item.groupId!)} className="text-xs text-blue-600 hover:underline">
                                                         {invoice.groups?.find(g => g.id === item.groupId)?.showBreakdown ? 'Hide Breakdown' : 'Show Breakdown'} in PDF
                                                     </button>
                                                </div>
                                            )}
                                            <input type="text" value={item.name} onChange={e => handleItemChange(index, 'name', e.target.value)} className="w-full p-1 bg-white text-slate-800 border border-slate-300 rounded-md" placeholder="Item Name"/>
                                            <textarea value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="w-full p-1 bg-white text-slate-800 border border-slate-300 rounded-md mt-1 text-sm" placeholder="Description" rows={1}></textarea>
                                        </td>
                                        <td className="p-2 pt-6"><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-full p-1 bg-white border border-slate-300 rounded-md"/></td>
                                        <td className="p-2 pt-6"><input type="number" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full p-1 bg-white border border-slate-300 rounded-md"/></td>
                                        <td className="p-2 text-slate-800 font-semibold pt-8">{currency} {formatNumber(q * p)}</td>
                                        <td className="p-2 text-center pt-8"><button onClick={() => removeItem(index)} className="text-red-500"><XCircle className="w-5 h-5"/></button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden space-y-4">
                    {invoice.items.map((item, index) => {
                        const q = parseFloat(item.quantity as any) || 0;
                        const p = parseFloat(item.unitPrice as any) || 0;
                        return (
                            <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 relative">
                                <button onClick={() => removeItem(index)} className="absolute top-2 right-2 text-red-500"><XCircle className="w-5 h-5"/></button>
                                {item.groupId && (index === 0 || invoice.items[index - 1].groupId !== item.groupId) && (
                                    <div className="flex flex-wrap items-center justify-between mb-2 bg-blue-50 p-2 rounded gap-2">
                                        <span className="text-blue-700 text-xs font-bold">{item.groupName}</span>
                                        <button onClick={() => toggleGroupVisibility(item.groupId!)} className="text-xs text-blue-600 underline">Toggle Breakdown</button>
                                    </div>
                                )}
                                <div className="mb-3 pr-8"><label className="block text-xs font-semibold text-slate-500 mb-1">Item Name</label><input type="text" value={item.name} onChange={e => handleItemChange(index, 'name', e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm" /></div>
                                <div className="mb-3"><label className="block text-xs font-semibold text-slate-500 mb-1">Description</label><textarea value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm" rows={2}></textarea></div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div><label className="block text-xs font-semibold text-slate-500 mb-1">Qty</label><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm" /></div>
                                    <div><label className="block text-xs font-semibold text-slate-500 mb-1">Price</label><input type="number" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm" /></div>
                                    <div><label className="block text-xs font-semibold text-slate-500 mb-1">Total</label><div className="w-full p-2 bg-slate-100 border border-slate-200 rounded-md text-sm font-bold h-[38px] flex items-center">{formatNumber(q * p)}</div></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={addCustomItem} className="px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 flex items-center"><Plus className="w-4 h-4 mr-1"/> Custom Item</button>
                    <select value={catalogSelection} onChange={(e) => { if (e.target.value) { const item = catalog.find(i => i.id === e.target.value); if (item) addItemFromCatalog(item); setCatalogSelection(''); } }} className="px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 border-none outline-none">
                        <option value="">Add from Catalog</option>
                        {catalog.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-md md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 text-slate-700">Settings & Payment</h2>
                    {profile.bankAccounts?.length > 0 && (
                        <div className="mb-4 relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">Payment Account</label>
                            <select value={invoice.selectedBankAccountId || ''} onChange={(e) => setInvoice({ ...invoice, selectedBankAccountId: e.target.value })} className="w-full p-2 border border-slate-300 rounded-md">
                                <option value="">None / Hidden</option>
                                {profile.bankAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.bankName} - {acc.accountNumber}</option>)}
                            </select>
                        </div>
                    )}
                    <div><label className="block text-sm font-medium text-slate-700">Legal Text</label><textarea value={invoice.legalText} onChange={e => setInvoice({ ...invoice, legalText: e.target.value })} rows={3} className="mt-1 w-full p-2 border border-slate-300 rounded-md"></textarea></div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <div className="space-y-4">
                        <div className="flex justify-between"><span>Subtotal:</span><span>{currency} {formatNumber(subtotal)}</span></div>
                        <div className="flex justify-between items-center"><span>VAT:</span><div className="flex items-center"><input type="number" value={invoice.vatRate} onChange={e => setInvoice({...invoice, vatRate: parseFloat(e.target.value) || 0})} className="w-16 p-1 border border-slate-300 rounded-md text-right"/><span className="ml-1">%</span></div></div>
                        <div className="flex justify-between items-center"><span>Discount:</span><div className="flex items-center"><input type="number" value={invoice.discount.value} onChange={e => setInvoice({...invoice, discount: {...invoice.discount, value: parseFloat(e.target.value) || 0}})} className="w-20 p-1 border border-slate-300 rounded-md text-right"/><select value={invoice.discount.type} onChange={e => setInvoice({...invoice, discount: {...invoice.discount, type: e.target.value as any}})} className="ml-1 bg-white border border-slate-300 rounded-md"><option value="amount">{currency}</option><option value="percentage">%</option></select></div></div>
                        <div className="border-t pt-4 mt-4 font-bold text-xl flex justify-between"><span>Total:</span><span>{currency} {formatNumber(total)}</span></div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button onClick={onCancel} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button onClick={generatePdf} className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-2"><Download className="w-4 h-4"/><span>Download PDF</span></button>
                <button onClick={() => onSave(invoice)} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Save className="w-4 h-4"/><span>Save</span></button>
            </div>

            <Modal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)}>
                <OCRScanner onDataExtracted={handleDataExtracted} onClose={() => setIsScannerOpen(false)} />
            </Modal>
        </div>
    );
};

export default InvoiceEditor;
