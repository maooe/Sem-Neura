
import React from 'react';
import { LayoutDashboard, Calendar, CreditCard, TrendingUp, Download, Settings, BrainCircuit, Share2, ChevronDown, UserCircle } from 'lucide-react';

interface SidebarProps {
  activeView: 'dashboard' | 'annual' | 'pagar' | 'receber' | 'settings';
  onViewChange: (view: 'dashboard' | 'annual' | 'pagar' | 'receber' | 'settings') => void;
  onExport: () => void;
  onShare: () => void;
  onOpenProfiles: () => void;
  isSyncActive: boolean;
  currentProfile: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  onExport, 
  onShare, 
  onOpenProfiles,
  isSyncActive, 
  currentProfile 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'annual', label: 'Calendário 2026', icon: Calendar },
    { id: 'pagar', label: 'Contas a Pagar', icon: CreditCard },
    { id: 'receber', label: 'Contas a Receber', icon: TrendingUp },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl">
          <BrainCircuit size={24} className="text-white" />
        </div>
        <span className="text-xl font-black text-white tracking-tighter uppercase">Sem Neura</span>
      </div>

      {/* Perfil Selector */}
      <div className="px-6 mb-8">
        <button 
          onClick={onOpenProfiles}
          className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-black text-xs uppercase">
              {currentProfile.charAt(0)}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1">Perfil Ativo</p>
              <p className="text-sm font-bold text-white truncate">{currentProfile}</p>
            </div>
          </div>
          <ChevronDown size={14} className="text-slate-500 group-hover:text-white transition-colors" />
        </button>
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
        
        <button
          onClick={onShare}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-blue-400 hover:bg-blue-500/10"
        >
          <Share2 size={18} />
          Compartilhar Link
        </button>
      </nav>

      <div className="p-4 space-y-3">
        <button 
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all text-sm font-bold border border-slate-700"
        >
          <Download size={16} /> Exportar CSV
        </button>
        
        <div className={`p-4 rounded-2xl border transition-colors ${isSyncActive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700/50'}`}>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Sincronização</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSyncActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></div>
            <span className={`text-[11px] font-black uppercase ${isSyncActive ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isSyncActive ? 'BACKUP NA NUVEM OK' : 'LOCAL (SEM NUVEM)'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
