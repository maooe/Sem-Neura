
import React from 'react';
import { LayoutDashboard, Calendar, CreditCard, TrendingUp, Download, Bell, BrainCircuit } from 'lucide-react';

interface SidebarProps {
  activeView: 'dashboard' | 'annual' | 'pagar' | 'receber';
  onViewChange: (view: 'dashboard' | 'annual' | 'pagar' | 'receber') => void;
  onExport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onExport }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'annual', label: 'Calendário 2026', icon: Calendar },
    { id: 'pagar', label: 'Contas a Pagar', icon: CreditCard },
    { id: 'receber', label: 'Contas a Receber', icon: TrendingUp },
  ] as const;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl">
          <BrainCircuit size={24} className="text-white" />
        </div>
        <span className="text-xl font-black text-white tracking-tighter">SEM NEURA</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Menu Principal</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              activeView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-3">
        <button 
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all text-sm font-bold border border-slate-700"
        >
          <Download size={16} /> Exportar CSV
        </button>
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Sincronização</p>
          <div className="flex items-center gap-2 text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs font-medium">Backup Automático Ativo</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
