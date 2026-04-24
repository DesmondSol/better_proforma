
import React from 'react';
import type { Page } from '../App';
import type { Client, CatalogItem } from '../types';
import { Check, ArrowRight, FilePlus, UserPlus, PackagePlus, Trophy } from 'lucide-react';

interface GettingStartedGuideProps {
    onNavigate: (page: Page) => void;
    onCreate: () => void;
    clients: Client[];
    catalog: CatalogItem[];
}

const GettingStartedGuide: React.FC<GettingStartedGuideProps> = ({ onNavigate, onCreate, clients, catalog }) => {
    const hasCatalogItems = catalog.length > 0;
    const hasClients = clients.length > 0;
    
    // Calculate progress
    let stepsCompleted = 0;
    if (hasCatalogItems) stepsCompleted++;
    if (hasClients) stepsCompleted++;
    const totalSteps = 2; // Catalog and Client are the prereqs for the "Grand Finale" of invoice creation
    const progress = (stepsCompleted / totalSteps) * 100;

    // Fix: StepCard functional component with typed props
    const StepCard = ({ title, desc, icon: Icon, isComplete, onClick, cta, colorClass }: {
        title: string;
        desc: string;
        icon: React.ElementType;
        isComplete: boolean;
        onClick: () => void;
        cta: string;
        colorClass: string;
    }) => {
        // FIX: Using a type assertion to 'string' to resolve TypeScript's 'never' type inference issue.
        const statusIconClass = (isComplete ? 'bg-green-100 text-green-600' : colorClass) as string;
        const iconContainerClass = `w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${statusIconClass}`;
        
        const cardVisibilityClass = isComplete 
            ? 'bg-green-50 border-green-200 opacity-80' 
            : 'bg-white border-slate-100 shadow-sm hover:shadow-md cursor-pointer hover:border-blue-200';
        const cardClass = `relative p-5 rounded-2xl border-2 transition-all duration-300 ${cardVisibilityClass}`;

        return (
            <div 
                onClick={!isComplete ? onClick : undefined}
                className={cardClass}
            >
                {isComplete && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                    </div>
                )}
                <div className={iconContainerClass}>
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{title}</h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">{desc}</p>
                {!isComplete && (
                    <button className="text-blue-600 font-bold text-sm flex items-center group">
                        {cta} <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Let's set up your business!</h2>
                    <p className="text-blue-100 mb-6 max-w-lg">Complete these quick steps to start sending professional invoices.</p>
                    
                    {/* Progress Bar */}
                    <div className="bg-blue-900/30 h-3 rounded-full overflow-hidden max-w-md">
                        <div 
                            className="bg-green-400 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min((stepsCompleted / 3) * 100 + 10, 100)}%` }} // Visual hack to show some progress always
                        ></div>
                    </div>
                    <p className="text-xs text-blue-200 mt-2 font-medium">{stepsCompleted} of 2 steps completed</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StepCard 
                    title="1. Add Products"
                    desc="List your services or items so you don't type them every time."
                    icon={PackagePlus}
                    isComplete={hasCatalogItems}
                    onClick={() => onNavigate('catalog')}
                    cta="Go to Catalog"
                    colorClass="bg-purple-100 text-purple-600"
                />
                
                <StepCard 
                    title="2. Add a Client"
                    desc="Save customer details to auto-fill your invoices instantly."
                    icon={UserPlus}
                    isComplete={hasClients}
                    onClick={() => onNavigate('clients')}
                    cta="Add Client"
                    colorClass="bg-orange-100 text-orange-600"
                />

                <div 
                    className={`relative p-5 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                        (!hasCatalogItems || !hasClients) 
                            ? 'bg-slate-50 border-slate-200 border-dashed' 
                            : 'bg-white border-blue-500 shadow-xl ring-4 ring-blue-50'
                    }`}
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                        (!hasCatalogItems || !hasClients) ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white animate-bounce'
                    }`}>
                        {(!hasCatalogItems || !hasClients) ? <FilePlus className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1">Create Invoice</h3>
                    <p className="text-slate-500 text-sm mb-4">
                        {(!hasCatalogItems || !hasClients) ? 'Finish setup to unlock.' : 'You are ready!'}
                    </p>
                    <button 
                        onClick={onCreate}
                        disabled={!hasCatalogItems || !hasClients}
                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${
                            (!hasCatalogItems || !hasClients) 
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        }`}
                    >
                        Create First Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GettingStartedGuide;
