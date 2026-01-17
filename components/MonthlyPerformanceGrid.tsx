
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { BarChart3, Star } from 'lucide-react';

interface MonthlyPerformanceGridProps {
  transactions: Transaction[];
}

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

export const MonthlyPerformanceGrid: React.FC<MonthlyPerformanceGridProps> = ({ transactions }) => {
  const currentYear = new Date().getFullYear();
  
  const getMonthlyStatus = (monthIdx: number) => {
    const monthStr = (monthIdx + 1).toString().padStart(2, '0');
    
    const monthlyTrans = transactions.filter(t => 
      t.dueDate.startsWith(`${currentYear}-${monthStr}`) && t.status === 'PAID'
    );

    const income = monthlyTrans
      .filter(t => t.type === TransactionType.RECEIVABLE)
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    const expenses = monthlyTrans
      .filter(t => t.type === TransactionType.PAYABLE)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = income - expenses;
    
    if (income === 0 && expenses === 0) return { emoji: '⚪', label: 'Sem dados', color: 'text-slate-300', balance };
    
    // Classificação
    if (balance > (income * 0.2) && balance > 0) return { emoji: '🚀', label: 'Excelente!', color: 'text-emerald-500', balance };
    if (balance > 0) return { emoji: '✅', label: 'No Azul', color: 'text-emerald-400', balance };
    if (balance === 0) return { emoji: '⚖️', label: 'Equilibrado', color: 'text-amber-500', balance };
    if (balance > -(income * 0.1)) return { emoji: '💸', label: 'Atenção', color: 'text-rose-400', balance };
    return { emoji: '🚨', label: 'Crítico!', color: 'text-rose-600', balance };
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-brand-600 text-white rounded-xl shadow-brand">
          <Star size={20} />
        </div>
        <div>
          <h3 className="font-black text-lg text-slate-900 tracking-tighter uppercase leading-none">Desempenho Mensal {currentYear}</h3>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Classificação Automática por IA de Caixa</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {MONTHS.map((name, idx) => {
          const status = getMonthlyStatus(idx);
          return (
            <div key={name} className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:scale-105 transition-transform group">
              <span className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{name}</span>
              <span className="text-3xl mb-1 group-hover:animate-bounce">{status.emoji}</span>
              <span className={`text-[10px] font-black uppercase ${status.color}`}>{status.label}</span>
              <span className="text-[9px] font-bold text-slate-400 mt-1">
                {status.balance !== 0 ? `R$ ${status.balance.toLocaleString('pt-BR')}` : '-'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
