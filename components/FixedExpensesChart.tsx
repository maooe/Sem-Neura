
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

const iconMap: Record<string, { icon: React.ReactNode, color: string }> = {
  casa: { icon: <Home size={18} />, color: 'bg-blue-100 text-blue-600' },
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
  // Fix: Replaced missing 'Knife' icon with 'Utensils'
  açougue: { icon: <Utensils size={18} />, color: 'bg-rose-100 text-rose-600' },
  carne: { icon: <Utensils size={18} />, color: 'bg-rose-100 text-rose-600' },
  academia: { icon: <Dumbbell size={18} />, color: 'bg-zinc-800 text-white' },
  treino: { icon: <Dumbbell size={18} />, color: 'bg-zinc-800 text-white' },
  festa: { icon: <PartyPopper size={18} />, color: 'bg-pink-100 text-pink-600' },
  // Fix: Renamed 'Pills' to 'Pill' to match lucide-react export
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
  
  if (fixedExpenses.length === 0) return null;

  const maxAmount = Math.max(...fixedExpenses.map(e => e.amount));

  const getIconData = (description: string) => {
    const desc = description.toLowerCase();
    for (const key in iconMap) {
      if (desc.includes(key)) return iconMap[key];
    }
    return { icon: <Info size={18} />, color: 'bg-slate-100 text-slate-400' };
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg">Mapa de Gastos Fixos</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Distribuição Mensal</p>
        </div>
      </div>

      <div className="space-y-6">
        {fixedExpenses.sort((a, b) => b.amount - a.amount).map((expense) => {
          const { icon, color } = getIconData(expense.description);
          const percentage = (expense.amount / maxAmount) * 100;

          return (
            <div key={expense.id} className="group flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 duration-300 ${color}`}>
                    {icon}
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {expense.description}
                  </span>
                </div>
                <span className="text-sm font-black text-slate-900">
                  R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                    expense.amount === maxAmount ? 'bg-blue-600' : 'bg-slate-300 group-hover:bg-blue-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
