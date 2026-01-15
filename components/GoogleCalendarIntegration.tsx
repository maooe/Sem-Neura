
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ExternalLink, RefreshCw, Info } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface GoogleCalendarIntegrationProps {
  transactions: Transaction[];
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

export const GoogleCalendarIntegration: React.FC<GoogleCalendarIntegrationProps> = ({ transactions }) => {
  const [isConnected, setIsConnected] = useState(true);
  
  const currentMonth = 0; // Janeiro (0-indexed)
  const currentYear = 2026;
  const daysInMonth = 31;
  const startDayOffset = 4; // Janeiro 2026 começa na Quinta (0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui)

  const handleConnect = () => setIsConnected(true);

  // Helper para verificar transações no dia
  const getTransactionsForDay = (day: number) => {
    const dateStr = `2026-01-${day.toString().padStart(2, '0')}`;
    return transactions.filter(t => t.dueDate === dateStr);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
      <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <CalendarIcon size={28} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Agenda Janeiro 2026</h2>
            <p className="text-slate-400 text-sm">Organização e feriados integrados</p>
          </div>
        </div>
        
        {!isConnected ? (
          <button 
            onClick={handleConnect}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            Integrar Google Agenda <ExternalLink size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400">
               <RefreshCw size={20} />
            </button>
            <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
              SINCRO ATIVA
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 border-t border-slate-100">
        <div className="lg:col-span-5 p-6 border-r border-slate-100">
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d, idx) => (
              <div key={d} className={`text-center text-xs font-black uppercase ${idx === 0 || idx === 6 ? 'text-rose-400' : 'text-slate-400'}`}>
                {d}
              </div>
            ))}
            
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayOfWeek = (day + startDayOffset - 1) % 7;
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const dateKey = `2026-01-${day.toString().padStart(2, '0')}`;
              const holidayName = HOLIDAYS_2026[dateKey];
              const dayTransactions = getTransactionsForDay(day);
              const hasPayable = dayTransactions.some(t => t.type === TransactionType.PAYABLE);
              const hasReceivable = dayTransactions.some(t => t.type === TransactionType.RECEIVABLE);
              const isToday = day === 15;

              return (
                <div 
                  key={i} 
                  title={holidayName || ''}
                  className={`aspect-square p-2 rounded-2xl border transition-all group relative cursor-pointer flex flex-col items-center justify-center gap-1
                    ${isToday ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 z-10 scale-105' : 
                      isWeekend ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-white border-slate-50 hover:border-blue-100 hover:bg-blue-50/20 text-slate-600'}
                    ${holidayName ? 'ring-2 ring-rose-100' : ''}
                  `}
                >
                  <span className={`text-sm font-black ${holidayName ? 'text-rose-500' : ''} ${isToday ? 'text-white' : ''}`}>
                    {day}
                  </span>
                  
                  {/* Indicadores de Contas */}
                  <div className="flex gap-1 h-1.5">
                    {hasPayable && <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-rose-500'} animate-pulse`} />}
                    {hasReceivable && <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-emerald-500'} animate-pulse`} />}
                  </div>

                  {/* Tag de Feriado */}
                  {holidayName && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  )}

                  {/* Tooltip Simples/Destaque */}
                  {(holidayName || dayTransactions.length > 0) && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-xl z-20 pointer-events-none">
                      {holidayName && <p className="font-bold text-rose-400 mb-1">{holidayName}</p>}
                      {dayTransactions.map(t => (
                        <p key={t.id} className="truncate">• {t.description}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500" /> Contas a Pagar</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Contas a Receber</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-100 ring-1 ring-rose-500" /> Feriado</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-100 rounded" /> Fim de Semana</div>
          </div>
        </div>

        <div className="lg:col-span-2 p-6 bg-slate-50/50">
           <h4 className="font-bold text-slate-800 mb-6 uppercase text-sm tracking-widest flex items-center gap-2">
             <Info size={16} className="text-blue-500" /> Destaques do Dia
           </h4>
           <div className="space-y-4">
             {/* Simulação de eventos baseada em transações do dia 15 */}
             {getTransactionsForDay(15).length > 0 ? (
                getTransactionsForDay(15).map(t => (
                  <div key={t.id} className={`p-4 rounded-2xl border ${t.type === TransactionType.PAYABLE ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'} shadow-sm`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t.type}</p>
                    <p className="text-sm font-bold text-slate-800">{t.description}</p>
                    <p className="text-xs font-black text-slate-600 mt-2">R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                ))
             ) : (
               <div className="py-10 text-center">
                 <p className="text-slate-400 text-xs italic">Nenhum lançamento para hoje.</p>
               </div>
             )}
             
             <button className="w-full py-4 mt-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl hover:bg-white hover:border-blue-300 hover:text-blue-500 transition-all text-xs font-black uppercase tracking-widest">
               + Adicionar Evento
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
