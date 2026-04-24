
import React from 'react';
import type { Page } from '../App';
import { LayoutDashboard, Users, Book, Settings, FileText, PlusCircle, LogOut, Zap, Download } from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isMobileOpen: boolean;
  setMobileOpen: (isOpen: boolean) => void;
  onGoHome: () => void;
  isPro?: boolean;
  onTriggerPro?: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
}

const iconMap: { [key: string]: React.ElementType } = {
  LayoutDashboard,
  Users,
  Book,
  Settings,
};

const Sidebar: React.FC<SidebarProps> = ({ 
    currentPage, 
    setCurrentPage, 
    isMobileOpen, 
    setMobileOpen, 
    onGoHome, 
    isPro, 
    onTriggerPro,
    canInstall,
    onInstall
}) => {
  const navItems = [
    { page: 'dashboard' as Page, label: 'Dashboard', icon: 'LayoutDashboard' },
    { page: 'clients' as Page, label: 'Clients', icon: 'Users' },
    { page: 'catalog' as Page, label: 'Catalog', icon: 'Book' },
    { page: 'settings' as Page, label: 'Settings', icon: 'Settings' },
  ];

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setMobileOpen(false);
  };

  const NavLink: React.FC<{ page: Page, label: string, icon: string }> = ({ page, label, icon }) => {
    // Explicitly casting to string to avoid potential 'never' inference in union comparisons
    const isActive: boolean = (currentPage as string) === (page as string);
    // Safe lookup with fallback to prevent Type 'string' indexer issues
    const Icon = iconMap[icon] || LayoutDashboard;

    return (
      <button
        onClick={() => handleNavigation(page)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  return (
    <>
        {/* Overlay for mobile */}
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${
            isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setMobileOpen(false)}
        ></div>

        <div className={`
            fixed top-0 right-0 md:left-0 h-full w-64 bg-white shadow-lg p-4 flex flex-col z-40 
            transition-transform duration-300 ease-in-out
            md:sticky md:translate-x-0 md:flex-shrink-0 md:h-screen md:shadow-lg
            ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
            <div className="flex items-center space-x-2 mb-8 px-2 text-left">
                <FileText className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-800">Proforma</h1>
            </div>
            
            {/* PWA Install Button */}
            {canInstall && (
                <div className="mb-6 mx-2">
                    <button 
                        onClick={onInstall}
                        className="w-full flex items-center justify-center space-x-2 p-3 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-200 transition-all font-bold text-sm"
                    >
                        <Download className="w-4 h-4 text-blue-600" />
                        <span>Install Proforma App</span>
                    </button>
                </div>
            )}
            
            <nav className="flex flex-col space-y-2 flex-1">
                {navItems.map(item => (
                <NavLink key={item.page} {...item} />
                ))}
                <div className="pt-4 mt-auto space-y-2">
                    <button
                        onClick={() => handleNavigation('new-invoice')}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-200 shadow-md"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>New Invoice</span>
                    </button>
                    <button
                        onClick={onGoHome}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200 mt-2"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Log Out</span>
                    </button>
                </div>
            </nav>
        </div>
    </>
  );
};

export default Sidebar;
