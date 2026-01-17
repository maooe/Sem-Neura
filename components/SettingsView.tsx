
import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Database, Check, Download, FileSpreadsheet, FileJson, 
  UploadCloud, Smartphone, Share2, Activity, ArrowLeft, Palette, 
  BrainCircuit, Info, ShieldCheck, Share, Apple, Laptop, Trash2
} from 'lucide-react';
import { ThemeType, Transaction } from '../types.ts';
import { exportFullBackupJSON, importFullBackupJSON } from '../utils/backup';
import { exportTransactionsToCSV, importTransactionsFromCSV } from '../utils/export';

interface SettingsViewProps {
  scriptUrl: string;
  onUrlChange: (url: string) => void;
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onNavigateToDashboard: () => void;
  transactions: Transaction[];
  onImportTransactions: (transactions: Transaction[]) => void;
}

const THEME_OPTIONS: { id: ThemeType; color: string; label: string; desc: string }[] = [
  { id: 'classic', color: 'bg-blue-600', label: 'Classic Blue', desc: 'Visual executivo padrão.' },
  { id: 'emerald', color: 'bg-emerald-600', label: 'Eco Emerald', desc: 'Foco e equilíbrio verde.' },
  { id: 'sunset', color: 'bg-rose-600', label: 'Sunset Glow', desc: 'Energia e calor vibrante.' },
  { id: 'purple', color: 'bg-violet-600', label: 'Vivid Purple', desc: 'Moderna e criativa.' },
  { id: 'midnight', color: 'bg-slate-700', label: 'Dark Mode', desc: 'Sóbrio e confortável.' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  scriptUrl, 
  onUrlChange, 
  currentTheme, 
  onThemeChange, 
  onNavigateToDashboard,
  transactions,
  onImportTransactions
}) => {
  const [apiKeyStatus, setApiKeyStatus] = useState<'active' | 'inactive'>('inactive');
  const [copiedLink, setCopiedLink] = useState(false);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll para o topo para garantir visibilidade no mobile
    window.scrollTo(0, 0);

    if (typeof process !== 'undefined' && process?.env?.API_KEY && process.env.API_KEY.length > 5) {
      setApiKeyStatus('active');
    } else if ((window as any).API_KEY) {
      setApiKeyStatus('active');
    }
  }, []);

  const handleCopyAppUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleInstallShortcut = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isIOS) {
      alert("Para instalar no seu iPhone:\n\n1. Toque no ícone de 'Compartilhar' (o quadrado com seta no pé do Safari)\n2. Role a lista e toque em 'Adicionar à Tela de Início'\n3. Pronto! O Sem Neura estará nos seus Apps.");
    } else if (navigator.share) {
      navigator.share({
        title: 'SEM NEURA',
        text: 'Acesse seu sistema financeiro v02/2026',
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert("Para baixar o atalho:\nAbra o menu do seu navegador e selecione 'Instalar Aplicativo' ou 'Adicionar à tela de início'.");
    }
  };

  const handleJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ok = await importFullBackupJSON(file);
      if (ok) {
        alert("Backup JSON restaurado! O sistema será reiniciado.");
        window.location.reload();
      }
    }
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await importTransactionsFromCSV(file);
        if (imported.length > 0) {
          onImportTransactions(imported);
          alert(`${imported.length} lançamentos importados com sucesso!`);
        }
      } catch (err) {
        alert("Erro no arquivo CSV. Verifique o padrão de colunas.");
      }
    }
  };

  return (
    <div className="min-h-screen pb-40 md:pb-20 animate-in fade-in duration-500 bg-slate-50/50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onNavigateToDashboard} 
              className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-brand-600 rounded-2xl transition-all shadow-sm active:scale-95"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Ajustes v02/2026</h2>
              <p className="text-slate-500 font-bold text-xs md:text-sm mt-1">Gestão de dados e personalização</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
             <div className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${apiKeyStatus === 'active' ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg' : 'bg-slate-200 text-slate-500'}`}>
                <BrainCircuit size={14} /> IA ATIVA
             </div>
             <div className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${scriptUrl ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg' : 'bg-slate-200 text-slate-500'}`}>
                <Database size={14} /> CLOUD OK
             </div>
          </div>
        </header>

        {/* GESTÃO DE DADOS - CENTRALIZADO */}
        <section className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-xl overflow-hidden relative">
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Módulo de Dados</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Controle total sobre seus arquivos</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <button onClick={() => exportTransactionsToCSV(transactions)} className="flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-slate-900 hover:text-white p-6 rounded-3xl border border-slate-200 transition-all group active:scale-95">
                    <FileSpreadsheet className="text-brand-600 group-hover:text-white" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Exportar CSV</span>
                 </button>
                 
                 <button onClick={() => csvFileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-slate-900 hover:text-white p-6 rounded-3xl border border-slate-200 transition-all group active:scale-95">
                    <UploadCloud className="text-brand-600 group-hover:text-white" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Importar CSV</span>
                    <input type="file" ref={csvFileInputRef} onChange={handleCsvImport} accept=".csv" className="hidden" />
                 </button>

                 <button onClick={exportFullBackupJSON} className="flex flex-col items-center justify-center gap-3 bg-brand-50 hover:bg-brand-600 hover:text-white p-6 rounded-3xl border border-brand-200 transition-all group active:scale-95">
                    <FileJson className="text-brand-600 group-hover:text-white" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Backup JSON</span>
                 </button>

                 <button onClick={() => jsonFileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-slate-900 hover:text-white p-6 rounded-3xl border border-slate-200 transition-all group active:scale-95">
                    <Download className="text-brand-600 group-hover:text-white" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Restaurar JSON</span>
                    <input type="file" ref={jsonFileInputRef} onChange={handleJsonImport} accept=".json" className="hidden" />
                 </button>
              </div>
           </div>
        </section>

        {/* ATALHO E COMPARTILHAMENTO - MOBILE FIRST */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                 <Smartphone size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                   <Apple size={20} className="text-brand-400" />
                   <h3 className="text-xl font-black uppercase tracking-tight">Atalho para iPhone</h3>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">Transforme este site em um aplicativo na sua tela de início sem ocupar memória.</p>
                <button 
                  onClick={handleInstallShortcut}
                  className="w-full md:w-auto flex items-center justify-center gap-3 bg-brand-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-brand-500 active:scale-95 transition-all"
                >
                  <Smartphone size={20} /> Baixar Atalho Mobile
                </button>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                 <Share2 size={20} className="text-brand-600" />
                 <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Compartilhar Link</h3>
              </div>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Envie seu painel para outros dispositivos. Os dados são mantidos locais.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                   onClick={handleCopyAppUrl}
                   className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-md ${copiedLink ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                 >
                   {copiedLink ? <Check size={18} /> : <Share2 size={18} />}
                   {copiedLink ? 'Copiado!' : 'Copiar URL do App'}
                 </button>
                 <button 
                   onClick={() => navigator.share && navigator.share({title: 'Sem Neura', url: window.location.href})}
                   className="hidden sm:flex flex-none items-center justify-center p-5 rounded-2xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all border border-brand-100"
                 >
                   <Share size={24} />
                 </button>
              </div>
           </div>
        </section>

        {/* TEMAS */}
        <section className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-xl">
           <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
              <Palette size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Customização</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ajuste o visual do sistema</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEME_OPTIONS.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`flex flex-col items-start p-6 rounded-3xl border-2 transition-all ${currentTheme === theme.id ? 'border-brand-600 bg-brand-50/50 shadow-md scale-[1.02]' : 'border-slate-100 bg-slate-50/50 hover:border-slate-300'}`}
              >
                <div className={`w-10 h-10 rounded-2xl ${theme.color} mb-4 shadow-lg flex items-center justify-center text-white`}>
                  {currentTheme === theme.id && <Check size={20} />}
                </div>
                <h4 className="font-black text-sm uppercase mb-1">{theme.label}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{theme.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* RODAPÉ DE STATUS */}
        <div className="flex flex-col items-center gap-6 text-center py-12">
           <div className="p-4 bg-white rounded-full border border-slate-200 shadow-sm opacity-50">
              <ShieldCheck size={32} className="text-emerald-500" />
           </div>
           <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
                Sem Neura v02/2026 • Juiz de Fora - MG
              </p>
              <p className="text-[9px] text-slate-400 font-bold max-w-xs mx-auto leading-relaxed uppercase">
                Seus dados são criptografados localmente. Nenhuma informação financeira é enviada para servidores externos sem sua autorização.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};
