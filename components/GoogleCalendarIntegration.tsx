
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ExternalLink, RefreshCw, Info, Cake, Plus, Trash2, X } from 'lucide-react';
import { Transaction, TransactionType, Birthday } from '../types';

interface GoogleCalendarIntegrationProps {
  transactions: Transaction[];
  birthdays: Birthday[];
  onAddBirthday: (name: string, date: string) => void;
  onDeleteBirthday: (id: string) => void;
}

const HOLIDAYS_2026: Record<string, string> = {
  '2026-01-01': 'Ano Novo',
  '2026-02-16': 'Carnaval',
  '2026-02-17': 'Carnaval',
  '2026-04-03': 'Sexta-feira Santa',
  '2026-04-21': 'Tiradentes',
  '2026-05-01': 'Dia do Trabalho',
  '2026-06-04': 'Corpus Christi',
  '2026-09-07': 'Independência do Brasil',
  '2026-10-12': 'Nossa Senhora Aparecida',
  '2026-11-02': 'Finados',
  '2026-11-15': 'Proclamação da República',
  '2026-11-20': 'Consciência Negra',
  '2026-12-25': 'Natal',
};

export const GoogleCalendarIntegration: React.FC<GoogleCalendarIntegrationProps> = ({ 
  transactions, 
  birthdays, 
  onAddBirthday, 
  onDeleteBirthday 
}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  
  const currentMonth = 0; // Janeiro
  const daysInMonth = 31;
  const startDayOffset = 4; // Janeiro 2026 começa na Quinta

  const getDayEvents = (day: number) => {
    const dateStr = `2026-01-${day.toString().padStart(2, '0')}`;
    const trans = transactions.filter(t => t.dueDate === dateStr);
    const dayBirths = birthdays.filter(b => b.date.endsWith(`-01-${day.toString().padStart(2, '0')}`));
    return { trans, births: dayBirths, holiday: HOLIDAYS_2026[dateStr] };
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDate) return;
    onAddBirthday(newName, newDate);
    setNewName('');
    setNewDate('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8 flex flex-col">
      <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <CalendarIcon size={28} className="text-brand-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Agenda Janeiro 2026</h2>
            <p className="text-slate-400 text-sm">Finanças e Aniversários integrados</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase transition-all shadow-brand active:scale-95"
          >
            {showAddForm ? <X size={16} /> : <Cake size={16} />}
            {showAddForm ? 'Fechar' : 'Novo Aniversário'}
          </button>
          <div className="hidden sm:flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/30">
            GOOGLE SYNC ATIVO
          </div>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-6 bg-brand-50 border-b border-brand-100 flex flex-wrap gap-4 items-end animate-in slide-in-from-top-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-brand-600 uppercase mb-2 block">Nome do Aniversariante</label>
            <input 
              type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: João da Silva" 
              className="w-full p-3 rounded-xl border-2 border-brand-100 focus:border-brand-500 outline-none text-sm font-bold"
            />
          </div>
          <div className="w-40">
            <label className="text-[10px] font-black text-brand-600 uppercase mb-2 block">Data</label>
            <input 
              type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-brand-100 focus:border-brand-500 outline-none text-sm font-bold"
            />
          </div>
          <button type="submit" className="bg-brand-600 text-white p-3.5 rounded-xl hover:bg-brand-700 transition-all shadow-brand active:scale-95">
            <Plus size={20} />
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-7 border-t border-slate-100">
        <div className="lg:col-span-5 p-6 border-r border-slate-100">
          <div className="grid grid-cols-7 gap-3 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d, idx) => (
              <div key={d} className={`text-center text-[10px] font-black uppercase ${idx === 0 || idx === 6 ? 'text-rose-400' : 'text-slate-400'}`}>{d}</div>
            ))}
            {Array.from({ length: startDayOffset }).map((_, i) => <div key={`empty-${i}`} className="aspect-square"></div>)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const { trans, births, holiday } = getDayEvents(day);
              const dayOfWeek = (day + startDayOffset - 1) % 7;
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const isToday = day === 15;

              return (
                <div key={i} className={`aspect-square p-2 rounded-2xl border transition-all group relative cursor-pointer flex flex-col items-center justify-center gap-1
                  ${isToday ? 'bg-brand-600 border-brand-600 text-white shadow-brand z-10 scale-105' : 
                    isWeekend ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-white border-slate-50 hover:border-brand-100 hover:bg-brand-50/20 text-slate-600'}
                  ${holiday ? 'ring-2 ring-rose-100' : ''}
                  ${births.length > 0 ? 'ring-2 ring-amber-100' : ''}
                `}>
                  <span className={`text-sm font-black ${holiday ? 'text-rose-500' : ''} ${births.length > 0 && !isToday ? 'text-amber-500' : ''} ${isToday ? 'text-white' : ''}`}>{day}</span>
                  <div className="flex gap-0.5">
                    {trans.some(t => t.type === TransactionType.PAYABLE) && <div className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-rose-500'}`} />}
                    {trans.some(t => t.type === TransactionType.RECEIVABLE) && <div className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-emerald-500'}`} />}
                    {births.length > 0 && <Cake size={8} className={isToday ? 'text-white' : 'text-amber-500'} />}
                  </div>
                  
                  {(holiday || births.length > 0 || trans.length > 0) && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 hidden group-hover:block bg-slate-900 text-white text-[9px] p-2 rounded-lg shadow-xl z-20 pointer-events-none">
                      {holiday && <p className="font-bold text-rose-400">Feriado: {holiday}</p>}
                      {births.map(b => <p key={b.id} className="text-amber-400 font-bold">🎂 Niver: {b.name}</p>)}
                      {trans.map(t => <p key={t.id} className="truncate">• {t.description}</p>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-[10px] font-bold uppercase text-slate-400">
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /> Pagar</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Receber</div>
             <div className="flex items-center gap-1"><Cake size={12} className="text-amber-500" /> Aniversário</div>
          </div>
        </div>

        <div className="lg:col-span-2 p-6 bg-slate-50/50">
           <h4 className="font-bold text-slate-800 mb-6 uppercase text-sm tracking-widest flex items-center gap-2">
             <Cake size={16} className="text-brand-600" /> Aniversariantes do Mês
           </h4>
           <div className="space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
             {birthdays.filter(b => b.date.includes('-01-')).length > 0 ? (
                birthdays.filter(b => b.date.includes('-01-')).sort((a,b) => a.date.localeCompare(b.date)).map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Cake size={14} /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{b.name}</p>
                        <p className="text-[10px] font-black text-slate-400">Dia {b.date.split('-')[2]}</p>
                      </div>
                    </div>
                    <button onClick={() => onDeleteBirthday(b.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
             ) : (
               <div className="py-10 text-center">
                 <p className="text-slate-400 text-xs italic">Nenhum aniversariante em Janeiro.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
