
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, CategoryKind, ExtendedStatus, PaymentMethod } from '../types';
import { Plus, Trash2, CheckCircle, Clock, Info, CreditCard, Banknote, QrCode, MoreHorizontal, Cloud, Check } from 'lucide-react';

interface FinanceCardProps {
  title: string;
  type: TransactionType;
  items: Transaction[];
  onAdd: (item: Partial<Transaction>) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  isSyncActive?: boolean;
}

const statusLabels: Record<ExtendedStatus, string> = {
  PAID: 'Paga',
  OPEN: 'Em aberto',
  SCHEDULED: 'Agendado',
  OVERDUE: 'Atrasado',
  CANCELLED: 'Cancelado',
  OTHER: 'Outro'
};

const methodIcons: Record<PaymentMethod, React.ReactNode> = {
  PIX: <QrCode size={14} />,
  CASH: <Banknote size={14} />,
  CARD: <CreditCard size={14} />,
  OTHER: <MoreHorizontal size={14} />
};

export const FinanceCard: React.FC<FinanceCardProps> = ({
  title,
  type,
  items,
  onAdd,
  onToggleStatus,
  onDelete,
  isSyncActive
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categoryKind, setCategoryKind] = useState<CategoryKind>(type === TransactionType.PAYABLE ? 'FIXED' : 'RECURRING');
  const [status, setStatus] = useState<ExtendedStatus>('OPEN');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [observation, setObservation] = useState('');

  useEffect(() => {
    if (showAdd) {
      setCategoryKind(type === TransactionType.PAYABLE ? 'FIXED' : 'RECURRING');
    }
  }, [showAdd, type]);

  const handleAdd = () => {
    if (!description || !amount || !dueDate) return;
    
    setIsSaved(true);
    
    onAdd({
      description,
      amount: parseFloat(amount),
      dueDate,
      type,
      categoryKind,
      status,
      paymentMethod,
      observation
    });

    setTimeout(() => {
      setDescription('');
      setAmount('');
      setDueDate('');
      setObservation('');
      setIsSaved(false);
      setShowAdd(false);
    }, 800);
  };

  const total = items.reduce((acc, curr) => acc + curr.amount, 0);
  const isPayable = type === TransactionType.PAYABLE;
  const categories: CategoryKind[] = isPayable ? ['FIXED', 'VARIABLE'] : ['RECURRING', 'VARIABLE'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className={`p-6 flex justify-between items-center ${isPayable ? 'bg-rose-50/50' : 'bg-emerald-50/50'}`}>
        <h3 className={`font-black text-lg uppercase tracking-widest ${isPayable ? 'text-rose-700' : 'text-emerald-700'}`}>{title}</h3>
        <div className="text-right">
           <p className={`text-[10px] uppercase font-black opacity-40 ${isPayable ? 'text-rose-900' : 'text-emerald-900'}`}>Total</p>
           <span className={`text-xl font-black ${isPayable ? 'text-rose-700' : 'text-emerald-700'}`}>
             R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
           </span>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
        {items.length === 0 && !showAdd && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-300">
             <Info size={40} className="mb-2 opacity-20" />
             <p className="italic text-sm">Nenhum lançamento registrado.</p>
          </div>
        )}

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="group p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all bg-slate-50/30">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <button 
                    onClick={() => onToggleStatus(item.id)}
                    className={`mt-1 p-2 rounded-full transition-colors ${item.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-bold text-slate-800 ${item.status === 'PAID' ? 'line-through opacity-50' : ''}`}>{item.description}</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        item.categoryKind === 'VARIABLE' ? 'bg-amber-100 text-amber-700' : 'bg-brand-100 text-brand-700'
                      }`}>
                        {item.categoryKind === 'FIXED' ? 'Fixo' : item.categoryKind === 'RECURRING' ? 'Recorrente' : 'Variável'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="font-black text-slate-900 flex items-center gap-1.5">
                        R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        {isSyncActive && <span title="Sincronizado na nuvem"><Cloud size={12} className="text-emerald-500 opacity-60" /></span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                         item.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 
                         item.status === 'OVERDUE' ? 'bg-red-50 text-red-700 border-red-200' :
                         'bg-amber-50 text-amber-700 border-amber-200'
                       }`}>
                         {statusLabels[item.status]}
                       </span>
                       <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                          {methodIcons[item.paymentMethod]} {item.paymentMethod}
                       </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => onDelete(item.id)} className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="mt-4 mb-6 p-6 border-2 border-brand-100 rounded-[2.5rem] space-y-5 bg-white animate-in fade-in zoom-in-95">
            <h4 className="font-black text-brand-900 text-[11px] uppercase tracking-[0.15em] flex items-center gap-2 mb-2">
              <Plus size={16} className="text-brand-600" /> Novo Lançamento
            </h4>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 flex items-center gap-1">
                {isPayable ? "O que pagar?" : "De quem receber?"}
              </label>
              <input 
                type="text" 
                placeholder={isPayable ? "Ex: Aluguel, Internet" : "Ex: Cliente João"} 
                className="w-full p-4 bg-slate-50 text-slate-900 border-slate-200 border-2 rounded-2xl text-sm focus:ring-0 focus:border-brand-500 outline-none placeholder:text-slate-400 transition-all font-bold"
                value={description} onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
                Tipo
              </label>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                {categories.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCategoryKind(k)}
                    className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all duration-300 ${categoryKind === k ? 'bg-brand-600 text-white shadow-brand' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
                  >
                    {k === 'FIXED' ? 'FIXO' : k === 'RECURRING' ? 'RECORRENTE' : 'VARIÁVEL'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Valor</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400">R$</span>
                  <input 
                    type="number" 
                    placeholder="0,00" 
                    className="w-full pl-11 p-4 bg-slate-50 text-slate-900 border-slate-200 border-2 rounded-2xl text-sm focus:ring-0 focus:border-brand-500 outline-none font-black"
                    value={amount} onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Data</label>
                <input 
                  type="date" 
                  className="w-full p-4 bg-slate-50 border-slate-200 border-2 rounded-2xl text-sm focus:ring-0 focus:border-brand-500 outline-none text-slate-900 font-bold"
                  value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleAdd} 
                disabled={isSaved}
                className={`flex-1 py-4 rounded-2xl text-sm font-black shadow-brand transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  isSaved 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-brand-600 text-white hover:bg-brand-500'
                }`}
              >
                {isSaved ? 'SALVO!' : 'SALVAR'}
              </button>
              <button 
                onClick={() => setShowAdd(false)} 
                className="flex-1 bg-white text-slate-400 py-4 rounded-2xl text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-all"
              >
                CANCELAR
              </button>
            </div>
          </div>
        )}
      </div>

      {!showAdd && (
        <button 
          onClick={() => setShowAdd(true)}
          className={`m-6 flex items-center justify-center gap-2 py-5 rounded-[1.5rem] shadow-xl transition-all font-black text-xs uppercase tracking-widest active:scale-95 text-white ${isPayable ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
          <Plus size={20} /> LANÇAR {type}
        </button>
      )}
    </div>
  );
};
