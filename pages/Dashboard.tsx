
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import type { Invoice, Client, CatalogItem, UserProfile } from '../types';
import type { Page } from '../App';
import { 
    Plus, Edit, Trash2, Download, Loader2, Share2, 
    Folder, List, FileText, Wallet, Package, Users,
    Search, LayoutGrid, CornerUpLeft, X, Lock, ExternalLink, Camera as CameraIcon
} from 'lucide-react';
import GettingStartedGuide from '../components/GettingStartedGuide';
import InvoicePreview from '../components/InvoicePreview';
import ShareModal from '../components/ShareModal';
import Modal from '../components/Modal';
import { formatNumber } from '../utils/format';

// Compact form components for the dashboard view
const ClientForm: React.FC<{ onSave: (client: Client) => void; initialData?: Client | null, onCancel: () => void }> = ({ onSave, initialData, onCancel }) => {
    const [client, setClient] = useState<Client>(initialData || { id: '', name: '', companyName: '', tin: '', phone: '', email: '', address: '', tags: [] });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setClient({ ...client, [e.target.name]: e.target.value });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...client, id: client.id || Date.now().toString() }); };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{initialData ? 'Edit Client' : 'Add New Client'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" placeholder="Contact Person" value={client.name} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                <input name="companyName" placeholder="Company Name" value={client.companyName} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                <input name="email" placeholder="Email" value={client.email} onChange={handleChange} type="email" className="w-full p-2 border rounded-md" required />
                <input name="phone" placeholder="Phone" value={client.phone} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                <input name="tin" placeholder="TIN Number" value={client.tin} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <textarea name="address" placeholder="Address" value={client.address} onChange={handleChange} className="w-full p-2 border rounded-md"></textarea>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Client</button>
            </div>
        </form>
    );
};

const CatalogItemForm: React.FC<{ onSave: (item: CatalogItem) => void; initialData?: CatalogItem | null, onCancel: () => void }> = ({ onSave, initialData, onCancel }) => {
    const [item, setItem] = useState<CatalogItem>(initialData || { id: '', name: '', description: '', unitPrice: 0, type: 'service', unitType: 'item' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: name === 'unitPrice' ? parseFloat(value) : value });
    };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...item, id: item.id || Date.now().toString() }); };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{initialData ? 'Edit Item' : 'Add Catalog Item'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" placeholder="Item Name" value={item.name} onChange={handleChange} className="w-full p-2 border rounded-md" required />
              <select name="type" value={item.type} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="service">Service</option>
                <option value="product">Product</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="unitPrice" placeholder="Unit Price" value={item.unitPrice} onChange={handleChange} type="number" step="0.01" className="w-full p-2 border rounded-md" required />
              <input name="unitType" placeholder="Unit (e.g., hr, pcs)" value={item.unitType} onChange={handleChange} className="w-full p-2 border rounded-md" required />
            </div>
            <textarea name="description" placeholder="Description" value={item.description} onChange={handleChange} className="w-full p-2 border rounded-md"></textarea>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Item</button>
            </div>
        </form>
    );
};

interface DashboardProps {
  invoices: Invoice[];
  clients: Client[];
  catalog: CatalogItem[];
  profile: UserProfile;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onGoHome: () => void;
  onNavigate: (page: Page) => void;
  onScan?: () => void;
  showProWalkthrough?: boolean;
  onCloseWalkthrough?: () => void;
  isPro?: boolean;
  onTriggerPro?: () => void;
  onSaveClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onSaveCatalogItem: (item: CatalogItem) => void;
  onDeleteCatalogItem: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    invoices, clients, catalog, onEdit, onDelete, onCreate, onGoHome, onNavigate, onScan,
    profile, showProWalkthrough, onCloseWalkthrough, isPro = false, onTriggerPro,
    onSaveClient, onDeleteClient, onSaveCatalogItem, onDeleteCatalogItem
}) => {
  const [isProcessingPdf, setIsProcessingPdf] = useState<string | null>(null);
  const [shareModalData, setShareModalData] = useState<{ invoice: Invoice, message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Navigation States
  const [viewMode, setViewMode] = useState<'list' | 'folder' | 'clients' | 'catalog'>('list');
  const [activeClientFolder, setActiveClientFolder] = useState<string | null>(null);
  const [activeInvoiceHistory, setActiveInvoiceHistory] = useState<string | null>(null);

  // Forms Modals
  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [isCatalogModalOpen, setCatalogModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);

  const currency = profile.currency || 'ETB';

  const latestInvoices = invoices.filter(inv => !inv.isBackup);
  const totalPaid = latestInvoices
    .filter(i => i.status === 'paid' || i.status === 'accepted')
    .reduce((sum, i) => sum + (i.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)), 0);
    
  const totalPending = latestInvoices
    .filter(i => i.status === 'pending' || i.status === 'draft')
    .reduce((sum, i) => sum + (i.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)), 0);

  // --- Robust PDF Generation ---
  const generatePdfBlob = async (invoice: Invoice): Promise<Blob | null> => {
    // 1. Prepare Paged Content
    // INCREASED ITEM LIMIT PER PAGE FROM 6 TO 11
    const ITEMS_PER_PAGE = 11; 
    const displayItems: any[] = [];
    const processedGroups = new Set<string>();

    invoice.items.forEach(item => {
        if (item.groupId && invoice.groups) {
            const groupConfig = invoice.groups.find(g => g.id === item.groupId);
            if (groupConfig && !groupConfig.showBreakdown) {
                if (!processedGroups.has(item.groupId)) {
                    const groupItems = invoice.items.filter(i => i.groupId === item.groupId);
                    const groupTotal = groupItems.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);
                    displayItems.push({ id: item.groupId, name: `${item.groupName} (Package)`, description: 'Package items', quantity: 1, unitPrice: groupTotal });
                    processedGroups.add(item.groupId);
                }
                return;
            }
        }
        displayItems.push(item);
    });

    const pages: any[][] = [];
    if (displayItems.length === 0) pages.push([]);
    else {
        for (let i = 0; i < displayItems.length; i += ITEMS_PER_PAGE) {
            pages.push(displayItems.slice(i, i + ITEMS_PER_PAGE));
        }
    }

    // 2. Render to Hidden Container
    const container = document.createElement('div');
    container.style.position = 'fixed'; container.style.left = '-9999px'; container.style.top = '0';
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);
    root.render(
        <div className="pdf-export-wrapper">
            {pages.map((pageItems, index) => (
                <div key={index} id={`dash-pdf-page-${index}`} style={{ width: '210mm', height: '297mm', backgroundColor: 'white', overflow: 'hidden' }}>
                    <InvoicePreview 
                        invoice={invoice} profile={profile} itemsOverride={pageItems} 
                        isLastPage={index === pages.length - 1} pageNumber={index + 1} totalPages={pages.length}
                    />
                </div>
            ))}
        </div>
    );

    return new Promise<Blob | null>((resolve) => {
        setTimeout(async () => {
            try {
                const { jsPDF } = (window as any).jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                for (let i = 0; i < pages.length; i++) {
                    const pageEl = document.getElementById(`dash-pdf-page-${i}`);
                    if (!pageEl) continue;
                    const canvas = await (window as any).html2canvas(pageEl, { scale: 2, useCORS: true, windowWidth: 800, height: 1123, width: 794 });
                    const imgData = canvas.toDataURL('image/jpeg', 0.9);
                    if (i > 0) pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
                }
                resolve(pdf.output('blob'));
            } catch (e) { resolve(null); } 
            finally { root.unmount(); if(document.body.contains(container)) document.body.removeChild(container); }
        }, 1500);
    });
  };

  const handleDownloadPdf = async (invoice: Invoice) => {
    setIsProcessingPdf(invoice.id);
    const blob = await generatePdfBlob(invoice);
    if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${invoice.isQuotation ? 'Quotation' : 'Invoice'}-${invoice.invoiceNumber}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    }
    setIsProcessingPdf(null);
  };

  const handleShare = async (invoice: Invoice) => {
    setIsProcessingPdf(invoice.id);
    const blob = await generatePdfBlob(invoice);
    if (blob) {
        const fileName = `${invoice.isQuotation ? 'Quotation' : 'Invoice'}-${invoice.invoiceNumber}.pdf`;
        const file = new File([blob], fileName, { type: 'application/pdf' });
        const message = `${invoice.isQuotation ? 'Quotation' : 'Invoice'} ${invoice.invoiceNumber}\nShared via Proforma.et`;
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try { await navigator.share({ files: [file], title: fileName, text: message }); } catch (e) {}
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = fileName; a.click(); URL.revokeObjectURL(url);
            setShareModalData({ invoice, message });
        }
    }
    setIsProcessingPdf(null);
  };

  const clientFolders = clients.map(client => ({
      client, count: latestInvoices.filter(inv => inv.client.id === client.id).length, 
      invoices: latestInvoices.filter(inv => inv.client.id === client.id)
  })).filter(f => f.count > 0);

  // --- Tab Contents Logic ---
  let content;
  let viewTitle = "";
  
  const filteredInvoices = latestInvoices.filter(inv => 
    inv.client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClients = clients.filter(c => 
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCatalog = catalog.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (activeInvoiceHistory) {
      const history = invoices.filter(i => i.parentId === activeInvoiceHistory || i.id === activeInvoiceHistory).sort((a,b) => b.revision - a.revision);
      content = history.map(inv => <InvoiceRow key={inv.id} invoice={inv} />);
      viewTitle = "Version History";
  } else if (activeClientFolder) {
      const folder = clientFolders.find(f => f.client.id === activeClientFolder);
      content = folder?.invoices.map(inv => <InvoiceRow key={inv.id} invoice={inv} />);
      viewTitle = folder?.client.companyName || "Folder";
  } else {
      switch(viewMode) {
          case 'list':
              viewTitle = "Recent Activity";
              content = filteredInvoices.map(inv => <InvoiceRow key={inv.id} invoice={inv} />);
              break;
          case 'folder':
              viewTitle = "Folders";
              content = (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                    {clientFolders.map(folder => (
                        <div key={folder.client.id} onClick={() => setActiveClientFolder(folder.client.id)} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer flex flex-col items-center text-center transition-transform active:scale-95 group">
                            <Folder className="w-12 h-12 text-blue-200 mb-3 group-hover:text-blue-400 transition-colors" />
                            <h3 className="font-bold text-slate-800 line-clamp-1">{folder.client.companyName}</h3>
                            <p className="text-xs text-slate-500 mt-1">{folder.count} documents</p>
                        </div>
                    ))}
                </div>
              );
              break;
          case 'clients':
              viewTitle = "Client Directory";
              content = filteredClients.map(client => (
                <div key={client.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-3 flex justify-between items-center group">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">{client.companyName[0]}</div>
                        <div>
                            <h4 className="font-bold text-slate-800">{client.companyName}</h4>
                            <p className="text-xs text-slate-500">{client.name} • {client.phone}</p>
                        </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingData(client); setClientModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4"/></button>
                        <button onClick={() => onDeleteClient(client.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                    </div>
                </div>
              ));
              break;
          case 'catalog':
              viewTitle = "Product Catalog";
              content = filteredCatalog.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-3 flex justify-between items-center group">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><Package className="w-5 h-5"/></div>
                        <div>
                            <h4 className="font-bold text-slate-800">{item.name}</h4>
                            <p className="text-xs text-slate-500 line-clamp-1">{item.description || 'No description'}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-bold text-slate-900">{currency} {formatNumber(item.unitPrice)}</span>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingData(item); setCatalogModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4"/></button>
                            <button onClick={() => onDeleteCatalogItem(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        </div>
                    </div>
                </div>
              ));
              break;
      }
  }

  function InvoiceRow({ invoice }: { invoice: Invoice }) {
      const subtotal = invoice.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
      const vat = subtotal * (invoice.vatRate / 100);
      const total = subtotal + vat - (invoice.discount.type === 'percentage' ? (subtotal + vat) * (invoice.discount.value/100) : invoice.discount.value);
      const isProcessing = isProcessingPdf === invoice.id;
      return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-3 relative overflow-hidden group">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${invoice.status === 'paid' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            <div className="pl-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-slate-800">{invoice.client.companyName}</h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${invoice.status === 'paid' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>{invoice.status || 'draft'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span className="font-mono text-slate-500">{invoice.invoiceNumber}</span>
                        <span>•</span>
                        <span>{invoice.date}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Total</p>
                        <p className="text-lg font-bold text-slate-900">{currency} {formatNumber(total)}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => handleShare(invoice)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors">{isProcessing ? <Loader2 className="animate-spin w-5 h-5"/> : <Share2 className="w-5 h-5"/>}</button>
                        <button onClick={() => handleDownloadPdf(invoice)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors"><Download className="w-5 h-5"/></button>
                        <button onClick={() => onEdit(invoice)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"><Edit className="w-5 h-5"/></button>
                        <button onClick={() => onDelete(invoice.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-5 h-5"/></button>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-6 pb-20 relative">
      {/* 1. Header */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">Welcome, {profile.businessName}</p>
        </div>
        <div className="hidden md:flex items-center space-x-3">
            <button onClick={onScan} className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-transform active:scale-95">
                <CameraIcon className="w-5 h-5" /> <span>Scan & Create</span>
            </button>
            <button onClick={onCreate} className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-transform active:scale-95">
                <Plus className="w-5 h-5" /> <span>New Invoice</span>
            </button>
        </div>
      </div>

      {invoices.length === 0 ? (
        <GettingStartedGuide onNavigate={onNavigate} onCreate={onCreate} clients={clients} catalog={catalog} />
      ) : (
        <>
            {/* 2. Stats */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 flex-1">
                    <div className="p-3 rounded-full bg-emerald-100 text-emerald-600"><Wallet className="w-6 h-6"/></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Paid/Accepted</p><p className="text-lg font-bold text-slate-800">{currency} {formatNumber(totalPaid)}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 flex-1">
                    <div className="p-3 rounded-full bg-amber-100 text-amber-600"><FileText className="w-6 h-6"/></div>
                    <div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Draft/Pending</p><p className="text-lg font-bold text-slate-800">{currency} {formatNumber(totalPending)}</p></div>
                </div>
            </div>

            {/* 3. Search & Tabs Hub */}
            <div className="mt-8 bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Horizontal Selector (The Content Hub) */}
                        <div className="flex bg-slate-200/60 p-1 rounded-xl w-max">
                            {[
                                { id: 'list', label: 'Activity', icon: List },
                                { id: 'folder', label: 'Folders', icon: Folder, pro: true },
                                { id: 'clients', label: 'Clients', icon: Users },
                                { id: 'catalog', label: 'Catalog', icon: Package }
                            ].map(tab => (
                                <button 
                                    key={tab.id}
                                    onClick={() => {
                                        setViewMode(tab.id as any);
                                        setActiveClientFolder(null);
                                        setActiveInvoiceHistory(null);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center space-x-2 ${viewMode === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Integrated Search */}
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder={`Search ${viewMode}...`} 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center">
                            {(activeClientFolder || activeInvoiceHistory) && (
                                <button onClick={() => { setActiveClientFolder(null); setActiveInvoiceHistory(null); }} className="mr-3 p-1 text-slate-400 hover:text-blue-600"><CornerUpLeft className="w-5 h-5"/></button>
                            )}
                            {viewTitle}
                        </h2>
                        {viewMode === 'clients' && (
                            <button onClick={() => { setEditingData(null); setClientModalOpen(true); }} className="text-sm font-bold text-blue-600 flex items-center hover:underline"><Plus className="w-4 h-4 mr-1"/> Add Client</button>
                        )}
                        {viewMode === 'catalog' && (
                            <button onClick={() => { setEditingData(null); setCatalogModalOpen(true); }} className="text-sm font-bold text-blue-600 flex items-center hover:underline"><Plus className="w-4 h-4 mr-1"/> Add Item</button>
                        )}
                    </div>

                    <div className="animate-fade-in">
                        {content}
                        {(!content || (Array.isArray(content) && content.length === 0)) && (
                            <div className="text-center py-20">
                                <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400">No results found for "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
      )}

      {/* 4. Mobile FAB */}
      <div className="md:hidden fixed bottom-6 right-6 flex flex-col space-y-3 items-end z-40">
        <button onClick={onScan} className="w-12 h-12 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"><CameraIcon className="w-6 h-6"/></button>
        <button onClick={onCreate} className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"><Plus className="w-8 h-8"/></button>
      </div>

      {/* Modals */}
      {shareModalData && (
        <ShareModal 
            isOpen={!!shareModalData} 
            onClose={() => setShareModalData(null)} 
            invoice={shareModalData.invoice} 
            message={shareModalData.message} 
        />
      )}
      <Modal isOpen={isClientModalOpen} onClose={() => setClientModalOpen(false)}>
          <ClientForm onSave={(c) => { onSaveClient(c); setClientModalOpen(false); }} initialData={editingData} onCancel={() => setClientModalOpen(false)} />
      </Modal>
      <Modal isOpen={isCatalogModalOpen} onClose={() => setCatalogModalOpen(false)}>
          <CatalogItemForm onSave={(i) => { onSaveCatalogItem(i); setCatalogModalOpen(false); }} initialData={editingData} onCancel={() => setCatalogModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;
