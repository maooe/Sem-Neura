
import React from 'react';
import { 
  Home, Droplets, Zap, Wifi, Tv, ShoppingCart, CreditCard, 
  FileText, Monitor, Bus, Croissant, Utensils, Dumbbell, 
  PartyPopper, Pill, Gift, Bomb, Info, Dog, Flower2, Hammer 
} from 'lucide-react';
import { Transaction } from '../types';

interface FixedExpensesChartProps {
  transactions: Transaction[];
}

// Orçamentos sugeridos por palavra-chave para demonstração
const BUDGET_MAP: Record<string, number> = {
  casa: 1500, aluguel: 1500,
  agua: 120, água: 120,
  energia: 250, luz: 250,
  internet: 150, wifi: 150,
  supermercado: 1200, mercado: 1200,
  academia: 120, treino: 120,
  pet: 200, cachorro: 200,
};

const iconMap: Record<string, { icon: React.ReactNode, color: string }> = {
  casa: { icon: <Home size={18} />, color: 'bg-blue-100 text-blue-600' },
  aluguel: { icon: <Home size={18} />, color: 'bg-blue-100 text-blue-600' },
  agua: { icon: <Droplets size={18} />, color: 'bg-cyan-100 text-cyan-600' },
  energia: { icon: <Zap size={18} />, color: 'bg-amber-100 text-amber-600' },
  luz: { icon: <Zap size={18} />, color: 'bg-amber-100 text-amber-600' },
  internet: { icon: <Wifi size={18} />, color: 'bg-indigo-100 text-indigo-600' },
  tv: { icon: <Tv size={18} />, color: 'bg-slate-100 text-slate-600' },
  supermercado: { icon: <ShoppingCart size={18} />, color: 'bg-emerald-100 text-emerald-600' },
  mercado: { icon: <ShoppingCart size={18} />, color: 'bg-emerald-100 text-emerald-600' },
  cartao: { icon: <CreditCard size={18} />, color: 'bg-purple-100 text-purple-600' },
  fatura: { icon: <FileText size={18} />, color: 'bg-orange-100 text-orange-600' },
  computador: { icon: <Monitor size={18} />, color: 'bg-slate-700 text-white' },
  onibus: { icon: <Bus size={18} />, color: 'bg-yellow-100 text-yellow-700' },
  pao: { icon: <Croissant size={18} />, color: 'bg-orange-50 text-orange-800' },
  padaria: { icon: <Croissant size={18} />, color: 'bg-orange-50 text-orange-800' },
  açougue: { icon: <Utensils size={18} />, color: 'bg-rose-100 text-rose-600' },
  carne: { icon: <Utensils size={18} />, color: 'bg-rose-100 text-rose-600' },
  academia: { icon: <Dumbbell size={18} />, color: 'bg-zinc-800 text-white' },
  treino: { icon: <Dumbbell size={18} />, color: 'bg-zinc-800 text-white' },
  festa: { icon: <PartyPopper size={18} />, color: 'bg-pink-100 text-pink-600' },
  medicamento: { icon: <Pill size={18} />, color: 'bg-red-100 text-red-600' },
  remedio: { icon: <Pill size={18} />, color: 'bg-red-100 text-red-600' },
  presente: { icon: <Gift size={18} />, color: 'bg-teal-100 text-teal-600' },
  bomba: { icon: <Bomb size={18} />, color: 'bg-black text-red-500' },
  surpresa: { icon: <Bomb size={18} />, color: 'bg-black text-red-500' },
  cachorro: { icon: <Dog size={18} />, color: 'bg-orange-100 text-orange-600' },
  pet: { icon: <Dog size={18} />, color: 'bg-orange-100 text-orange-600' },
  jardim: { icon: <Flower2 size={18} />, color: 'bg-green-100 text-green-600' },
  plantas: { icon: <Flower2 size={18} />, color: 'bg-green-100 text-green-600' },
  martelo: { icon: <Hammer size={18} />, color: 'bg-slate-200 text-slate-700' },
  reforma: { icon: <Hammer size={18} />, color: 'bg-slate-200 text-slate-700' },
  manutençao: { icon: <Hammer size={18} />, color: 'bg-slate-200 text-slate-700' },
};

export const FixedExpensesChart: React.FC<FixedExpensesChartProps> = ({ transactions }) => {
  const fixedExpenses = transactions.filter(t => t.categoryKind === 'FIXED' || t.categoryKind === 'RECURRING');
  
  if (fixedExpenses.length === 0) return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-8 flex flex-col items-center justify-center text-slate-300 min-h-[200px]">
       <Info size={48} className="mb-4 opacity-10" />
       <p className="text-sm font-bold uppercase tracking-widest italic">Nenhum gasto fixo para exibir.</p>
    </div>
  );

  const getIconData = (description: string) => {
    const desc = description.toLowerCase();
    for (const key in iconMap) {
      if (desc.includes(key)) return iconMap[key];
    }
    return { icon: <Info size={18} />, color: 'bg-slate-100 text-slate-400' };
  };

  const getBudget = (description: string, amount: number) => {
    const desc = description.toLowerCase();
    for (const key in BUDGET_MAP) {
      if (desc.includes(key)) return BUDGET_MAP[key];
    }
    // Orçamento padrão é o próprio valor se não houver mapeamento
    return amount * 1.1; 
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-100 mb-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="font-black text-slate-900 uppercase tracking-tighter text-2xl">Mapa de Gastos Fixos</h3>
          <p className="text-xs font-black text-brand-600 uppercase tracking-[0.2em] mt-1">Comparativo de Orçamento</p>
        </div>
        <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
          <FileText size={24} />
        </div>
      </div>

      <div className="space-y-10">
        {fixedExpenses.sort((a, b) => b.amount - a.amount).map((expense) => {
          const { icon, color } = getIconData(expense.description);
          const budget = getBudget(expense.description, expense.amount);
          const percentage = Math.min((expense.amount / budget) * 100, 100);
          const isOverBudget = expense.amount > budget;

          return (
            <div key={expense.id} className="group flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl transition-all group-hover:rotate-6 group-hover:scale-110 duration-300 shadow-sm ${color}`}>
                    {icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">
                      {expense.description}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Meta: R$ {budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-black ${isOverBudget ? 'text-rose-600' : 'text-slate-900'}`}>
                    R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <p className={`text-[10px] font-black uppercase tracking-tighter ${isOverBudget ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {isOverBudget ? 'Aclima de orçamento' : 'Dentro do esperado'}
                  </p>
                </div>
              </div>
              
              <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isOverBudget ? 'bg-rose-500 shadow-rose-200' : 'bg-brand-600 shadow-brand-100'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
                {/* Linha de orçamento a 100% se ultrapassar */}
                {isOverBudget && (
                   <div className="absolute right-[5%] top-0 h-full w-0.5 bg-white/50 animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
