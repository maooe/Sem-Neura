
import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface FinancialSummaryProps {
  transactions: Transaction[];
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ transactions }) => {
  const paidExpenses = transactions
    .filter(t => t.type === TransactionType.PAYABLE && t.status === 'PAID')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const receivedIncome = transactions
    .filter(t => t.type === TransactionType.RECEIVABLE && t.status === 'PAID')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = receivedIncome - paidExpenses;
  const isPositive = balance >= 0;

  return (
    <div className={`rounded-[2.5rem] p-8 border-2 transition-all duration-500 shadow-xl overflow-hidden relative ${
      isPositive 
        ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
        : 'bg-rose-50 border-rose-200 text-rose-900'
    }`}>
      {/* Background Decor */}
      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
        {isPositive ? <TrendingUp size={240} /> : <TrendingDown size={240} />}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-3xl shadow-lg ${isPositive ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
            <Wallet size={32} />
          </div>
          <div>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] opacity-60">Status de Caixa (Efetivado)</h3>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-black tracking-tighter">
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              {isPositive ? <ArrowUpRight className="text-emerald-500" size={24} /> : <ArrowDownRight className="text-rose-500" size={24} />}
            </div>
            <p className={`text-xs font-black uppercase mt-1 px-3 py-1 rounded-full inline-block ${
              isPositive ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'
            }`}>
              {isPositive ? 'FECHOU NO AZUL!' : 'FECHOU NO VERMELHO!'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-white/40 p-4 rounded-2xl border border-white/60">
            <p className="text-[10px] font-black uppercase opacity-60 mb-1">Total Recebido</p>
            <p className="text-lg font-black text-emerald-700">R$ {receivedIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/40 p-4 rounded-2xl border border-white/60">
            <p className="text-[10px] font-black uppercase opacity-60 mb-1">Total Pago</p>
            <p className="text-lg font-black text-rose-700">R$ {paidExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white/60 p-6 rounded-[2rem] border border-white min-w-[180px]">
          {isPositive ? (
            <>
              <CheckCircle2 size={40} className="text-emerald-500 mb-2" />
              <span className="text-xs font-black uppercase text-center">Saúde Financeira Excelente</span>
            </>
          ) : (
            <>
              <AlertCircle size={40} className="text-rose-500 mb-2" />
              <span className="text-xs font-black uppercase text-center">Atenção ao Prejuízo</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
