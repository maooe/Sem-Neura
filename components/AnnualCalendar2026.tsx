
import React from 'react';
import { Calendar as CalendarIcon, Info, Cake, TrendingDown, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Birthday, Transaction, TransactionType, Reminder } from '../types';

interface AnnualCalendar2026Props {
  birthdays?: Birthday[];
  transactions?: Transaction[];
  reminders?: Reminder[];
}

// Feriados Nacionais Brasil 2026
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

export const AnnualCalendar2026: React.FC<AnnualCalendar2026Props> = ({ 
  birthdays = [], 
  transactions = [], 
  reminders = [] 
}) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const renderMonth = (monthIdx: number) => {
    const year = 2026;
    const days = daysInMonth(monthIdx, year);
    const startDay = firstDayOfMonth(monthIdx, year);
    const blanks = Array.from({ length: startDay }, (_, i) => i);
    const monthDays = Array.from({ length: days }, (_, i) => i + 1);

    return (
      <div key={monthIdx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="font-bold text-slate-800 mb-3 text-center border-b border-slate-50 pb-2 uppercase tracking-tighter text-xs">{months[monthIdx]}</h4>
        <div className="grid grid-cols-7 gap-1 text-[8px] text-center mb-1">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
            <span key={i} className={`font-black ${i === 0 || i === 6 ? 'text-rose-400' : 'text-slate-400'}`}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map(b => (
            <div key={`b-${b}`} className="aspect-square"></div>
          ))}
          {monthDays.map(day => {
            const dateSuffix = `${(monthIdx + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dateKey = `${year}-${dateSuffix}`;
            
            const holidayName = HOLIDAYS_2026[dateKey];
            const dayBirths = birthdays.filter(b => b.date.endsWith(dateSuffix));
            const dayTrans = transactions.filter(t => t.dueDate === dateKey);
            
            const dayOfWeek = (day + startDay - 1) % 7;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            const hasPayable = dayTrans.some(t => t.type === TransactionType.PAYABLE);
            const hasReceivable = dayTrans.some(t => t.type === TransactionType.RECEIVABLE);

            return (
              <div 
                key={day} 
                className={`aspect-square flex flex-col items-center justify-center text-[9px] font-bold rounded-lg transition-all relative cursor-pointer group
                  ${holidayName 
                    ? 'bg-rose-500 text-white shadow-sm ring-1 ring-rose-300' 
                    : isWeekend 
                      ? 'bg-slate-50 text-slate-400' 
                      : 'text-slate-600 hover:bg-brand-50 hover:text-brand-600'}
                  ${dayBirths.length > 0 && !holidayName ? 'ring-2 ring-amber-400 bg-amber-50 text-amber-700' : ''}
                `}
              >
                {day}
                
                {/* Indicadores Visuais de Transações */}
                <div className="absolute -bottom-1 flex gap-0.5">
                   {hasPayable && <div className={`w-1 h-1 rounded-full ${holidayName ? 'bg-white' : 'bg-rose-500 animate-pulse'}`} />}
                   {hasReceivable && <div className={`w-1 h-1 rounded-full ${holidayName ? 'bg-white' : 'bg-emerald-500 animate-pulse'}`} />}
                </div>

                {/* Tooltip Detalhado */}
                {(holidayName || dayBirths.length > 0 || dayTrans.length > 0) && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-slate-900 text-white text-[9px] p-3 rounded-xl shadow-2xl z-[100] pointer-events-none border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                    {holidayName && <p className="font-bold text-rose-400 mb-1.5 flex items-center gap-1">🚩 {holidayName}</p>}
                    {dayBirths.map(b => <p key={b.id} className="text-amber-400 font-bold mb-1.5 flex items-center gap-1">🎂 Niver: {b.name}</p>)}
                    {dayTrans.map(t => (
                      <div key={t.id} className="flex items-center justify-between gap-2 mb-1 border-b border-white/10 pb-1 last:border-0 last:mb-0">
                        <div className="flex items-center gap-1 truncate">
                          <span className={t.type === TransactionType.PAYABLE ? 'text-rose-400' : 'text-emerald-400'}>
                            {t.type === TransactionType.PAYABLE ? <TrendingDown size={10}/> : <TrendingUp size={10}/>}
                          </span>
                          <span className="truncate">{t.description}</span>
                        </div>
                        <span className="font-black whitespace-nowrap">R$ {t.amount.toLocaleString('pt-BR')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-xl animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-brand-600 text-white rounded-[1.5rem] shadow-lg shadow-brand/20">
            <CalendarIcon size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">MAPA ANUAL DE FLUXO</h2>
            <p className="text-slate-500 text-sm font-medium">Visualização completa de vencimentos e eventos em 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xl tracking-widest shadow-xl">
          2026
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {months.map((_, i) => renderMonth(i))}
      </div>
      
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Info size={14} className="text-brand-500" /> Legenda do Mapa de Calor
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex flex-col items-center justify-center text-white text-[10px] font-black shadow-sm ring-2 ring-rose-100">
              15 <div className="w-1 h-1 bg-white rounded-full mt-0.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">Contas a Pagar</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Débitos do Dia</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-slate-900 text-[10px] font-black">
              12 <div className="w-1 h-1 bg-emerald-500 rounded-full mt-0.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">Recebíveis</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Entradas Previstas</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-[10px] font-black ring-2 ring-amber-400">🎂</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">Aniversários</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Datas de Terceiros</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <CheckCircle2 size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">Sincronizado</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Vercel Cloud OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
