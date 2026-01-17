
import React, { useState, useEffect, useRef } from 'react';
import { Settings, Database, Shield, CheckCircle2, Copy, ExternalLink, HelpCircle, Send, AlertCircle, BrainCircuit, RefreshCcw, XCircle, LayoutDashboard, ArrowLeft, Palette, Check, Globe, Box, Download, FileSpreadsheet, FileJson, UploadCloud, Smartphone, Share2, Activity } from 'lucide-react';
import { syncTransactionWithSheets } from '../services/googleSheets.ts';
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
  { id: 'classic', color: 'bg-blue-600', label: 'Sem Neura Classic', desc: 'O azul profissional padrão.' },
  { id: 'emerald', color: 'bg-emerald-600', label: 'Floresta Esmeralda', desc: 'Foco e tranquilidade verde.' },
  { id: 'sunset', color: 'bg-rose-600', label: 'Sunset Rose', desc: 'Vibrante e cheio de energia.' },
  { id: 'purple', color: 'bg-violet-600', label: 'Purple Night', desc: 'Moderno e sofisticado.' },
  { id: 'midnight', color: 'bg-slate-700', label: 'Modo Midnight', desc: 'Visual escuro e sóbrio.' },
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
    // Tenta acionar o menu de compartilhamento/instalação do navegador se disponível
    if (navigator.share) {
      navigator.share({
        title: 'SEM NEURA',
        text: 'Acesse seu sistema de gestão financeira inteligente.',
        url: window.location.href,
      }).catch(() => {
        alert("Para baixar o atalho: \n1. Toque no ícone de Compartilhar\n2. Selecione 'Adicionar à Tela de Início'");
      });
    } else {
      alert("Para baixar o atalho: \n1. Toque no menu do navegador (três pontos)\n2. Selecione 'Adicionar à Tela de Início'");
    }
  };

  const handleJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ok = await importFullBackupJSON(file);
      if (ok) {
        alert("Backup JSON restaurado! Recarregando...");
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
          alert(`${imported.length} transações importadas!`);
        }
      } catch (err) {
        alert("Erro no CSV.");
      }
    }
  };

  return (
    <div className="min-h-screen pb-32 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <button onClick={onNavigateToDashboard} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-brand-600 rounded-2xl transition-all shadow-sm active:scale-95">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Central de Comando</h2>
              <p className="text-slate-500 font-bold text-sm mt-1">Status e Configurações Gerais</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${apiKeyStatus === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}>
                <BrainCircuit size={14} /> IA {apiKeyStatus === 'active' ? 'ONLINE' : 'OFFLINE'}
             </div>
             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${scriptUrl ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}>
                <Database size={14} /> NUVEM {scriptUrl ? 'CONECTADA' : 'LOCAL'}
             </div>
          </div>
        </header>

        {/* GESTÃO DE DADOS */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Database size={120} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slate-900 text-white rounded-2xl">
                  <Activity size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Gestão de Dados</h3>
                  <p className="text-slate-500 text-sm font-medium">Backup, Importação e Exportação</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <button onClick={() => exportTransactionsToCSV(transactions)} className="flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-slate-900 hover:text-white p-6 rounded-3xl border border-slate-200 transition-all group active:scale-95">
                    <Download className="text-brand-600 group-hover:text-white" size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Exportar CSV</span>
                 </button>
                 <button onClick={() => csvFileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-slate-900 hover:text-white p-6 rounded-3xl border border-slate-200 transition-all group active:scale-95">
                    <FileSpreadsheet className="text-brand-600 group-hover:text-white" size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Importar CSV</span>
                    <input type="file" ref={csvFileInputRef} onChange={handleCsvImport} accept=".csv" className="hidden" />
                 </button>
                 <button onClick={exportFullBackupJSON} className="flex flex-col items-center justify-center gap-3 bg-brand-50 hover:bg-brand-600 hover:text-white p-6 rounded-3xl border border-brand-100 transition-all group active:scale-95">
                    <FileJson className="text-brand-600 group-hover:text-white" size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Backup JSON</span>
                 </button>
                 <button onClick={() => jsonFileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-slate-900 hover:text-white p-6 rounded-3xl border border-slate-200 transition-all group active:scale-95">
                    <UploadCloud className="text-brand-600 group-hover:text-white" size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Restaurar JSON</span>
                    <input type="file" ref={jsonFileInputRef} onChange={handleJsonImport} accept=".json" className="hidden" />
                 </button>
              </div>
           </div>
        </section>

        {/* ATALHO APP E COMPARTILHAMENTO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-brand-600 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Smartphone size={100} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Acesso Rápido Mobile</h3>
                <p className="text-brand-100 text-sm font-medium mb-8">Baixe o atalho do SEM NEURA diretamente para sua tela inicial.</p>
                <button 
                  onClick={handleInstallShortcut}
                  className="flex items-center gap-3 bg-white text-brand-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  <Smartphone size={18} /> Baixar Atalho Mobile
                </button>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl relative overflow-hidden">
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">Compartilhamento</h3>
              <p className="text-slate-500 text-sm font-medium mb-8">Compartilhe o acesso ao seu painel (Apenas Leitura Local).</p>
              <div className="flex gap-4">
                 <button 
                   onClick={handleCopyAppUrl}
                   className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${copiedLink ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                 >
                   {copiedLink ? <Check size={18} /> : <Share2 size={18} />}
                   {copiedLink ? 'Link Copiado' : 'Copiar Link'}
                 </button>
              </div>
           </div>
        </section>

        {/* TEMAS */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl">
           <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
              <Palette size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Personalização</h3>
              <p className="text-slate-500 text-sm font-medium">Cores e identidade visual</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {THEME_OPTIONS.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`flex flex-col items-start p-6 rounded-3xl border-2 transition-all ${currentTheme === theme.id ? 'border-brand-600 bg-brand-50/30 shadow-lg scale-105' : 'border-slate-100 bg-slate-50/30 hover:border-slate-300'}`}
              >
                <div className={`w-12 h-12 rounded-2xl ${theme.color} mb-4 shadow-lg flex items-center justify-center text-white`}>
                  {currentTheme === theme.id && <Check size={24} />}
                </div>
                <h4 className="font-black text-sm uppercase mb-1">{theme.label}</h4>
                <p className="text-xs text-slate-500 font-medium">{theme.desc}</p>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
