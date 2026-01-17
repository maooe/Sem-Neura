
import React from 'react';
import { Thermometer, Calendar, ArrowRightLeft, Search, Filter, History } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface AccountHistoryProps {
  transactions: Transaction[];
}

export const AccountHistory: React.FC<AccountHistoryProps> = ({ transactions }) => {
  const paidHistory = transactions
    .filter(t => t.status === 'PAID')
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const totalPaid = paidHistory
    .filter(t => t.type === TransactionType.PAYABLE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalReceived = paidHistory
    .filter(t => t.type === TransactionType.RECEIVABLE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Lógica do Termômetro: Quanto maior a proporção de gastos vs ganhos, mais "quente" o termômetro.
  const ratio = totalReceived > 0 ? (totalPaid / totalReceived) * 100 : totalPaid > 0 ? 100 : 0;
  
  const getThermometerColor = () => {
    if (ratio < 40) return 'text-blue-500'; // Frio
    if (ratio < 75) return 'text-orange-500'; // Morno
    return 'text-rose-600'; // Quente
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-white/10 rounded-2xl transition-colors duration-500 ${getThermometerColor()}`}>
            <Thermometer size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">Histórico de Contas</h3>
            <p className="text-slate-400 text-xs font-medium">Fluxo de caixa efetivado e realizado</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <span className={`text-xs font-black uppercase tracking-widest ${getThermometerColor()}`}>
             {ratio.toFixed(0)}% Utilizado
           </span>
           <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
             <div 
               className={`h-full transition-all duration-1000 ${ratio > 75 ? 'bg-rose-500' : ratio > 40 ? 'bg-orange-500' : 'bg-blue-500'}`} 
               style={{ width: `${Math.min(ratio, 100)}%` }} 
             />
           </div>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar space-y-4">
        {paidHistory.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300">
            <History size={48} className="mb-4 opacity-10" />
            <p className="text-sm font-bold uppercase tracking-widest">Nenhuma conta quitada ainda.</p>
          </div>
        ) : (
          paidHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${item.type === TransactionType.PAYABLE ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  <ArrowRightLeft size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Calendar size={12} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pago em {new Date(item.dueDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${item.type === TransactionType.PAYABLE ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {item.type === TransactionType.PAYABLE ? '-' : '+'} R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-200 px-2 py-0.5 rounded-full">
                  {item.paymentMethod}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex gap-4">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase">Recebido</span>
              <span className="text-xs font-black text-emerald-600">R$ {totalReceived.toLocaleString('pt-BR')}</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase">Pago</span>
              <span className="text-xs font-black text-rose-600">R$ {totalPaid.toLocaleString('pt-BR')}</span>
           </div>
        </div>
        <button className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
          <Filter size={18} />
        </button>
      </div>
    </div>
  );
};
