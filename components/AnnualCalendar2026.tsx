
import React from 'react';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

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

export const AnnualCalendar2026: React.FC = () => {
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
        <h4 className="font-bold text-slate-800 mb-3 text-center border-b border-slate-50 pb-2">{months[monthIdx]}</h4>
        <div className="grid grid-cols-7 gap-1 text-[9px] text-center mb-1">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
            <span key={i} className={`font-black ${i === 0 || i === 6 ? 'text-rose-400' : 'text-slate-400'}`}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map(b => (
            <div key={`b-${b}`} className="aspect-square"></div>
          ))}
          {monthDays.map(day => {
            const dateKey = `${year}-${(monthIdx + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const holidayName = HOLIDAYS_2026[dateKey];
            const dayOfWeek = (day + startDay - 1) % 7;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            return (
              <div 
                key={day} 
                title={holidayName || ''}
                className={`aspect-square flex flex-col items-center justify-center text-[10px] font-bold rounded-lg transition-all relative cursor-default
                  ${holidayName 
                    ? 'bg-rose-500 text-white shadow-sm ring-1 ring-rose-300' 
                    : isWeekend 
                      ? 'bg-slate-50 text-slate-400' 
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'}
                `}
              >
                {day}
                {holidayName && (
                   <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white rounded-full border border-rose-500"></div>
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
          <div className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-lg shadow-indigo-100">
            <CalendarIcon size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">CALENDÁRIO ANUAL</h2>
            <p className="text-slate-500 text-sm font-medium">Visualização completa dos feriados de 2026</p>
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
          <Info size={14} className="text-indigo-500" /> Legenda do Ano
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white text-[10px] font-black shadow-sm ring-2 ring-rose-100">12</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">Datas Comemorativas</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Feriados Nacionais</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] font-black border border-slate-200">S/D</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">Finais de Semana</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Sábados e Domingos</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-600 text-[10px] font-black border border-slate-200">15</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">Dias Úteis</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Segunda a Sexta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
