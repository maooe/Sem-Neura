
import React, { useRef } from 'react';
import { LayoutDashboard, Calendar, CreditCard, TrendingUp, Download, Settings, BrainCircuit, Share2, ChevronDown, Palette, Check, FileJson, UploadCloud, FileSpreadsheet } from 'lucide-react';
import { ThemeType, Transaction } from '../types';
import { exportFullBackupJSON, importFullBackupJSON } from '../utils/backup';
import { importTransactionsFromCSV } from '../utils/export';

interface SidebarProps {
  activeView: 'dashboard' | 'annual' | 'pagar' | 'receber' | 'settings';
  onViewChange: (view: 'dashboard' | 'annual' | 'pagar' | 'receber' | 'settings') => void;
  onExport: () => void;
  onShare: () => void;
  onOpenProfiles: () => void;
  onImportTransactions: (transactions: Transaction[]) => void;
  isSyncActive: boolean;
  currentProfile: string;
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
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
  onExport, 
  onShare, 
  onOpenProfiles,
  onImportTransactions,
  isSyncActive, 
  currentProfile,
  currentTheme,
  onThemeChange
}) => {
  const jsonFileInputRef = useRef<HTMLInputElement>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'annual', label: 'Calendário Anual', icon: Calendar },
    { id: 'pagar', label: 'Contas a Pagar', icon: CreditCard },
    { id: 'receber', label: 'Contas a Receber', icon: TrendingUp },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ] as const;

  const handleJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ok = await importFullBackupJSON(file);
      if (ok) {
        alert("Backup JSON restaurado com sucesso! A página será recarregada.");
        window.location.reload();
      } else {
        alert("Erro ao restaurar o backup JSON. Verifique o arquivo.");
      }
    }
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const transactions = await importTransactionsFromCSV(file);
        if (transactions.length > 0) {
          onImportTransactions(transactions);
          alert(`${transactions.length} transações importadas com sucesso!`);
        } else {
          alert("Nenhuma transação válida encontrada no CSV.");
        }
      } catch (err) {
        alert("Erro ao processar arquivo CSV. Certifique-se de que é um arquivo exportado pelo app.");
        console.error(err);
      }
    }
    // Limpa o input para permitir subir o mesmo arquivo novamente
    if (csvFileInputRef.current) csvFileInputRef.current.value = '';
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0 overflow-y-auto custom-scrollbar border-r border-white/5">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-brand-600 p-2 rounded-xl transition-colors duration-500 shadow-brand">
          <BrainCircuit size={24} className="text-white" />
        </div>
        <span className="text-xl font-black text-white tracking-tighter uppercase">Sem Neura</span>
      </div>

      <div className="px-6 mb-8">
        <button 
          onClick={onOpenProfiles}
          className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-xs uppercase shadow-brand transition-colors duration-500">
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

      <div className="p-4 mt-auto space-y-3">
        <button 
          onClick={onShare}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-brand-500 hover:bg-white/5"
        >
          <Share2 size={18} />
          Compartilhar
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={onExport}
            title="Exportar Transações (CSV)"
            className="flex flex-col items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all text-[9px] font-black uppercase border border-slate-700"
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={() => csvFileInputRef.current?.click()}
            title="Importar Transações (CSV)"
            className="flex flex-col items-center justify-center gap-1 bg-white hover:bg-slate-50 text-slate-900 py-3 rounded-xl transition-all text-[9px] font-black uppercase border border-slate-200"
          >
            <FileSpreadsheet size={14} className="text-brand-600" /> Import CSV
            <input 
              type="file" 
              ref={csvFileInputRef} 
              onChange={handleCsvImport} 
              accept=".csv" 
              className="hidden" 
            />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
           <button 
            onClick={exportFullBackupJSON}
            title="Backup Completo (JSON)"
            className="flex flex-col items-center justify-center gap-1 bg-brand-600/10 hover:bg-brand-600 text-brand-500 hover:text-white py-3 rounded-xl transition-all text-[9px] font-black uppercase border border-brand-500/20"
          >
            <FileJson size={14} /> Back JSON
          </button>
          <button 
            onClick={() => jsonFileInputRef.current?.click()}
            title="Restaurar Backup (JSON)"
            className="flex flex-col items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white py-3 rounded-xl transition-all text-[9px] font-black uppercase border border-slate-700"
          >
            <UploadCloud size={14} /> Rest JSON
            <input 
              type="file" 
              ref={jsonFileInputRef} 
              onChange={handleJsonImport} 
              accept=".json" 
              className="hidden" 
            />
          </button>
        </div>
        
        <div className={`p-4 rounded-2xl border transition-colors ${isSyncActive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700/50'}`}>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Cloud Sync</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSyncActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></div>
            <span className={`text-[11px] font-black uppercase ${isSyncActive ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isSyncActive ? 'Ativo' : 'Apenas Local'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
