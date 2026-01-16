
import React, { useEffect, useState } from 'react';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/20 blur-[120px] rounded-full animate-pulse" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-600/40 blur-2xl rounded-full animate-ping" />
          <div className="relative p-6 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl transition-transform hover:scale-110 duration-500">
            <BrainCircuit size={64} className="text-brand-500" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 text-amber-400 animate-bounce" size={24} />
        </div>

        <h1 className="text-3xl font-black text-white tracking-[0.3em] uppercase mb-2">SEM NEURA</h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-12">Sincronizando sua mente com a IA...</p>

        <div className="w-64 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-brand-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-brand-500 uppercase tracking-tighter">
          <Loader2 size={12} className="animate-spin" />
          {progress}% Carregado
        </div>
      </div>

      <div className="absolute bottom-12 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">
        Versão 2.5.0 - Inteligência Artificial Ativa
      </div>
    </div>
  );
};
