
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, TransactionType, Reminder, ExtendedStatus, ThemeType, Birthday } from './types.ts';
import { FinanceCard } from './components/FinanceCard.tsx';
import { ReminderSection } from './components/ReminderSection.tsx';
import { GoogleCalendarIntegration } from './components/GoogleCalendarIntegration.tsx';
import { AnnualCalendar2026 } from './components/AnnualCalendar2026.tsx';
import { CategorySpendingChart } from './components/CategorySpendingChart.tsx';
import { FixedExpensesChart } from './components/FixedExpensesChart.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { HeaderWidgets } from './components/HeaderWidgets.tsx';
import { FinancialSummary } from './components/FinancialSummary.tsx';
import { AccountHistory } from './components/AccountHistory.tsx';
import { MonthlyPerformanceGrid } from './components/MonthlyPerformanceGrid.tsx';
import { InsightsBanner } from './components/InsightsBanner.tsx';
import { getFinancialHealthAnalysis } from './services/gemini.ts';
import { syncTransactionWithSheets } from './services/googleSheets.ts';
import { exportTransactionsToCSV } from './utils/export.ts';
import { auth, saveUserData, loadUserData } from './services/firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';
import { BrainCircuit, Menu, X, Cloud, LayoutDashboard, Calendar, Download, Settings, Share2, Users, Palette, CheckCircle, BarChart3 } from 'lucide-react';

const THEMES: Record<ThemeType, any> = {
  classic: { 600: '#2563eb', 500: '#3b82f6', 100: '#dbeafe', 50: '#eff6ff', 900: '#1e3a8a', shadow: 'rgba(37, 99, 235, 0.15)' },
  emerald: { 600: '#059669', 500: '#10b981', 100: '#d1fae5', 50: '#ecfdf5', 900: '#064e3b', shadow: 'rgba(5, 150, 105, 0.15)' },
  sunset: { 600: '#e11d48', 500: '#f43f5e', 100: '#ffe4e6', 50: '#fff1f2', 900: '#881337', shadow: 'rgba(225, 29, 72, 0.15)' },
  purple: { 600: '#7c3aed', 500: '#8b5cf6', 100: '#ede9fe', 50: '#f5f3ff', 900: '#4c1d95', shadow: 'rgba(124, 58, 237, 0.15)' },
  midnight: { 600: '#334155', 500: '#475569', 100: '#f1f5f9', 50: '#f8fafc', 900: '#0f172a', shadow: 'rgba(51, 65, 85, 0.15)' }
};

type ViewType = 'dashboard' | 'annual' | 'analysis' | 'pagar' | 'receber' | 'settings';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<string[]>(['Padrão']);
  const [currentProfile, setCurrentProfile] = useState<string>('Padrão');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('classic');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({});
  const [scriptUrl, setScriptUrl] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('Carregando sua análise diária...');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [view, setView] = useState<ViewType>('dashboard');

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const STORAGE_KEYS = useMemo(() => ({
    PROFILES_LIST: 'sn_profiles_list_v1',
    CURRENT_PROFILE: 'sn_current_profile_active',
    TRANSACTIONS: `sn_${currentProfile}_transactions_v3`,
    REMINDERS: `sn_${currentProfile}_reminders_v3`,
    BIRTHDAYS: `sn_${currentProfile}_birthdays_v1`,
    BUDGETS: `sn_${currentProfile}_category_budgets_v1`,
    SCRIPT_URL: `sn_${currentProfile}_script_url`,
    THEME: `sn_${currentProfile}_theme`,
    LAST_ANALYSIS: `sn_${currentProfile}_last_analysis_date`
  }), [currentProfile]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const cloudData = await loadUserData(firebaseUser.uid);
        if (cloudData) {
          if (cloudData.transactions) setTransactions(cloudData.transactions);
          if (cloudData.reminders) setReminders(cloudData.reminders);
          if (cloudData.birthdays) setBirthdays(cloudData.birthdays);
          if (cloudData.categoryBudgets) setCategoryBudgets(cloudData.categoryBudgets);
        }
      }
    });
    return () => unsubscribe();
  }, []);

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

  useEffect(() => {
    if (user) return;
    const savedTrans = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const savedRemind = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    const savedBirth = localStorage.getItem(STORAGE_KEYS.BIRTHDAYS);
    const savedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    const savedUrl = localStorage.getItem(STORAGE_KEYS.SCRIPT_URL);
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeType;
    const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_ANALYSIS);
    
    const transData = savedTrans ? JSON.parse(savedTrans) : [];
    const remindData = savedRemind ? JSON.parse(savedRemind) : [];
    
    setTransactions(transData);
    setReminders(remindData);
    setBirthdays(savedBirth ? JSON.parse(savedBirth) : []);
    setCategoryBudgets(savedBudgets ? JSON.parse(savedBudgets) : {});
    setScriptUrl(savedUrl || '');
    if (savedTheme && THEMES[savedTheme]) setTheme(savedTheme);

    const today = new Date().toISOString().split('T')[0];
    if (lastDate !== today && (transData.length > 0 || remindData.length > 0)) {
      triggerAnalysis();
    } else {
      setAnalysis('Sua análise está atualizada para hoje. Tudo sob controle!');
    }
  }, [currentProfile, STORAGE_KEYS, user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    localStorage.setItem(STORAGE_KEYS.BIRTHDAYS, JSON.stringify(birthdays));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(categoryBudgets));
    localStorage.setItem(STORAGE_KEYS.SCRIPT_URL, scriptUrl);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    if (user) {
      saveUserData(user.uid, { transactions, reminders, birthdays, categoryBudgets });
    }
  }, [transactions, reminders, birthdays, categoryBudgets, scriptUrl, theme, STORAGE_KEYS, user]);

  const triggerAnalysis = useCallback(async () => {
    setLoadingAnalysis(true);
    const result = await getFinancialHealthAnalysis(transactions, reminders, !!scriptUrl || !!user);
    setAnalysis(result || "Análise concluída.");
    setLoadingAnalysis(false);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEYS.LAST_ANALYSIS, today);
  }, [transactions, reminders, scriptUrl, user, STORAGE_KEYS]);

  const handleUpdateBudget = (categoryName: string, amount: number) => {
    setCategoryBudgets(prev => ({ ...prev, [categoryName]: amount }));
  };

  const handleAddBirthday = (name: string, date: string) => {
    const newBirth: Birthday = { id: Math.random().toString(36).substr(2, 9), name, date };
    setBirthdays(prev => [...prev, newBirth]);
  };

  const handleDeleteBirthday = (id: string) => {
    setBirthdays(prev => prev.filter(b => b.id !== id));
  };

  const handleImportTransactions = (imported: Transaction[]) => {
    setTransactions(prev => {
      const mergedMap = new Map<string, Transaction>();
      prev.forEach(t => mergedMap.set(t.id, t));
      imported.forEach(t => mergedMap.set(t.id, t));
      return Array.from(mergedMap.values());
    });
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
      case 'analysis':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
             <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                   <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tighter uppercase">Relatório de <span className="text-brand-600">Performance</span></h1>
                   <p className="text-slate-500 font-bold text-sm mt-1">Cruzamento de dados e histórico de calor do caixa</p>
                </div>
                <button onClick={() => setView('dashboard')} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-600 font-black text-xs uppercase hover:border-brand-500 transition-all shadow-sm">
                   <LayoutDashboard size={18} /> Voltar ao Painel
                </button>
             </header>

             <MonthlyPerformanceGrid transactions={transactions} />
             <FinancialSummary transactions={transactions} />
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AccountHistory transactions={transactions} />
                <CategorySpendingChart transactions={transactions} budgets={categoryBudgets} onUpdateBudget={handleUpdateBudget} />
             </div>
          </div>
        );
      default:
        return (
          <>
            <InsightsBanner />
            <div className="mb-10 flex flex-col lg:flex-row gap-8 items-start animate-in fade-in slide-in-from-top-6 duration-700">
              <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter uppercase">Painel <span className="text-brand-600">Central</span></h1>
                    <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-[11px] font-black border border-emerald-200 shadow-sm">
                      <CheckCircle size={14} /> SEM NEURA OK
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={() => exportTransactionsToCSV(transactions)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase hover:bg-slate-800 transition-all shadow-lg active:scale-95"><Download size={18} /> Backup CSV</button>
                    <button onClick={() => setView('annual')} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-800 font-black text-xs uppercase hover:border-brand-500 hover:bg-brand-50 transition-all shadow-sm"><Calendar size={18} className="text-brand-600" /> Calendário {currentYear}</button>
                  </div>
              </div>
              <div className="w-full lg:w-1/3 bg-brand-50 border-2 border-brand-200 rounded-[2rem] p-6 shadow-brand relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 bg-brand-600 text-white rounded-lg ${loadingAnalysis ? 'animate-pulse' : ''}`}><BrainCircuit size={20} /></div>
                    <div className="flex flex-col">
                      <h4 className="font-black text-brand-900 uppercase text-xs tracking-widest leading-none">IA Conselheira</h4>
                      <span className="text-[10px] font-black text-brand-600 uppercase tracking-tighter mt-1">{loadingAnalysis ? 'Analisando...' : 'Análise do Dia'}</span>
                    </div>
                    <button 
                      onClick={triggerAnalysis} 
                      className="ml-auto text-[11px] font-black text-white bg-brand-600 px-4 py-2 rounded-full hover:bg-brand-700 hover:scale-105 active:scale-95 transition-all shadow-md border border-brand-500/30"
                    >
                      REANALISAR
                    </button>
                  </div>
                  <div className="bg-white/40 p-4 rounded-xl border border-white/60 min-h-[80px]">
                    <p className="text-sm text-slate-900 font-bold leading-relaxed italic relative z-10">"{analysis}"</p>
                  </div>
                  <div className="mt-3 text-[9px] font-black text-brand-400 uppercase tracking-widest text-right italic">
                    Último salvamento: {new Date().toLocaleTimeString('pt-BR')}
                  </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              <div className="xl:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FinanceCard title="CONTAS A PAGAR" type={TransactionType.PAYABLE} items={transactions.filter(t => t.type === TransactionType.PAYABLE)} onAdd={handleAddTransaction} onToggleStatus={handleToggleTransStatus} onDelete={handleDeleteTrans} isSyncActive={!!scriptUrl || !!user} />
                  <FinanceCard title="CONTAS A RECEBER" type={TransactionType.RECEIVABLE} items={transactions.filter(t => t.type === TransactionType.RECEIVABLE)} onAdd={handleAddTransaction} onToggleStatus={handleToggleTransStatus} onDelete={handleDeleteTrans} isSyncActive={!!scriptUrl || !!user} />
                </div>
                
                <FixedExpensesChart transactions={transactions} />
                <GoogleCalendarIntegration transactions={transactions} birthdays={birthdays} onAddBirthday={handleAddBirthday} onDeleteBirthday={handleDeleteBirthday} />
              </div>
              <div className="space-y-8 flex flex-col">
                <ReminderSection reminders={reminders} onAdd={handleAddReminder} onToggle={handleToggleReminder} onUpdate={handleUpdateReminder} onDelete={handleDeleteReminder} />
                <CategorySpendingChart transactions={transactions} budgets={categoryBudgets} onUpdateBudget={handleUpdateBudget} />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {isLoading && <LoadingScreen />}
      
      {!isLoading && (
        <>
          <HeaderWidgets />
          <div className="flex-1 flex">
            <Sidebar 
              activeView={view} 
              onViewChange={(v) => setView(v as ViewType)} 
              onExport={() => exportTransactionsToCSV(transactions)} 
              onImportTransactions={handleImportTransactions} 
              onShare={() => setIsShareModalOpen(true)} 
              onOpenProfiles={() => setIsProfileModalOpen(true)} 
              isSyncActive={!!scriptUrl || !!user} 
              currentProfile={currentProfile} 
              currentTheme={theme} 
              onThemeChange={setTheme} 
              currentUser={user}
            />
            <div className="flex-1 flex flex-col min-w-0">
              <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 lg:hidden">
                <div className="px-4 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-2" onClick={() => setView('dashboard')}><BrainCircuit className="text-brand-600" size={24} /><span className="text-xl font-black tracking-tighter uppercase">Sem Neura</span></div>
                  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
                </div>
              </nav>
              <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto">{renderMainContent()}</main>
            </div>
          </div>
        </>
      )}

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} transactions={transactions} isSyncActive={!!scriptUrl || !!user} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} profiles={profiles} currentProfile={currentProfile} onSelectProfile={setCurrentProfile} onCreateProfile={(name) => { setProfiles([...profiles, name]); setCurrentProfile(name); setIsProfileModalOpen(false); }} onDeleteProfile={(name) => { setProfiles(profiles.filter(p => p !== name)); if(currentProfile === name) setCurrentProfile('Padrão'); }} />
    </div>
  );
};

export default App;
