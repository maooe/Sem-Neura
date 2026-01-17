
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, BrainCircuit, Rocket, PiggyBank, Palette, Megaphone, Trash2 } from 'lucide-react';

const INSIGHTS = [
  { icon: <BrainCircuit size={16} />, text: "Use IA para criar mascotes e logotipos personalizados. É um mercado de alta demanda para freelancers!" },
  { icon: <Palette size={16} />, text: "Gere ilustrações exclusivas com Midjourney para vender em bancos de imagens internacionais." },
  { icon: <Megaphone size={16} />, text: "Marketing Digital: use o ChatGPT para estruturar legendas e roteiros que vendem seus serviços." },
  { icon: <PiggyBank size={16} />, text: "Corte gastos fantasmas! Revise assinaturas esquecidas no seu cartão de crédito agora." },
  { icon: <Rocket size={16} />, text: "Crie apps simples no-code com auxílio de IA e monetize com anúncios ou assinaturas." },
  { icon: <Trash2 size={16} />, text: "Desapego Financeiro: O que você não usa há 6 meses é dinheiro parado. Venda e faça caixa!" },
  { icon: <Sparkles size={16} />, text: "Anote tudo, até o cafezinho. O controle dos pequenos gastos evita grandes rombos no orçamento." },
  { icon: <BrainCircuit size={16} />, text: "IA para Marcas: Ajude empresas locais a se posicionarem melhor gerando conteúdo visual rápido." }
];

export const InsightsBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INSIGHTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextInsight = () => {
    setCurrentIndex((prev) => (prev + 1) % INSIGHTS.length);
  };

  return (
    <div className="mb-6 animate-in slide-in-from-top-4 duration-700">
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 p-[1px] rounded-full shadow-lg group">
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-brand-600 text-white p-1.5 rounded-full flex-shrink-0 animate-pulse">
              {INSIGHTS[currentIndex].icon}
            </div>
            <p className="text-[11px] md:text-xs font-black text-slate-700 uppercase tracking-tight truncate">
              <span className="text-brand-600 mr-2">DICA EXTRA:</span>
              {INSIGHTS[currentIndex].text}
            </p>
          </div>
          
          <button 
            onClick={nextInsight}
            className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-brand-600 uppercase tracking-widest whitespace-nowrap transition-colors"
          >
            Próxima <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
