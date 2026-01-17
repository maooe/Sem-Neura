
import React, { useRef } from 'react';
import { LayoutDashboard, Calendar, CreditCard, TrendingUp, Download, Settings, BrainCircuit, Share2, ChevronDown, Palette, Check, FileJson, UploadCloud, FileSpreadsheet, LogIn, LogOut, User as UserIcon, Thermometer } from 'lucide-react';
import { ThemeType, Transaction } from '../types';
import { loginWithGoogle, logout } from '../services/firebase';
import { User } from 'firebase/auth';

interface SidebarProps {
  activeView: 'dashboard' | 'annual' | 'analysis' | 'pagar' | 'receber' | 'settings';
  onViewChange: (view: 'dashboard' | 'annual' | 'analysis' | 'pagar' | 'receber' | 'settings') => void;
  onExport: () => void;
  onShare: () => void;
  onOpenProfiles: () => void;
  onImportTransactions: (transactions: Transaction[]) => void;
  isSyncActive: boolean;
  currentProfile: string;
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  currentUser: User | null;
}

const THEME_OPTIONS: { id: ThemeType; color: string; label: string }[] = [
  { id: 'classic', color: 'bg-blue-600', label: 'Classic' },
  { id: 'emerald', color: 'bg-emerald-600', label: 'Emerald' },
  { id: 'sunset', color: 'bg-rose-600', label: 'Sunset' },
  { id: 'purple', color: 'bg-violet-600', label: 'Purple' },
  { id: 'midnight', color: 'bg-slate-700', label: 'Midnight' },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  onOpenProfiles,
  isSyncActive, 
  currentProfile,
  currentTheme,
  onThemeChange,
  currentUser
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analysis', label: 'Análise Financeira', icon: Thermometer },
    { id: 'annual', label: 'Calendário Anual', icon: Calendar },
    { id: 'pagar', label: 'Contas a Pagar', icon: CreditCard },
    { id: 'receber', label: 'Contas a Receber', icon: TrendingUp },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0 overflow-y-auto custom-scrollbar border-r border-white/5">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-brand-600 p-2 rounded-xl transition-colors duration-500 shadow-brand">
          <BrainCircuit size={24} className="text-white" />
        </div>
        <span className="text-xl font-black text-white tracking-tighter uppercase">Sem Neura</span>
      </div>

      <div className="px-6 mb-8 space-y-4">
        {!currentUser ? (
          <button 
            onClick={() => loginWithGoogle()}
            className="w-full flex items-center gap-3 p-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl transition-all shadow-brand font-black text-xs uppercase"
          >
            <LogIn size={18} />
            Entrar com Google
          </button>
        ) : (
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group">
             <div className="flex items-center gap-3 overflow-hidden">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} className="w-8 h-8 rounded-full border border-white/20" alt="Avatar" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white"><UserIcon size={14}/></div>
                )}
                <div className="text-left overflow-hidden">
                  <p className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1">Logado como</p>
                  <p className="text-xs font-bold text-white truncate">{currentUser.displayName?.split(' ')[0]}</p>
                </div>
             </div>
             <button onClick={() => logout()} className="text-slate-500 hover:text-rose-500 transition-colors">
                <LogOut size={14} />
             </button>
          </div>
        )}

        <button 
          onClick={onOpenProfiles}
          className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-xs uppercase shadow-brand transition-colors duration-500">
              {currentProfile.charAt(0)}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1">Perfil Local</p>
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
                ? 'bg-brand-600 text-white shadow-brand' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
        
        <div className="pt-6 px-4">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Palette size={12} /> Aparência
           </p>
           <div className="flex flex-wrap gap-2">
              {THEME_OPTIONS.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange(theme.id)}
                  title={theme.label}
                  className={`w-8 h-8 rounded-full ${theme.color} border-2 transition-all flex items-center justify-center relative active:scale-90 ${currentTheme === theme.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  {currentTheme === theme.id && <Check size={14} className="text-white" />}
                </button>
              ))}
           </div>
        </div>
      </nav>

      <div className="p-4 mt-auto">
        <div className={`p-4 rounded-2xl border transition-colors ${isSyncActive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700/50'}`}>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Sync Ativo</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSyncActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></div>
            <span className={`text-[11px] font-black uppercase ${isSyncActive ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isSyncActive ? 'Nuvem Conectada' : 'Apenas Local'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
