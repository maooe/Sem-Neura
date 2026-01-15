
import React, { useState } from 'react';
import { Reminder } from '../types';
import { Plus, Bell, Trash2, MoreVertical } from 'lucide-react';

interface ReminderSectionProps {
  reminders: Reminder[];
  onAdd: (text: string, priority: Reminder['priority']) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReminderSection: React.FC<ReminderSectionProps> = ({ reminders, onAdd, onToggle, onDelete }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Reminder['priority']>('MEDIUM');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority);
    setText('');
  };

  const getPriorityColor = (p: Reminder['priority']) => {
    switch (p) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Bell size={24} />
        </div>
        <h3 className="font-bold text-xl text-slate-800 tracking-tight">LEMBRETES</h3>
      </div>

      <form onSubmit={handleAdd} className="mb-6 space-y-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="O que você precisa lembrar?"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${priority === p ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {p === 'HIGH' ? 'Urgente' : p === 'MEDIUM' ? 'Médio' : 'Livre'}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 max-h-[400px] pr-2 custom-scrollbar">
        {reminders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm">Tudo tranquilo por aqui!</p>
          </div>
        )}
        {reminders.map((rem) => (
          <div
            key={rem.id}
            className={`flex items-center justify-between p-4 rounded-xl border border-slate-100 transition-all hover:shadow-sm ${rem.completed ? 'bg-slate-50 opacity-60' : 'bg-white'}`}
          >
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={rem.completed}
                onChange={() => onToggle(rem.id)}
                className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className={`text-sm font-medium text-slate-700 ${rem.completed ? 'line-through' : ''}`}>
                  {rem.text}
                </span>
                <span className={`text-[10px] uppercase font-black mt-1 ${getPriorityColor(rem.priority)} text-white px-2 py-0.5 rounded-full w-fit`}>
                  {rem.priority}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDelete(rem.id)}
              className="text-slate-300 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
