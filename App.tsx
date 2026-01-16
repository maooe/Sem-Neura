
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, TransactionType, Reminder, ExtendedStatus } from './types.ts';
import { FinanceCard } from './components/FinanceCard.tsx';
import { ReminderSection } from './components/ReminderSection.tsx';
import { GoogleCalendarIntegration } from './components/GoogleCalendarIntegration.tsx';
import { AnnualCalendar2026 } from './components/AnnualCalendar2026.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { getFinancialHealthAnalysis } from './services/gemini.ts';
import { syncTransactionWithSheets } from './services/googleSheets.ts';
import { exportTransactionsToCSV } from './utils/export.ts';
import { BrainCircuit, Menu, X, CloudCheck, LayoutDashboard, Calendar, Download, Settings, Share2, Users } from 'lucide-react';

const App: React.FC = () => {
  // Estado de Perfis
  const [profiles, setProfiles] = useState<string[]>(['Padrão']);
  const [currentProfile, setCurrentProfile] = useState<string>('Padrão');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Dados do Perfil Atual
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [scriptUrl, setScriptUrl] = useState<string>('');
  
  // UI States
  const [analysis, setAnalysis] = useState<string>('Boas-vindas! Comece alimentando seus dados para uma análise sem neura.');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [view, setView] = useState<'dashboard' | 'annual' | 'pagar' | 'receber' | 'settings'>('dashboard');

  // Chaves de Armazenamento Dinâmicas
  const STORAGE_KEYS = useMemo(() => ({
    PROFILES_LIST: 'sn_profiles_list_v1',
    CURRENT_PROFILE: 'sn_current_profile_active',
    TRANSACTIONS: `sn_${currentProfile}_transactions_v3`,
    REMINDERS: `sn_${currentProfile}_reminders_v3`,
    SCRIPT_URL: `sn_${currentProfile}_script_url`
  }), [currentProfile]);

  // Carregar Lista de Perfis e Perfil Atual ao Iniciar
  useEffect(() => {
    const savedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES_LIST);
    const savedActive = localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE);
    
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
    if (savedActive) {
      setCurrentProfile(savedActive);
    }
  }, []);

  // Carregar Dados do Perfil Sempre que trocar o currentProfile
  useEffect(() => {
    const savedTrans = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const savedRemind = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    const savedUrl = localStorage.getItem(STORAGE_KEYS.SCRIPT_URL);
    
    setTransactions(savedTrans ? JSON.parse(savedTrans) : []);
    setReminders(savedRemind ? JSON.parse(savedRemind) : []);
    setScriptUrl(savedUrl || '');
    setAnalysis(`Você trocou para o perfil ${currentProfile}. Como posso ajudar hoje?`);
  }, [currentProfile, STORAGE_KEYS]);

  // Salvar Dados do Perfil Sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    localStorage.setItem(STORAGE_KEYS.SCRIPT_URL, scriptUrl);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE, currentProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify(profiles));
  }, [transactions, reminders, scriptUrl, currentProfile, profiles, STORAGE_KEYS]);

  const handleCreateProfile = (name: string) => {
    if (profiles.includes(name)) return;
    const newList = [...profiles, name];
    setProfiles(newList);
    setCurrentProfile(name);
    setIsProfileModalOpen(false);
  };

  const handleDeleteProfile = (name: string) => {
    if (name === 'Padrão' || profiles.length === 1) return;
    const newList = profiles.filter(p => p !== name);
    setProfiles(newList);
    if (currentProfile === name) {
      setCurrentProfile('Padrão');
    }
  };

  const handleAddTransaction = async (item: Partial<Transaction>) => {
    const newTrans: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description: item.description!,
      amount: item.amount!,
      dueDate: item.dueDate!,
      type: item.type!,
      status: item.status || 'OPEN',
      categoryKind: item.categoryKind || 'VARIABLE',
      paymentMethod: item.paymentMethod || 'PIX',
      observation: item.observation,
    };
    
    setTransactions(prev => [...prev, newTrans]);

    if (scriptUrl) {
      await syncTransactionWithSheets(scriptUrl, newTrans);
    }
  };

  const handleToggleTransStatus = (id: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus: ExtendedStatus = t.status === 'PAID' ? 'OPEN' : 'PAID';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleDeleteTrans = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddReminder = (text: string, priority: Reminder['priority']) => {
    const newRem: Reminder = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setReminders(prev => [...prev, newRem]);
  };

  const handleToggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const triggerAnalysis = useCallback(async () => {
    if (transactions.length === 0 && reminders.length === 0) {
      setAnalysis("Adicione lançamentos para que eu possa analisar seus dados!");
      return;
    }
    setLoadingAnalysis(true);
    const result = await getFinancialHealthAnalysis(transactions, reminders, !!scriptUrl);
    setAnalysis(result || "Análise concluída com sucesso.");
    setLoadingAnalysis(false);
  }, [transactions, reminders, scriptUrl]);

  const handleExport = () => {
    exportTransactionsToCSV(transactions);
  };

  const renderMainContent = () => {
    switch (view) {
      case 'settings':
        return <SettingsView scriptUrl={scriptUrl} onUrlChange={setScriptUrl} onNavigateToDashboard={() => setView('dashboard')} />;
      case 'annual':
        return <AnnualCalendar2026 />;
      case 'pagar':
        return (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
             <FinanceCard 
                title="CONTAS A PAGAR"
                type={TransactionType.PAYABLE}
                items={transactions.filter(t => t.type === TransactionType.PAYABLE)}
                onAdd={handleAddTransaction}
                onToggleStatus={handleToggleTransStatus}
                onDelete={handleDeleteTrans}
                isSyncActive={!!scriptUrl}
              />
          </div>
        );
      case 'receber':
        return (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
             <FinanceCard 
                title="CONTAS A RECEBER"
                type={TransactionType.RECEIVABLE}
                items={transactions.filter(t => t.type === TransactionType.RECEIVABLE)}
                onAdd={handleAddTransaction}
                onToggleStatus={handleToggleTransStatus}
                onDelete={handleDeleteTrans}
                isSyncActive={!!scriptUrl}
              />
          </div>
        );
      default:
        return (
          <>
            <div className="mb-10 flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter uppercase">
                      Janeiro <span className="text-blue-600">2026</span>
                    </h1>
                    {scriptUrl && (
                      <div className="hidden sm:flex items-center gap-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black animate-in slide-in-from-left-4 duration-500">
                        <CloudCheck size={14} /> NUVEM ATIVA
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button 
                      onClick={handleExport}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                      <Download size={18} /> Backup CSV
                    </button>
                    <button 
                      onClick={() => setView('annual')}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
                    >
                      <Calendar size={18} className="text-blue-500" /> Calendário Anual
                    </button>
                    <button 
                      onClick={() => setIsShareModalOpen(true)}
                      className="lg:hidden flex items-center gap-2 px-5 py-2.5 bg-blue-100 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-200 transition-all shadow-sm"
                    >
                      <Share2 size={18} /> Compartilhar
                    </button>
                  </div>
              </div>
              
              <div className="w-full lg:w-1/3 bg-indigo-50 border border-indigo-100 rounded-3xl p-6 relative overflow-hidden group shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 bg-indigo-600 text-white rounded-lg ${loadingAnalysis ? 'animate-pulse' : ''}`}>
                      <BrainCircuit size={20} />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-bold text-indigo-900 uppercase text-xs tracking-widest">IA Conselheira</h4>
                      <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">Perfil: {currentProfile}</span>
                    </div>
                    <button onClick={triggerAnalysis} className="ml-auto text-xs font-black text-indigo-600 hover:underline">REANALISAR</button>
                  </div>
                  <p className="text-sm text-indigo-800 leading-relaxed italic relative z-10">"{analysis}"</p>
                  <div className="absolute -bottom-8 -right-8 text-indigo-100 opacity-30">
                    <BrainCircuit size={120} />
                  </div>
              </div>
            </div>

            <GoogleCalendarIntegration transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <FinanceCard 
                title="PAGAR"
                type={TransactionType.PAYABLE}
                items={transactions.filter(t => t.type === TransactionType.PAYABLE)}
                onAdd={handleAddTransaction}
                onToggleStatus={handleToggleTransStatus}
                onDelete={handleDeleteTrans}
                isSyncActive={!!scriptUrl}
              />
              <FinanceCard 
                title="RECEBER"
                type={TransactionType.RECEIVABLE}
                items={transactions.filter(t => t.type === TransactionType.RECEIVABLE)}
                onAdd={handleAddTransaction}
                onToggleStatus={handleToggleTransStatus}
                onDelete={handleDeleteTrans}
                isSyncActive={!!scriptUrl}
              />
              <ReminderSection 
                reminders={reminders}
                onAdd={handleAddReminder}
                onToggle={handleToggleReminder}
                onDelete={handleDeleteReminder}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        activeView={view} 
        onViewChange={setView} 
        onExport={handleExport} 
        onShare={() => setIsShareModalOpen(true)}
        onOpenProfiles={() => setIsProfileModalOpen(true)}
        isSyncActive={!!scriptUrl} 
        currentProfile={currentProfile}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 lg:hidden">
          <div className="px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2" onClick={() => setView('dashboard')}>
              <BrainCircuit className="text-blue-600" size={24} />
              <span className="text-xl font-black tracking-tighter uppercase">Sem Neura</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {isMobileMenuOpen && (
            <div className="p-4 space-y-4 bg-white border-t animate-in fade-in slide-in-from-top-4">
              <button onClick={() => {setView('dashboard'); setIsMobileMenuOpen(false)}} className="w-full text-left py-2 px-4 font-bold flex items-center gap-2 text-slate-700"><LayoutDashboard size={18}/> Dashboard</button>
              <button onClick={() => {setView('pagar'); setIsMobileMenuOpen(false)}} className="w-full text-left py-2 px-4 font-bold flex items-center gap-2 text-rose-500">Pagar</button>
              <button onClick={() => {setView('receber'); setIsMobileMenuOpen(false)}} className="w-full text-left py-2 px-4 font-bold flex items-center gap-2 text-emerald-500">Receber</button>
              <button onClick={() => {setView('annual'); setIsMobileMenuOpen(false)}} className="w-full text-left py-2 px-4 font-bold flex items-center gap-2 text-slate-700"><Calendar size={18}/> Calendário 2026</button>
              <button onClick={() => {setView('settings'); setIsMobileMenuOpen(false)}} className="w-full text-left py-2 px-4 font-bold flex items-center gap-2 text-slate-700"><Settings size={18}/> Configurações</button>
              <button onClick={() => {setIsProfileModalOpen(true); setIsMobileMenuOpen(false)}} className="w-full text-left py-2 px-4 font-bold flex items-center gap-2 text-slate-900"><Users size={18}/> Trocar Perfil</button>
            </div>
          )}
        </nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {renderMainContent()}
        </main>

        <footer className="p-10 border-t border-slate-200 mt-auto bg-white">
           <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
              <p>&copy; 2026 SEM NEURA - Gestão de {currentProfile}</p>
           </div>
        </footer>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        transactions={transactions}
        isSyncActive={!!scriptUrl}
      />

      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        currentProfile={currentProfile}
        onSelectProfile={setCurrentProfile}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
      />
    </div>
  );
};

export default App;
