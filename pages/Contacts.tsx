
import React, { useState, useRef, useEffect } from 'react';
import type { Client } from '../types';
import type { Page } from '../App';
import Modal from '../components/Modal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Edit, Trash2, Mail, Phone, MapPin, ArrowRight, CheckCircle, X } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  onSave: (client: Client) => void;
  onDelete: (id: string) => void;
  onNavigate: (page: Page) => void;
}

const ClientForm: React.FC<{ onSave: (client: Client) => void; initialData?: Client | null, onCancel: () => void }> = ({ onSave, initialData, onCancel }) => {
    const [client, setClient] = useState<Client>(initialData || { id: '', name: '', companyName: '', tin: '', phone: '', email: '', address: '', tags: [] });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...client, id: client.id || Date.now().toString() });
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{initialData ? 'Edit Client' : 'Add New Client'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" placeholder="Contact Person Name" value={client.name} onChange={handleChange} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                <input name="companyName" placeholder="Company Name" value={client.companyName} onChange={handleChange} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                <input name="email" placeholder="Email" value={client.email} onChange={handleChange} type="email" className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                <input name="phone" placeholder="Phone" value={client.phone} onChange={handleChange} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                <input name="tin" placeholder="TIN / Business Number" value={client.tin} onChange={handleChange} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <textarea name="address" placeholder="Address" value={client.address} onChange={handleChange} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Client</button>
            </div>
        </form>
    )
}

const Clients: React.FC<ClientsProps> = ({ clients, onSave, onDelete, onNavigate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [tutorialState, setTutorialState] = useLocalStorage('tutorialState', { catalog: false, clients: false });
  const [tutorialStep, setTutorialStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTutorialPopover, setShowTutorialPopover] = useState(false);
  const addClientBtnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clients.length === 0 && tutorialState.catalog && !tutorialState.clients && tutorialStep === 0) {
      setTimeout(() => setTutorialStep(1), 500);
    }
  }, [clients.length, tutorialState]);

  useEffect(() => {
    if (tutorialStep > 0) {
      setShowTutorialPopover(true);
    } else {
      setShowTutorialPopover(false);
    }
  }, [tutorialStep]);
  
  useEffect(() => {
    if (tutorialStep === 1 && addClientBtnRef.current) {
      const rect = addClientBtnRef.current.getBoundingClientRect();
      setHighlightStyle({
        position: 'fixed',
        top: `${rect.top - 4}px`,
        left: `${rect.left - 4}px`,
        width: `${rect.width + 8}px`,
        height: `${rect.height + 8}px`,
        boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
        borderRadius: '12px',
        zIndex: 1001,
        transition: 'all 0.3s ease',
      });
    }
  }, [tutorialStep]);

  useEffect(() => {
    if (tutorialStep === 1 && showTutorialPopover && addClientBtnRef.current && popoverRef.current) {
        const targetRect = addClientBtnRef.current.getBoundingClientRect();
        const popoverNode = popoverRef.current;
        const popoverRect = popoverNode.getBoundingClientRect();

        const popoverHeight = popoverRect.height;
        const popoverWidth = 256;
        const gap = 15;
        const screenPadding = 10;

        let top = targetRect.bottom + gap;
        let left = targetRect.left + targetRect.width / 2 - popoverWidth / 2;

        if (top + popoverHeight > window.innerHeight - screenPadding) {
            top = targetRect.top - popoverHeight - gap;
        }

        if (left < screenPadding) {
            left = screenPadding;
        }
        if (left + popoverWidth > window.innerWidth - screenPadding) {
            left = window.innerWidth - popoverWidth - screenPadding;
        }

        setPopoverStyle({
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            width: `${popoverWidth}px`,
            zIndex: 1002,
        });
    }
  }, [tutorialStep, showTutorialPopover]);

  const handleFormSave = (client: Client) => {
    onSave(client);

    if (tutorialStep === 2) {
      setTutorialState(prev => ({ ...prev, clients: true }));
      setTutorialStep(0);
      setShowSuccessModal(true);
      setShowTutorialPopover(false);
    }

    setIsModalOpen(false);
    setEditingClient(null);
  };
  
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  }

  const handleGoToStep2 = () => {
    setEditingClient(null);
    setIsModalOpen(true);
    setTutorialStep(2);
  };
  
  const handleOverlayClick = () => {
    if (tutorialStep === 1) {
      handleGoToStep2();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    if (tutorialStep === 2) {
      setShowTutorialPopover(false);
    }
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-slate-800">Clients</h1>
        <button ref={addClientBtnRef} onClick={() => { setEditingClient(null); setIsModalOpen(true); }} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-200 shadow-md">
          <Plus className="w-5 h-5" />
          <span>Add Client</span>
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <div key={client.id} className="border border-slate-200 p-4 rounded-lg bg-slate-50">
              <div className="flex justify-between items-start">
                  <div>
                      <h3 className="font-bold text-lg text-slate-800">{client.companyName}</h3>
                      <p className="text-sm text-slate-600">{client.name}</p>
                  </div>
                  <div className="flex space-x-2">
                      <button onClick={() => handleEdit(client)} className="p-1 text-slate-500 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(client.id)} className="p-1 text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
              </div>
              <div className="mt-4 text-sm space-y-2 text-slate-700">
                <p className="flex items-center space-x-2"><Mail className="w-4 h-4 text-slate-400"/><span>{client.email}</span></p>
                <p className="flex items-center space-x-2"><Phone className="w-4 h-4 text-slate-400"/><span>{client.phone}</span></p>
                <p className="flex items-center space-x-2"><MapPin className="w-4 h-4 text-slate-400"/><span>{client.address}</span></p>
              </div>
            </div>
          ))}
        </div>
        {clients.length === 0 && tutorialStep === 0 && <p className="text-center py-8 text-slate-500">No clients found. Add one to get started!</p>}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ClientForm onSave={handleFormSave} initialData={editingClient} onCancel={handleCloseModal} />
      </Modal>

      {tutorialStep > 0 && (
        <div 
          className="fixed inset-0 z-[1000] animate-fadeIn" 
          onClick={handleOverlayClick}
          style={{ pointerEvents: tutorialStep === 2 ? 'none' : 'auto' }}
        >
          {tutorialStep === 1 && <div style={highlightStyle}></div>}
          
          {tutorialStep === 1 && showTutorialPopover && (
            <div 
              ref={popoverRef}
              style={{ ...popoverStyle, pointerEvents: 'auto' }}
              className="bg-white p-5 rounded-lg shadow-2xl animate-fade-in-up" 
              onClick={stopPropagation}
            >
              <h3 className="font-bold text-lg text-slate-800 mb-2">Final Step!</h3>
              <p className="text-slate-600 text-sm mb-4">Click "Add Client" to save your customer's information.</p>
              <button onClick={handleGoToStep2} className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-200">
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
          {tutorialStep === 2 && isModalOpen && showTutorialPopover && (
            <div 
              className="fixed top-4 left-1/2 -translate-x-1/2 bg-white p-5 rounded-lg max-w-sm w-[90%] shadow-2xl z-[1002] animate-fade-in-up" 
              onClick={stopPropagation}
              style={{ pointerEvents: 'auto' }}
            >
              <h3 className="font-bold text-lg text-slate-800 mb-2">Client Details</h3>
              <p className="text-slate-600 text-sm mb-4">
                Fill in your client's information here. This will be automatically added to invoices. Click "Save Client" when you're done.
              </p>
              <button onClick={() => setShowTutorialPopover(false)} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-semibold">
                Continue
              </button>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="text-center p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Setup Complete!</h2>
          <p className="text-slate-600 mb-6">You're all set! You've added your first item and client. Now you're ready to create an invoice.</p>
          <button onClick={() => { onNavigate('new-invoice'); setShowSuccessModal(false); }} className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-all duration-200">
              <span>Create First Invoice</span>
              <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Clients;
