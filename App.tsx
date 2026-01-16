
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, TransactionType, Reminder, ExtendedStatus, ThemeType, Birthday } from './types.ts';
import { FinanceCard } from './components/FinanceCard.tsx';
import { ReminderSection } from './components/ReminderSection.tsx';
import { GoogleCalendarIntegration } from './components/GoogleCalendarIntegration.tsx';
import { AnnualCalendar2026 } from './components/AnnualCalendar2026.tsx';
import { CategorySpendingChart } from './components/CategorySpendingChart.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { getFinancialHealthAnalysis } from './services/gemini.ts';
import { syncTransactionWithSheets } from './services/googleSheets.ts';
import { exportTransactionsToCSV } from './utils/export.ts';
import { BrainCircuit, Menu, X, Cloud, LayoutDashboard, Calendar, Download, Settings, Share2, Users, Palette, CheckCircle } from 'lucide-react';

const THEMES: Record<ThemeType, any> = {
  classic: { 600: '#2563eb', 500: '#3b82f6', 100: '#dbeafe', 50: '#eff6ff', 900: '#1e3a8a', shadow: 'rgba(37, 99, 235, 0.15)' },
  emerald: { 600: '#059669', 500: '#10b981', 100: '#d1fae5', 50: '#ecfdf5', 900: '#064e3b', shadow: 'rgba(5, 150, 105, 0.15)' },
  sunset: { 600: '#e11d48', 500: '#f43f5e', 100: '#ffe4e6', 50: '#fff1f2', 900: '#881337', shadow: 'rgba(225, 29, 72, 0.15)' },
  purple: { 600: '#7c3aed', 500: '#8b5cf6', 100: '#ede9fe', 50: '#f5f3ff', 900: '#4c1d95', shadow: 'rgba(124, 58, 237, 0.15)' },
  midnight: { 600: '#334155', 500: '#475569', 100: '#f1f5f9', 50: '#f8fafc', 900: '#0f172a', shadow: 'rgba(51, 65, 85, 0.15)' }
};

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<string[]>(['Padrão']);
  const [currentProfile, setCurrentProfile] = useState<string>('Padrão');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('classic');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [scriptUrl, setScriptUrl] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('Carregando sua análise diária...');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [view, setView] = useState<'dashboard' | 'annual' | 'pagar' | 'receber' | 'settings'>('dashboard');

  const STORAGE_KEYS = useMemo(() => ({
    PROFILES_LIST: 'sn_profiles_list_v1',
    CURRENT_PROFILE: 'sn_current_profile_active',
    TRANSACTIONS: `sn_${currentProfile}_transactions_v3`,
    REMINDERS: `sn_${currentProfile}_reminders_v3`,
    BIRTHDAYS: `sn_${currentProfile}_birthdays_v1`,
    SCRIPT_URL: `sn_${currentProfile}_script_url`,
    THEME: `sn_${currentProfile}_theme`,
    LAST_ANALYSIS: `sn_${currentProfile}_last_analysis_date`
  }), [currentProfile]);

  // Aplicar cores do tema
  useEffect(() => {
    const colors = THEMES[theme];
    const root = document.documentElement;
    root.style.setProperty('--brand-600', colors[600]);
    root.style.setProperty('--brand-500', colors[500]);
    root.style.setProperty('--brand-100', colors[100]);
    root.style.setProperty('--brand-50', colors[50]);
    root.style.setProperty('--brand-900', colors[900]);
    root.style.setProperty('--brand-shadow', colors.shadow);
  }, [theme]);

  // Carregar dados e disparar análise automática se for um novo dia
  useEffect(() => {
    const savedTrans = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const savedRemind = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    const savedBirth = localStorage.getItem(STORAGE_KEYS.BIRTHDAYS);
    const savedUrl = localStorage.getItem(STORAGE_KEYS.SCRIPT_URL);
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeType;
    const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_ANALYSIS);
    
    const transData = savedTrans ? JSON.parse(savedTrans) : [];
    const remindData = savedRemind ? JSON.parse(savedRemind) : [];
    
    setTransactions(transData);
    setReminders(remindData);
    setBirthdays(savedBirth ? JSON.parse(savedBirth) : []);
    setScriptUrl(savedUrl || '');
    if (savedTheme && THEMES[savedTheme]) setTheme(savedTheme);

    // Lógica de Auto-Análise Diária
    const today = new Date().toISOString().split('T')[0];
    if (lastDate !== today && (transData.length > 0 || remindData.length > 0)) {
      triggerAnalysis();
    } else {
      setAnalysis('Sua análise está atualizada para hoje. Tudo sob controle!');
    }
  }, [currentProfile, STORAGE_KEYS]);

  // Efeito de Salvamento Automático
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    localStorage.setItem(STORAGE_KEYS.BIRTHDAYS, JSON.stringify(birthdays));
    localStorage.setItem(STORAGE_KEYS.SCRIPT_URL, scriptUrl);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [transactions, reminders, birthdays, scriptUrl, theme, STORAGE_KEYS]);

  const triggerAnalysis = useCallback(async () => {
    setLoadingAnalysis(true);
    const result = await getFinancialHealthAnalysis(transactions, reminders, !!scriptUrl);
    setAnalysis(result || "Análise concluída.");
    setLoadingAnalysis(false);
    
    // Salva a data da última análise
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEYS.LAST_ANALYSIS, today);
  }, [transactions, reminders, scriptUrl, STORAGE_KEYS]);

  const handleAddBirthday = (name: string, date: string) => {
    const newBirth: Birthday = { id: Math.random().toString(36).substr(2, 9), name, date };
    setBirthdays(prev => [...prev, newBirth]);
  };

  const handleDeleteBirthday = (id: string) => {
    setBirthdays(prev => prev.filter(b => b.id !== id));
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
    if (scriptUrl) await syncTransactionWithSheets(scriptUrl, newTrans);
  };

  const handleToggleTransStatus = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'PAID' ? 'OPEN' : 'PAID' } : t));
  };

  const handleDeleteTrans = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));

  const handleAddReminder = (text: string, priority: Reminder['priority']) => {
    const newRem: Reminder = { id: Math.random().toString(36).substr(2, 9), text, priority, completed: false, createdAt: new Date().toISOString() };
    setReminders(prev => [...prev, newRem]);
  };

  const handleUpdateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleToggleReminder = (id: string) => setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  const handleDeleteReminder = (id: string) => setReminders(prev => prev.filter(r => r.id !== id));

  const renderMainContent = () => {
    switch (view) {
      case 'settings':
        return <SettingsView scriptUrl={scriptUrl} onUrlChange={setScriptUrl} currentTheme={theme} onThemeChange={setTheme} onNavigateToDashboard={() => setView('dashboard')} />;
      case 'annual':
        return <AnnualCalendar2026 birthdays={birthdays} />;
      default:
        return (
          <>
            <div className="mb-10 flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter uppercase">Janeiro <span className="text-brand-600">2026</span></h1>
                    <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-[11px] font-black border border-emerald-200 shadow-sm animate-pulse">
                      <CheckCircle size={14} /> SALVAMENTO ATIVO
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={() => exportTransactionsToCSV(transactions)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase hover:bg-slate-800 transition-all shadow-lg active:scale-95"><Download size={18} /> Backup CSV</button>
                    <button onClick={() => setView('annual')} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-800 font-black text-xs uppercase hover:border-brand-500 hover:bg-brand-50 transition-all shadow-sm"><Calendar size={18} className="text-brand-600" /> Calendário Anual</button>
                  </div>
              </div>
              <div className="w-full lg:w-1/3 bg-brand-50 border-2 border-brand-200 rounded-[2rem] p-6 shadow-brand relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 bg-brand-600 text-white rounded-lg ${loadingAnalysis ? 'animate-pulse' : ''}`}><BrainCircuit size={20} /></div>
                    <div className="flex flex-col">
                      <h4 className="font-black text-brand-900 uppercase text-xs tracking-widest leading-none">IA Conselheira</h4>
                      <span className="text-[10px] font-black text-brand-600 uppercase tracking-tighter mt-1">Status: {loadingAnalysis ? 'Analisando...' : 'Análise do Dia'}</span>
                    </div>
                    <button 
                      onClick={triggerAnalysis} 
                      className="ml-auto text-[11px] font-black text-white bg-brand-600 px-4 py-2 rounded-full hover:bg-brand-700 hover:scale-105 active:scale-95 transition-all shadow-md border border-brand-500/30"
                    >
                      {loadingAnalysis ? '...' : 'REANALISAR'}
                    </button>
                  </div>
                  <div className="bg-white/40 p-4 rounded-xl border border-white/60 min-h-[80px]">
                    <p className="text-sm text-slate-900 font-bold leading-relaxed italic relative z-10">"{analysis}"</p>
                  </div>
                  <div className="mt-3 text-[9px] font-black text-brand-400 uppercase tracking-widest text-right">
                    Auto-save ativado em {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              <div className="xl:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FinanceCard title="CONTAS A PAGAR" type={TransactionType.PAYABLE} items={transactions.filter(t => t.type === TransactionType.PAYABLE)} onAdd={handleAddTransaction} onToggleStatus={handleToggleTransStatus} onDelete={handleDeleteTrans} isSyncActive={!!scriptUrl} />
                  <FinanceCard title="CONTAS A RECEBER" type={TransactionType.RECEIVABLE} items={transactions.filter(t => t.type === TransactionType.RECEIVABLE)} onAdd={handleAddTransaction} onToggleStatus={handleToggleTransStatus} onDelete={handleDeleteTrans} isSyncActive={!!scriptUrl} />
                </div>
                <GoogleCalendarIntegration transactions={transactions} birthdays={birthdays} onAddBirthday={handleAddBirthday} onDeleteBirthday={handleDeleteBirthday} />
              </div>
              <div className="space-y-8 flex flex-col">
                <ReminderSection reminders={reminders} onAdd={handleAddReminder} onToggle={handleToggleReminder} onUpdate={handleUpdateReminder} onDelete={handleDeleteReminder} />
                <CategorySpendingChart transactions={transactions} />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeView={view} onViewChange={setView} onExport={() => exportTransactionsToCSV(transactions)} onShare={() => setIsShareModalOpen(true)} onOpenProfiles={() => setIsProfileModalOpen(true)} isSyncActive={!!scriptUrl} currentProfile={currentProfile} currentTheme={theme} onThemeChange={setTheme} />
      <div className="flex-1 flex flex-col min-w-0">
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 lg:hidden">
          <div className="px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2" onClick={() => setView('dashboard')}><BrainCircuit className="text-brand-600" size={24} /><span className="text-xl font-black tracking-tighter uppercase">Sem Neura</span></div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </nav>
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto">{renderMainContent()}</main>
      </div>
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} transactions={transactions} isSyncActive={!!scriptUrl} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} profiles={profiles} currentProfile={currentProfile} onSelectProfile={setCurrentProfile} onCreateProfile={(name) => { setProfiles([...profiles, name]); setCurrentProfile(name); setIsProfileModalOpen(false); }} onDeleteProfile={(name) => { setProfiles(profiles.filter(p => p !== name)); if(currentProfile === name) setCurrentProfile('Padrão'); }} />
    </div>
  );
};

export default App;
