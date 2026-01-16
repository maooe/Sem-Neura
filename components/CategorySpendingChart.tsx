
import React from 'react';
import { 
  Utensils, Car, Home, Palmtree, HeartPulse, ShoppingCart, 
  MoreHorizontal, Dog, Flower2, Hammer, Bomb, Zap, Droplets, 
  Wifi, Tv, CreditCard, FileText, Monitor, Bus, Croissant, Pill, Gift
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface CategorySpendingChartProps {
  transactions: Transaction[];
}

interface CategoryData {
  name: string;
  icon: React.ReactNode;
  spent: number;
  budget: number;
  keywords: string[];
  color: string;
}

const CATEGORIES: CategoryData[] = [
  { 
    name: 'Alimentação', 
    icon: <Utensils size={18} />, 
    spent: 0, 
    budget: 1200, 
    keywords: ['mercado', 'comida', 'ifood', 'restaurante', 'padaria', 'pão', 'açougue', 'carne', 'supermercado', 'croissant'],
    color: 'bg-emerald-400'
  },
  { 
    name: 'Transporte', 
    icon: <Car size={18} />, 
    spent: 0, 
    budget: 600, 
    keywords: ['gasolina', 'combustivel', 'uber', 'onibus', 'metro', 'trem', 'carro', 'oficina', 'ônibus', 'bus'],
    color: 'bg-brand-500'
  },
  { 
    name: 'Moradia', 
    icon: <Home size={18} />, 
    spent: 0, 
    budget: 2500, 
    keywords: ['aluguel', 'luz', 'energia', 'agua', 'água', 'condominio', 'internet', 'tv', 'casa', 'wifi', 'zap'],
    color: 'bg-brand-500'
  },
  { 
    name: 'Lazer', 
    icon: <Palmtree size={18} />, 
    spent: 0, 
    budget: 500, 
    keywords: ['cinema', 'festa', 'bar', 'viagem', 'presente', 'show', 'party', 'gift'],
    color: 'bg-brand-500'
  },
  { 
    name: 'Saúde', 
    icon: <HeartPulse size={18} />, 
    spent: 0, 
    budget: 400, 
    keywords: ['farmacia', 'remedio', 'hospital', 'academia', 'dentista', 'saude', 'medico', 'medicamento', 'pill', 'treino', 'dumbbell'],
    color: 'bg-rose-400'
  },
  { 
    name: 'Compras', 
    icon: <ShoppingCart size={18} />, 
    spent: 0, 
    budget: 800, 
    keywords: ['shopping', 'amazon', 'roupa', 'eletronico', 'cartao', 'fatura', 'computador', 'celular', 'monitor', 'creditcard', 'filetext'],
    color: 'bg-brand-500'
  },
  { 
    name: 'Pets', 
    icon: <Dog size={18} />, 
    spent: 0, 
    budget: 350, 
    keywords: ['cachorro', 'pet', 'raçao', 'ração', 'veterinario', 'banho', 'tosa'],
    color: 'bg-orange-400'
  },
  { 
    name: 'Manutenção', 
    icon: <Hammer size={18} />, 
    spent: 0, 
    budget: 450, 
    keywords: ['martelo', 'reforma', 'manutençao', 'jardim', 'plantas', 'grama', 'conserto', 'ferramenta', 'flower2'],
    color: 'bg-indigo-400'
  },
  { 
    name: 'Outros', 
    icon: <MoreHorizontal size={18} />, 
    spent: 0, 
    budget: 300, 
    keywords: ['bomba', 'surpresa', 'extra', 'inesperado', 'bomb'],
    color: 'bg-slate-400'
  }
];

export const CategorySpendingChart: React.FC<CategorySpendingChartProps> = ({ transactions }) => {
  const expenses = transactions.filter(t => t.type === TransactionType.PAYABLE);

  // Calcular gastos por categoria
  const processedCategories = CATEGORIES.map(cat => {
    let sum = 0;
    if (cat.name === 'Outros') {
      const matchedIds = new Set();
      CATEGORIES.forEach(otherCat => {
        if (otherCat.name !== 'Outros') {
          expenses.forEach(t => {
            if (otherCat.keywords.some(k => t.description.toLowerCase().includes(k))) {
              matchedIds.add(t.id);
            }
          });
        }
      });
      sum = expenses.filter(t => !matchedIds.has(t.id)).reduce((acc, curr) => acc + curr.amount, 0);
      
      const specificOther = expenses
        .filter(t => cat.keywords.some(k => t.description.toLowerCase().includes(k)))
        .reduce((acc, curr) => acc + curr.amount, 0);
      sum += specificOther;
      
    } else {
      sum = expenses
        .filter(t => cat.keywords.some(k => t.description.toLowerCase().includes(k)))
        .reduce((acc, curr) => acc + curr.amount, 0);
    }
    return { ...cat, spent: sum };
  });

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8 animate-in fade-in duration-700 h-full">
      <h3 className="text-xl font-black text-slate-800 mb-8 tracking-tight uppercase">Gastos por Categoria</h3>
      
      <div className="space-y-8">
        {processedCategories.map((cat) => {
          const percentage = Math.min((cat.spent / cat.budget) * 100, 100);
          const isOverBudget = cat.spent > cat.budget;

          return (
            <div key={cat.name} className="space-y-3 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`transition-all duration-300 ${isOverBudget ? 'text-rose-500' : 'text-slate-400 group-hover:text-brand-500'}`}>
                    {cat.icon}
                  </div>
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-black text-slate-500 tracking-tighter">
                    R$ {cat.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} 
                    <span className="mx-1 text-slate-300">/</span> 
                    R$ {cat.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${isOverBudget ? 'bg-rose-500' : 'bg-brand-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <Bomb size={12} className="text-rose-400" />
        <span>Cores inteligentes integradas ao seu tema ativo</span>
      </div>
    </div>
  );
};
