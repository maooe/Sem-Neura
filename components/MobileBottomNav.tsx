
import React, { useState } from 'react';
import { LayoutDashboard, CreditCard, TrendingUp, Thermometer, Settings, Plus, X, BrainCircuit, Bell } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: string;
  onViewChange: (view: any) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeView, onViewChange }) => {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'pagar', label: 'Pagar', icon: CreditCard },
    { id: 'receber', label: 'Receber', icon: TrendingUp },
    { id: 'analysis', label: 'Análise', icon: Thermometer },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <>
      {/* Overlay para Ações Rápidas */}
      {showQuickActions && (
        <div 
          className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowQuickActions(false)}
        >
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-xs space-y-3 px-4 animate-in slide-in-from-bottom-10 duration-300">
             <button 
              onClick={() => { onViewChange('pagar'); setShowQuickActions(false); }}
              className="w-full bg-white p-5 rounded-3xl shadow-xl flex items-center justify-between group active:scale-95 transition-all"
             >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl"><CreditCard size={20} /></div>
                  <span className="font-black uppercase text-xs text-slate-800">Lançar Pagar</span>
                </div>
                <Plus size={16} className="text-slate-300" />
             </button>
             <button 
              onClick={() => { onViewChange('receber'); setShowQuickActions(false); }}
              className="w-full bg-white p-5 rounded-3xl shadow-xl flex items-center justify-between group active:scale-95 transition-all"
             >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><TrendingUp size={20} /></div>
                  <span className="font-black uppercase text-xs text-slate-800">Lançar Receber</span>
                </div>
                <Plus size={16} className="text-slate-300" />
             </button>
             <button 
              onClick={() => { onViewChange('dashboard'); setShowQuickActions(false); }}
              className="w-full bg-slate-900 p-5 rounded-3xl shadow-xl flex items-center justify-between group active:scale-95 transition-all"
             >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-600 text-white rounded-2xl"><Bell size={20} /></div>
                  <span className="font-black uppercase text-xs text-white">Novo Lembrete</span>
                </div>
                <Plus size={16} className="text-slate-500" />
             </button>
          </div>
        </div>
      )}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[120] bg-white/90 backdrop-blur-2xl border-t border-slate-200 px-4 pb-safe shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex justify-between items-center h-20">
          
          {/* Botões da Esquerda */}
          <div className="flex gap-4">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeView === 'dashboard' ? 'text-brand-600' : 'text-slate-400'}`}
            >
              <LayoutDashboard size={22} strokeWidth={activeView === 'dashboard' ? 2.5 : 2} />
              <span className="text-[9px] font-black uppercase tracking-tighter">Início</span>
            </button>
            <button
              onClick={() => onViewChange('analysis')}
              className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeView === 'analysis' ? 'text-brand-600' : 'text-slate-400'}`}
            >
              <Thermometer size={22} strokeWidth={activeView === 'analysis' ? 2.5 : 2} />
              <span className="text-[9px] font-black uppercase tracking-tighter">Relatórios</span>
            </button>
          </div>

          {/* Botão Central FAB */}
          <button 
            onClick={() => setShowQuickActions(!showQuickActions)}
            className={`-translate-y-8 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 border-4 border-white ${showQuickActions ? 'bg-slate-900 rotate-45' : 'bg-brand-600'}`}
          >
            <Plus size={32} className="text-white" strokeWidth={3} />
          </button>

          {/* Botões da Direita */}
          <div className="flex gap-4">
            <button
              onClick={() => onViewChange('pagar')}
              className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeView === 'pagar' ? 'text-brand-600' : 'text-slate-400'}`}
            >
              <CreditCard size={22} strokeWidth={activeView === 'pagar' ? 2.5 : 2} />
              <span className="text-[9px] font-black uppercase tracking-tighter">Contas</span>
            </button>
            <button
              onClick={() => onViewChange('settings')}
              className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeView === 'settings' ? 'text-brand-600' : 'text-slate-400'}`}
            >
              <Settings size={22} strokeWidth={activeView === 'settings' ? 2.5 : 2} />
              <span className="text-[9px] font-black uppercase tracking-tighter">Ajustes</span>
            </button>
          </div>

        </div>
      </nav>
    </>
  );
};
