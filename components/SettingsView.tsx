
import React, { useState, useEffect } from 'react';
import { Settings, Database, Shield, CheckCircle2, Copy, ExternalLink, HelpCircle, Send, AlertCircle, BrainCircuit, RefreshCcw, XCircle, LayoutDashboard, ArrowLeft, Palette, Check, Globe, Box, Github, Zap, ShieldCheck, Activity } from 'lucide-react';
import { syncTransactionWithSheets } from '../services/googleSheets.ts';
import { TransactionType, ThemeType } from '../types.ts';

interface SettingsViewProps {
  scriptUrl: string;
  onUrlChange: (url: string) => void;
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onNavigateToDashboard: () => void;
}

const THEME_OPTIONS: { id: ThemeType; color: string; label: string; desc: string }[] = [
  { id: 'classic', color: 'bg-blue-600', label: 'Sem Neura Classic', desc: 'O azul profissional padrão.' },
  { id: 'emerald', color: 'bg-emerald-600', label: 'Floresta Esmeralda', desc: 'Foco e tranquilidade verde.' },
  { id: 'sunset', color: 'bg-rose-600', label: 'Sunset Rose', desc: 'Vibrante e cheio de energia.' },
  { id: 'purple', color: 'bg-violet-600', label: 'Purple Night', desc: 'Moderno e sofisticado.' },
  { id: 'midnight', color: 'bg-slate-700', label: 'Modo Midnight', desc: 'Visual escuro e sóbrio.' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ scriptUrl, onUrlChange, currentTheme, onThemeChange, onNavigateToDashboard }) => {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<'active' | 'inactive'>('inactive');

  useEffect(() => {
    // Checa se a API_KEY está configurada no ambiente
    if (process.env.API_KEY && process.env.API_KEY.length > 5) {
      setApiKeyStatus('active');
    }
  }, []);

  const scriptCode = `function doGet() { ... code ... }`; // Simplificado para brevidade

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    if (!scriptUrl) return;
    setTesting(true);
    setTestResult(null);
    const success = await syncTransactionWithSheets(scriptUrl, { description: 'Teste' } as any);
    setTestResult(success ? 'success' : 'error');
    setTesting(false);
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
              <p className="text-slate-500 font-bold text-sm mt-1">Status do Sistema e Hospedagem</p>
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

        {/* ALERTA DE BLOQUEIO NETLIFY E ALTERNATIVAS */}
        <section className="bg-rose-600 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden border-4 border-white">
           <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <Zap size={200} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white text-rose-600 rounded-2xl shadow-xl">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Netlify Bloqueado? Não pare!</h3>
                  <p className="text-rose-100 text-sm font-bold">Seu limite de crédito estourou, mas você pode migrar em 2 minutos.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/20 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <Github size={24} />
                    <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded">100% GRÁTIS</span>
                  </div>
                  <h4 className="font-black uppercase text-sm mb-2">GitHub Pages</h4>
                  <p className="text-[11px] text-rose-50 leading-relaxed mb-4">Ideal para quem já tem o código no GitHub. Sem limites de crédito chatos para sites pequenos.</p>
                  <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-white text-rose-600 px-4 py-2 rounded-full group-hover:scale-105 transition-transform">
                    Ver Tutorial <ExternalLink size={12} />
                  </button>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/20 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <Zap size={24} className="text-amber-300" />
                    <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded">ALTA PERFORMANCE</span>
                  </div>
                  <h4 className="font-black uppercase text-sm mb-2">Vercel</h4>
                  <p className="text-[11px] text-rose-50 leading-relaxed mb-4">A melhor alternativa ao Netlify. Basta conectar seu GitHub e o deploy é automático e gratuito.</p>
                  <a href="https://vercel.com" target="_blank" className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-white text-rose-600 px-4 py-2 rounded-full group-hover:scale-105 transition-transform w-fit">
                    Ir para Vercel <ExternalLink size={12} />
                  </a>
                </div>
              </div>
           </div>
        </section>

        {/* DIAGNÓSTICO DE SAÚDE DO APP */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-slate-100 text-slate-900 rounded-2xl">
              <Activity size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Saúde da Aplicação</h3>
              <p className="text-slate-500 text-sm font-medium">Verificação de módulos e chaves</p>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <BrainCircuit className={apiKeyStatus === 'active' ? 'text-emerald-500' : 'text-slate-300'} />
                  <div>
                    <p className="text-sm font-black uppercase text-slate-700">Inteligência Artificial (Gemini)</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{apiKeyStatus === 'active' ? 'Chave detectada e ativa' : 'Chave não configurada no servidor'}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black ${apiKeyStatus === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {apiKeyStatus === 'active' ? 'OPERACIONAL' : 'DESATIVADO'}
                </div>
             </div>

             <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Database className={scriptUrl ? 'text-emerald-500' : 'text-slate-300'} />
                  <div>
                    <p className="text-sm font-black uppercase text-slate-700">Backup em Nuvem (Google Sheets)</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{scriptUrl ? 'Link configurado' : 'Aguardando URL do script'}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black ${scriptUrl ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {scriptUrl ? 'CONECTADO' : 'MODO LOCAL'}
                </div>
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
