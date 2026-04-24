
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { db } from './firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { UserProfile, Client, CatalogItem, Invoice, JobTemplate } from './types';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Contacts';
import Catalog from './pages/Catalog';
import Settings from './pages/Settings';
import InvoiceEditor from './pages/InvoiceEditor';
import Sidebar from './components/Sidebar';
import ProfileSetup from './pages/ProfileSetup';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import SubscriptionPage from './pages/SubscriptionPage';
import ProOnboardingModal from './components/ProOnboardingModal';
import Modal from './components/Modal';
import OCRScanner from './components/OCRScanner';
import { ExtractedInvoiceData } from './services/ocrService';
import { Menu, FileText, Loader2 } from 'lucide-react';

export type Page = 'dashboard' | 'invoices' | 'clients' | 'catalog' | 'settings' | 'new-invoice' | 'edit-invoice' | 'subscription';

const AuthenticatedApp: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  // Data States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [userJobTemplates, setUserJobTemplates] = useState<JobTemplate[]>([]);
  
  // UI States
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showProOnboarding, setShowProOnboarding] = useState(false);
  const [showProWalkthrough, setShowProWalkthrough] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // PWA Install State
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the saved prompt since it can't be used again
    setInstallPrompt(null);
  };

  // --- Firestore Subscriptions ---

  useEffect(() => {
    if (!currentUser) return;

    // 1. Profile Subscription
    const profileUnsub = onSnapshot(
      doc(db, 'users', currentUser.uid), 
      (doc) => {
        if (doc.exists()) {
          setProfile(doc.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setIsLoadingProfile(false);
      },
      (error) => {
        console.error("Error fetching profile:", error);
        setIsLoadingProfile(false);
      }
    );

    // 2. Clients Subscription
    const clientsUnsub = onSnapshot(
      collection(db, 'users', currentUser.uid, 'clients'), 
      (snapshot) => {
        const clientsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Client));
        setClients(clientsData);
      },
      (error) => {
        console.error("Error fetching clients:", error);
      }
    );

    // 3. Catalog Subscription
    const catalogUnsub = onSnapshot(
      collection(db, 'users', currentUser.uid, 'catalog'), 
      (snapshot) => {
        const catalogData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CatalogItem));
        setCatalog(catalogData);
      },
      (error) => {
        console.error("Error fetching catalog:", error);
      }
    );

    // 4. Invoices Subscription (Ordered by date)
    const q = query(collection(db, 'users', currentUser.uid, 'invoices'), orderBy('invoiceNumber', 'desc'));
    const invoicesUnsub = onSnapshot(
      q, 
      (snapshot) => {
        const invoicesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Invoice));
        setInvoices(invoicesData);
      },
      (error) => {
        console.error("Error fetching invoices:", error);
      }
    );

    // 5. Job Templates Subscription
    const templatesUnsub = onSnapshot(
      collection(db, 'users', currentUser.uid, 'jobTemplates'), 
      (snapshot) => {
        const templatesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as JobTemplate));
        setUserJobTemplates(templatesData);
      },
      (error) => {
        console.error("Error fetching templates:", error);
      }
    );

    return () => {
      profileUnsub();
      clientsUnsub();
      catalogUnsub();
      invoicesUnsub();
      templatesUnsub();
    };
  }, [currentUser]);

  // Force Pro state
  useEffect(() => {
    if (profile && !profile.isPro) {
      handleUpdateProfile({ ...profile, isPro: true, subscriptionStatus: 'active' });
    }
  }, [profile]);

  // --- Actions ---

  const handleSaveInvoice = async (invoice: Invoice) => {
    if (!currentUser) return;
    try {
      const sanitize = (obj: any) => JSON.parse(JSON.stringify(obj));
      if (invoice.id && invoices.some(i => i.id === invoice.id)) {
        const oldInvoice = invoices.find(i => i.id === invoice.id);
        if (oldInvoice) {
            const backupId = `${oldInvoice.id}_rev${oldInvoice.revision}`;
            const backupInvoice: Invoice = { ...oldInvoice, id: backupId, isBackup: true, parentId: oldInvoice.id };
            await setDoc(doc(db, 'users', currentUser.uid, 'invoices', backupId), sanitize(backupInvoice));
        }
        const currentRevision = invoice.revision || 1;
        const updatedInvoice = { ...invoice, revision: currentRevision + 1, isBackup: false, parentId: null };
        await setDoc(doc(db, 'users', currentUser.uid, 'invoices', invoice.id), sanitize(updatedInvoice));
      } else {
        const newInvoiceNumber = (invoices.filter(i => !i.isBackup).length + 1).toString().padStart(4, '0');
        const finalInvoice = { 
          ...invoice, 
          id: invoice.id || Date.now().toString(), 
          invoiceNumber: invoice.invoiceNumber === 'Not generated' ? `INV-${newInvoiceNumber}` : invoice.invoiceNumber,
          revision: 1,
          isBackup: false,
          parentId: null
        };
        await setDoc(doc(db, 'users', currentUser.uid, 'invoices', finalInvoice.id), sanitize(finalInvoice));
      }
      setCurrentPage('dashboard');
      setEditingInvoice(null);
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save invoice.");
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setCurrentPage('edit-invoice');
  };
  
  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!currentUser) return;
    try { await deleteDoc(doc(db, 'users', currentUser.uid, 'invoices', invoiceId)); } catch (error) {}
  };

  const handleUpdateProfile = async (newProfile: UserProfile) => {
    if (!currentUser) return;
    try { await setDoc(doc(db, 'users', currentUser.uid), newProfile); } catch (error) {}
  };

  const handleSaveClient = async (client: Client) => {
      if (!currentUser) return;
      try { await setDoc(doc(db, 'users', currentUser.uid, 'clients', client.id), client); } catch (error) {}
  };
  const handleDeleteClient = async (id: string) => {
      if (!currentUser) return;
      try { await deleteDoc(doc(db, 'users', currentUser.uid, 'clients', id)); } catch (error) {}
  };

  const handleSaveCatalogItem = async (item: CatalogItem) => {
      if (!currentUser) return;
      try { await setDoc(doc(db, 'users', currentUser.uid, 'catalog', item.id), item); } catch (error) {}
  };
  const handleDeleteCatalogItem = async (id: string) => {
      if (!currentUser) return;
      try { await deleteDoc(doc(db, 'users', currentUser.uid, 'catalog', id)); } catch (error) {}
  };
  
  const handleSaveJobTemplate = async (template: JobTemplate) => {
      if (!currentUser) return;
      try { await setDoc(doc(db, 'users', currentUser.uid, 'jobTemplates', template.id), template); } catch (error) {}
  };

  const handleDeleteJobTemplate = async (id: string) => {
      if (!currentUser) return;
      try { await deleteDoc(doc(db, 'users', currentUser.uid, 'jobTemplates', id)); } catch (error) {}
  };

  const activateProMode = async (jobTypes: string[]) => {
      if (!currentUser || !profile) return;
      const updatedProfile: UserProfile = {
      ...profile, isPro: true, subscriptionStatus: 'active', trialStartDate: new Date().toISOString(), jobTypes: jobTypes, jobType: jobTypes[0]
    };
      await handleUpdateProfile(updatedProfile);
      setShowProOnboarding(false);
      setShowProWalkthrough(true);
  };

  const triggerPro = () => {};

  const handleDataExtracted = (data: ExtractedInvoiceData) => {
    const newItems: InvoiceItem[] = (data.items || []).map(item => ({
      id: Date.now().toString() + Math.random(),
      name: item.name || 'Unnamed Item',
      description: item.description || '',
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
    }));

    let matchedClient: Client = clients[0] || { id: '', name: '', companyName: 'Select a Client', tin: '', phone: '', email: '', address: '', tags: [] };
    if (data.client?.companyName) {
      const existing = clients.find(c => 
        c.companyName.toLowerCase().includes(data.client!.companyName!.toLowerCase()) ||
        data.client!.companyName!.toLowerCase().includes(c.companyName.toLowerCase())
      );
      if (existing) {
        matchedClient = existing;
      } else {
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

    const currency = profile?.currency || 'ETB';
    const QUOTATION_LEGAL_TEXT = `This quotation is valid for 15 days. Thank you for your business.\nAll prices are in ${currency === 'ETB' ? 'Ethiopian Birr (ETB)' : currency}.`;

    const prefilledInvoice: Invoice = {
      id: '',
      userProfileID: profile!.id,
      client: matchedClient,
      invoiceNumber: data.invoiceNumber || 'Not generated',
      date: data.date || new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: newItems,
      vatRate: data.vatRate || 15,
      discount: { type: 'amount', value: 0 },
      legalText: QUOTATION_LEGAL_TEXT,
      isQuotation: data.isQuotation !== undefined ? data.isQuotation : true,
      includeStamp: true,
      includeSignature: true,
      revision: 1,
      status: 'draft',
      groups: []
    };

    setEditingInvoice(prefilledInvoice);
    setCurrentPage('new-invoice');
    setIsScannerOpen(false);
  };

  const renderPage = () => {
    const pageToRender = editingInvoice ? 'edit-invoice' : currentPage;

    switch (pageToRender) {
      case 'dashboard':
        return <Dashboard 
          profile={profile!}
          invoices={invoices}
          clients={clients}
          catalog={catalog} 
          onEdit={handleEditInvoice} 
          onDelete={handleDeleteInvoice}
          onCreate={() => setCurrentPage('new-invoice')}
          onGoHome={() => setCurrentPage('dashboard')} 
          onNavigate={setCurrentPage}
          showProWalkthrough={showProWalkthrough}
          onCloseWalkthrough={() => setShowProWalkthrough(false)}
          isPro={true}
          onTriggerPro={() => {}}
          onSaveClient={handleSaveClient}
          onDeleteClient={handleDeleteClient}
          onSaveCatalogItem={handleSaveCatalogItem}
          onDeleteCatalogItem={handleDeleteCatalogItem}
          onScan={() => setIsScannerOpen(true)}
          />;
      case 'clients':
        return <Clients clients={clients} onSave={handleSaveClient} onDelete={handleDeleteClient} onNavigate={setCurrentPage} />;
      case 'catalog':
        return <Catalog 
            catalog={catalog} onSave={handleSaveCatalogItem} onDelete={handleDeleteCatalogItem} onNavigate={setCurrentPage}
            profile={profile!} userJobTemplates={userJobTemplates} onSaveTemplate={handleSaveJobTemplate} onDeleteTemplate={handleDeleteJobTemplate}
            isPro={true} onTriggerPro={() => {}}
        />;
      case 'settings':
        return <Settings profile={profile} setProfile={(p) => {
                if (typeof p === 'function') {
                    const newVal = (p as Function)(profile);
                    if(newVal) handleUpdateProfile(newVal);
                } else if(p) handleUpdateProfile(p as UserProfile);
            }}
            onTriggerPro={() => {}}
        />;
      case 'new-invoice':
      case 'edit-invoice':
        return <InvoiceEditor 
          profile={profile!} clients={clients} catalog={catalog} onSave={handleSaveInvoice} initialInvoice={editingInvoice}
          userJobTemplates={userJobTemplates} onTriggerPro={() => {}}
          onCancel={() => { setEditingInvoice(null); setCurrentPage('dashboard'); }}
          onNavigate={setCurrentPage}
          />;
      case 'subscription':
          setCurrentPage('dashboard');
          return null;
      default:
        return <Dashboard 
          profile={profile!} invoices={invoices} clients={clients} catalog={catalog} onEdit={handleEditInvoice} onDelete={handleDeleteInvoice}
          onCreate={() => setCurrentPage('new-invoice')} onGoHome={() => setCurrentPage('dashboard')} onNavigate={setCurrentPage}
          showProWalkthrough={showProWalkthrough} onCloseWalkthrough={() => setShowProWalkthrough(false)} isPro={true} onTriggerPro={() => {}}
          onSaveClient={handleSaveClient} onDeleteClient={handleDeleteClient} onSaveCatalogItem={handleSaveCatalogItem} onDeleteCatalogItem={handleDeleteCatalogItem}
          />;
    }
  };
  
  if (isLoadingProfile) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-blue-600"/></div>;
  }

  if (!profile) {
    return <ProfileSetup setProfile={handleUpdateProfile} onGoHome={() => logout()} />; 
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isMobileOpen={isMobileSidebarOpen} 
        setMobileOpen={setMobileSidebarOpen} 
        onGoHome={logout} 
        isPro={true} 
        onTriggerPro={() => {}}
        canInstall={!!installPrompt}
        onInstall={handleInstallClick}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-10">
           <button onClick={() => setCurrentPage('dashboard')} className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-800">Proforma</h1>
          </button>
          <button onClick={() => setMobileSidebarOpen(true)} className="text-slate-600 hover:text-slate-800"><Menu className="w-6 h-6" /></button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
      <Modal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)}>
        <OCRScanner onDataExtracted={handleDataExtracted} onClose={() => setIsScannerOpen(false)} />
      </Modal>
    </div>
  );
};

const App: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  return (
    <AuthProvider>
      <AppContent showAuth={showAuth} setShowAuth={setShowAuth} />
    </AuthProvider>
  );
};

const AppContent: React.FC<{showAuth: boolean, setShowAuth: (v: boolean) => void}> = ({ showAuth, setShowAuth }) => {
    const { currentUser, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-blue-600"/></div>;
    if (currentUser) return <AuthenticatedApp />;
    if (showAuth) return <Auth onBack={() => setShowAuth(false)} />;
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}

export default App;
