
import React from 'react';
import { X, Copy, CheckCircle2, Share2, Globe, ShieldCheck, AlertTriangle, ExternalLink, Zap, Github, Info } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  isSyncActive: boolean;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, transactions, isSyncActive }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const isTemporaryEnv = window.location.protocol === 'blob:' || window.location.hostname.includes('usercontent.goog');
  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-300">
        <div className="relative p-8 bg-slate-900 text-white overflow-hidden">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Share2 size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter">Link de Acesso Real</h3>
          </div>

          {isTemporaryEnv && (
            <div className="mb-6 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Github size={20} className="text-blue-400" />
                <p className="text-xs font-black uppercase tracking-widest text-blue-400">Ative seu link no GitHub</p>
              </div>
              <div className="space-y-3">
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Como você já tem o código no GitHub, siga estes 3 passos para ter seu link <b>.github.io</b>:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "No seu GitHub, clique em 'Settings' (engrenagem no topo).",
                    "No menu lateral esquerdo, clique em 'Pages'.",
                    "Em 'Build and deployment', selecione a branch 'main' e clique em 'Save'."
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3 text-[10px] bg-white/5 p-2 rounded-lg border border-white/5 text-slate-400">
                      <span className="font-black text-blue-500">{i+1}</span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="p-3 bg-white/10 rounded-xl text-blue-400">
              <Globe size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">URL Atual (Apenas Local)</p>
              <p className="text-xs font-mono truncate text-blue-200">{currentUrl}</p>
            </div>
            <button 
              onClick={handleCopyLink}
              className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
            >
              {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-start gap-4">
             <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
               <Info size={20} />
             </div>
             <div>
               <p className="text-sm font-black text-indigo-900 uppercase mb-1">Por que o link blob não funciona?</p>
               <p className="text-[11px] text-indigo-800 leading-relaxed">
                 O link que começa com <b>blob:</b> é uma memória temporária do seu navegador atual. 
                 Ao ativar o <b>GitHub Pages</b>, você ganha um link mundial como: <br/>
                 <code className="bg-indigo-200/50 px-1 rounded text-indigo-900 font-bold">https://seu-usuario.github.io/Sem-Neura/</code>
               </p>
             </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Privacidade</p>
              <p className="text-xs text-slate-500">Seus dados financeiros nunca saem do seu dispositivo, mesmo no link do GitHub.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Entendi, vou configurar!
          </button>
        </div>
      </div>
    </div>
  );
};
