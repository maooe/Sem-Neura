
import React from 'react';
import { X, Copy, CheckCircle2, Share2, Smartphone, Globe, ShieldCheck, QrCode, AlertTriangle, ExternalLink, Zap } from 'lucide-react';
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

  const totalPayable = transactions
    .filter(t => t.type === TransactionType.PAYABLE)
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalReceivable = transactions
    .filter(t => t.type === TransactionType.RECEIVABLE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleCopyLink = () => {
    if (isTemporaryEnv) {
      alert("Atenção: Você está em um ambiente de teste temporário. Este link só funciona nesta aba específica. Para um link que você possa enviar para outras pessoas, o app precisa ser publicado (Vercel/Netlify).");
    }
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-300">
        <div className="relative p-8 bg-slate-900 text-white overflow-hidden">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Share2 size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter">Acesso ao App</h3>
          </div>

          {isTemporaryEnv && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
              <div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Ambiente Temporário</p>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  Este link (blob/sandbox) expira ao fechar a aba. Para um link permanente, publique o código no <b>Vercel</b> ou <b>Netlify</b>.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 mb-2">
            <div className="p-3 bg-white/10 rounded-xl text-blue-400">
              <Globe size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">URL Atual</p>
              <p className="text-xs font-mono truncate text-blue-200">{currentUrl}</p>
            </div>
            <button 
              onClick={handleCopyLink}
              className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
            >
              {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            </button>
          </div>
          {copied && <p className="text-[10px] text-emerald-400 font-bold mt-2 text-center animate-pulse">LINK COPIADO!</p>}
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Pagar (Total)</p>
              <p className="text-lg font-black text-rose-600">R$ {totalPayable.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Receber (Total)</p>
              <p className="text-lg font-black text-emerald-600">R$ {totalReceivable.toLocaleString('pt-BR')}</p>
            </div>
          </div>

          <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-indigo-600" />
                <p className="text-xs font-black text-indigo-900 uppercase">Dica Sem Neura</p>
              </div>
              <p className="text-[11px] text-indigo-800 leading-relaxed mb-3">
                Para ter um link como <b>meufinanceiro.vercel.app</b>, basta baixar o código e subir para uma plataforma de hospedagem gratuita.
              </p>
              <button className="text-[10px] font-black text-indigo-600 underline flex items-center gap-1">
                Ver guia de publicação <ExternalLink size={10} />
              </button>
            </div>
            <Zap size={80} className="absolute -bottom-4 -right-4 text-indigo-200/30 rotate-12" />
          </div>

          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">Segurança de Dados</p>
              <p className="text-xs text-blue-700/70">Mesmo em links temporários, seus dados estão salvos no seu navegador.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
          >
            Fechar Resumo
          </button>
        </div>
      </div>
    </div>
  );
};
