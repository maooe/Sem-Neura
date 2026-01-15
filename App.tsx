
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType, Reminder, ExtendedStatus } from './types';
import { FinanceCard } from './components/FinanceCard';
import { ReminderSection } from './components/ReminderSection';
import { GoogleCalendarIntegration } from './components/GoogleCalendarIntegration';
import { AnnualCalendar2026 } from './components/AnnualCalendar2026';
import { Sidebar } from './components/Sidebar';
import { getFinancialHealthAnalysis } from './services/gemini';
import { exportTransactionsToCSV } from './utils/export';
import { BrainCircuit, Menu, X, Heart, LayoutDashboard, Calendar, Download } from 'lucide-react';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [analysis, setAnalysis] = useState<string>('Boas-vindas a Janeiro de 2026! Comece alimentando seus dados para uma análise sem neura.');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [view, setView] = useState<'dashboard' | 'annual' | 'pagar' | 'receber'>('dashboard');

  useEffect(() => {
    const savedTrans = localStorage.getItem('sn_transactions_v3');
    const savedRemind = localStorage.getItem('sn_reminders_v3');
    
    if (savedTrans) setTransactions(JSON.parse(savedTrans));
    if (savedRemind) setReminders(JSON.parse(savedRemind));
  }, []);

  useEffect(() => {
    localStorage.setItem('sn_transactions_v3', JSON.stringify(transactions));
    localStorage.setItem('sn_reminders_v3', JSON.stringify(reminders));
  }, [transactions, reminders]);

  const handleAddTransaction = (item: Partial<Transaction>) => {
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
      setAnalysis("Adicione lançamentos para que eu possa analisar seu Janeiro de 2026!");
      return;
    }
    setLoadingAnalysis(true);
    const result = await getFinancialHealthAnalysis(transactions, reminders);
    setAnalysis(result || "Análise concluída com sucesso.");
    setLoadingAnalysis(false);
  }, [transactions, reminders]);

  const handleExport = () => {
    exportTransactionsToCSV(transactions);
  };

  const renderMainContent = () => {
    switch (view) {
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
              />
          </div>
        );
      default:
        return (
          <>
            <div className="mb-10 flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 w-full">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tighter">
                    Janeiro <span className="text-blue-600">2026</span>
                  </h1>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button 
                      onClick={handleExport}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                      <Download size={18} /> Exportar Backup CSV
                    </button>
                    <button 
                      onClick={() => setView('annual')}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
                    >
                      <Calendar size={18} className="text-blue-500" /> Ver Calendário Anual
                    </button>
                  </div>
              </div>
              
              <div className="w-full lg:w-1/3 bg-indigo-50 border border-indigo-100 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 bg-indigo-600 text-white rounded-lg ${loadingAnalysis ? 'animate-pulse' : ''}`}>
                      <BrainCircuit size={20} />
                    </div>
                    <h4 className="font-bold text-indigo-900">IA CONSELHEIRA</h4>
                    <button onClick={triggerAnalysis} className="ml-auto text-xs font-bold text-indigo-600 hover:underline">Atualizar</button>
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
              />
              <FinanceCard 
                title="RECEBER"
                type={TransactionType.RECEIVABLE}
                items={transactions.filter(t => t.type === TransactionType.RECEIVABLE)}
                onAdd={handleAddTransaction}
                onToggleStatus={handleToggleTransStatus}
                onDelete={handleDeleteTrans}
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
      <Sidebar activeView={view} onViewChange={setView} onExport={handleExport} />

      <div className="flex-1 flex flex-col min-w-0">
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 lg:hidden">
          <div className="px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2" onClick={() => setView('dashboard')}>
              <BrainCircuit className="text-blue-600" size={24} />
              <span className="text-xl font-black tracking-tighter">SEM NEURA</span>
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
              <button onClick={handleExport} className="w-full text-left py-2 px-4 font-bold flex items-center gap-2 border-t pt-4 text-blue-600"><Download size={18}/> Exportar CSV</button>
            </div>
          )}
        </nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {renderMainContent()}
        </main>

        <footer className="p-10 border-t border-slate-200 mt-auto bg-white">
           <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
              <p>&copy; 2026 SEM NEURA - Gestão Inteligente</p>
              <div className="flex items-center gap-1">
                 Feito com <Heart size={14} className="text-red-400 fill-current" /> para sua organização.
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
