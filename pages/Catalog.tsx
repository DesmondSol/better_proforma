
import React, { useState, useRef, useEffect } from 'react';
import type { CatalogItem, UserProfile, JobTemplate } from '../types';
import type { Page } from '../App';
import Modal from '../components/Modal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatNumber } from '../utils/format';
import { Plus, Edit, Trash2, ArrowRight, CheckCircle, Package, XCircle, Lock } from 'lucide-react';
import { getTemplatesForJobType } from '../utils/proDefaults';
import { JOB_TYPES } from '../utils/banks';

interface CatalogProps {
  catalog: CatalogItem[];
  profile: UserProfile;
  onSave: (item: CatalogItem) => void;
  onDelete: (id: string) => void;
  onNavigate: (page: Page) => void;
  userJobTemplates?: JobTemplate[];
  onSaveTemplate?: (template: JobTemplate) => void;
  onDeleteTemplate?: (id: string) => void;
  isPro?: boolean;
  onTriggerPro?: () => void;
}

const CatalogItemForm: React.FC<{ onSave: (item: CatalogItem) => void; initialData?: CatalogItem | null, onCancel: () => void }> = ({ onSave, initialData, onCancel }) => {
    const [item, setItem] = useState<CatalogItem>(initialData || { id: '', name: '', description: '', unitPrice: 0, type: 'service', unitType: 'item' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: name === 'unitPrice' ? parseFloat(value) : value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...item, id: item.id || Date.now().toString() });
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{initialData ? 'Edit Item' : 'Add New Item'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" placeholder="Item Name" value={item.name} onChange={handleChange} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              <select name="type" value={item.type} onChange={handleChange} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="service">Service</option>
                <option value="product">Product</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="unitPrice" placeholder="Unit Price" value={item.unitPrice} onChange={handleChange} type="number" step="0.01" className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              <input name="unitType" placeholder="Unit Type (e.g., hour, item)" value={item.unitType} onChange={handleChange} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea id="description" name="description" placeholder="A brief description of the item" value={item.description} onChange={handleChange} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Item</button>
            </div>
        </form>
    )
}

const JobTemplateForm: React.FC<{ onSave: (template: JobTemplate) => void; initialData?: JobTemplate | null, onCancel: () => void }> = ({ onSave, initialData, onCancel }) => {
    const [template, setTemplate] = useState<JobTemplate>(initialData || { 
        id: '', 
        name: '', 
        description: '', 
        category: 'General', 
        items: [] 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setTemplate({ ...template, [e.target.name]: e.target.value });
    };

    const addItem = () => {
        setTemplate({
            ...template,
            items: [...template.items, { id: Date.now().toString(), name: '', description: '', unitPrice: 0, unitType: 'item', type: 'service' }]
        });
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...template.items];
        (newItems[index] as any)[field] = value;
        setTemplate({ ...template, items: newItems });
    };

    const removeItem = (index: number) => {
        setTemplate({ ...template, items: template.items.filter((_, i) => i !== index) });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...template, id: template.id || Date.now().toString() });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 max-h-[80vh] overflow-y-auto">
             <h2 className="text-2xl font-bold text-slate-800 mb-4">{initialData ? 'Edit Template' : 'Create Custom Job Template'}</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Template Name</label>
                     <input name="name" value={template.name} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                     <select name="category" value={template.category} onChange={handleChange} className="w-full p-2 border rounded-md">
                         {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                 </div>
             </div>
             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                 <textarea name="description" value={template.description} onChange={handleChange} className="w-full p-2 border rounded-md" rows={2}></textarea>
             </div>
             
             <div className="border-t pt-4 mt-4">
                 <div className="flex justify-between items-center mb-2">
                     <h3 className="font-semibold text-slate-700">Template Items</h3>
                     <button type="button" onClick={addItem} className="text-sm text-blue-600 font-bold flex items-center"><Plus className="w-4 h-4 mr-1"/> Add Item</button>
                 </div>
                 <div className="space-y-3">
                     {template.items.map((item, index) => (
                         <div key={item.id} className="bg-slate-50 p-3 rounded-md border flex flex-col gap-2">
                             <div className="flex gap-2">
                                 <input placeholder="Item Name" value={item.name} onChange={e => updateItem(index, 'name', e.target.value)} className="flex-1 p-1 text-sm border rounded" required />
                                 <input placeholder="Price" type="number" value={item.unitPrice} onChange={e => updateItem(index, 'unitPrice', parseFloat(e.target.value))} className="w-24 p-1 text-sm border rounded" required />
                                 <button type="button" onClick={() => removeItem(index)} className="text-red-500"><XCircle className="w-5 h-5" /></button>
                             </div>
                             <div className="flex gap-2">
                                 <input placeholder="Description" value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} className="flex-1 p-1 text-sm border rounded" />
                                 <input placeholder="Unit (e.g. hr)" value={item.unitType} onChange={e => updateItem(index, 'unitType', e.target.value)} className="w-24 p-1 text-sm border rounded" />
                             </div>
                         </div>
                     ))}
                     {template.items.length === 0 && <p className="text-sm text-slate-400 italic text-center py-2">No items added to this template yet.</p>}
                 </div>
             </div>

             <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Template</button>
            </div>
        </form>
    );
};

const Catalog: React.FC<CatalogProps> = ({ catalog, profile, onSave, onDelete, onNavigate, userJobTemplates = [], onSaveTemplate, onDeleteTemplate, isPro = false, onTriggerPro }) => {
  const [activeTab, setActiveTab] = useState<'items' | 'templates'>('items');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<JobTemplate | null>(null);
  
  const currency = profile.currency || 'ETB';
  // Use effectiveJobTypes (array) or legacy jobType (string) or default
  const effectiveJobTypes = profile.jobTypes || (profile.jobType ? [profile.jobType] : undefined);
  const defaultTemplates = getTemplatesForJobType(effectiveJobTypes);
  const allTemplates = [...userJobTemplates, ...defaultTemplates];

  const handleFormSave = (item: CatalogItem) => {
    onSave(item);
    setIsModalOpen(false);
    setEditingItem(null);
  };
  
  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  const handleTemplateFormSave = (template: JobTemplate) => {
      if(onSaveTemplate) onSaveTemplate(template);
      setIsTemplateModalOpen(false);
      setEditingTemplate(null);
  };

  const handleTabChange = (tab: 'items' | 'templates') => {
      setActiveTab(tab);
  };

  const isUserTemplate = (id: string) => userJobTemplates.some(t => t.id === id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-slate-800">Catalog</h1>
        {activeTab === 'items' ? (
            <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-200 shadow-md">
            <Plus className="w-5 h-5" />
            <span>Add Item</span>
            </button>
        ) : (
            <button onClick={() => { setEditingTemplate(null); setIsTemplateModalOpen(true); }} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-200 shadow-md">
            <Plus className="w-5 h-5" />
            <span>Create Template</span>
            </button>
        )}
      </div>

      <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg w-max mb-4">
          <button onClick={() => handleTabChange('items')} className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'items' ? 'bg-white shadow text-slate-800' : 'text-slate-600'}`}>Items</button>
          <button 
            onClick={() => handleTabChange('templates')} 
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all flex items-center ${activeTab === 'templates' ? 'bg-white shadow text-slate-800' : 'text-slate-600'}`}
          >
              Job Templates
          </button>
      </div>

      {activeTab === 'items' ? (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                <tr className="border-b">
                    <th className="p-3 font-semibold text-slate-600">Name</th>
                    <th className="p-3 font-semibold text-slate-600">Type</th>
                    <th className="p-3 font-semibold text-slate-600">Price</th>
                    <th className="p-3 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
                </thead>
                <tbody>
                {catalog.map(item => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">
                        <div className="font-medium text-slate-800">{item.name}</div>
                        <div className="text-sm text-slate-500">{item.description}</div>
                    </td>
                    <td className="p-3 text-slate-600 capitalize">{item.type}</td>
                    <td className="p-3 text-slate-800 font-semibold">{currency} {formatNumber(item.unitPrice)} / {item.unitType}</td>
                    <td className="p-3 text-right">
                        <div className="flex justify-end items-center space-x-2">
                            <button onClick={() => handleEdit(item)} className="p-2 text-slate-500 hover:text-blue-600 rounded-full hover:bg-slate-200"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => onDelete(item.id)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-200"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {catalog.length === 0 && <p className="text-center py-8 text-slate-500">No items in your catalog yet.</p>}
            </div>
        </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allTemplates.map(template => (
                  <div key={template.id} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 relative">
                      {isUserTemplate(template.id) && (
                          <div className="absolute top-4 right-4 flex space-x-1">
                              <button onClick={() => { setEditingTemplate(template); setIsTemplateModalOpen(true); }} className="p-1.5 text-slate-500 hover:text-blue-600 bg-slate-100 rounded-md"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => onDeleteTemplate && onDeleteTemplate(template.id)} className="p-1.5 text-slate-500 hover:text-red-600 bg-slate-100 rounded-md"><Trash2 className="w-4 h-4" /></button>
                          </div>
                      )}
                      <div className="flex items-center space-x-3 mb-4">
                          <div className={`p-3 rounded-lg ${isUserTemplate(template.id) ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                              <Package className="w-6 h-6" />
                          </div>
                          <div>
                              <h3 className="font-bold text-lg text-slate-800">{template.name}</h3>
                              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">{template.category} {isUserTemplate(template.id) && '(Custom)'}</p>
                          </div>
                      </div>
                      <p className="text-slate-600 text-sm mb-4">{template.description}</p>
                      <div className="space-y-2 border-t pt-4">
                          {template.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                  <span className="text-slate-700">{item.name}</span>
                                  <span className="font-medium text-slate-900">{currency} {formatNumber(item.unitPrice)}</span>
                              </div>
                          ))}
                      </div>
                      {!isUserTemplate(template.id) && (
                         <button className="w-full mt-6 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg text-sm hover:bg-slate-200 cursor-not-allowed" title="Templates are managed by Proforma for now">
                             Built-in Template
                         </button>
                      )}
                  </div>
              ))}
          </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <CatalogItemForm onSave={handleFormSave} initialData={editingItem} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)}>
          <JobTemplateForm onSave={handleTemplateFormSave} initialData={editingTemplate} onCancel={() => setIsTemplateModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Catalog;
