
import React, { useState } from 'react';
import { Reminder } from '../types';
import { Plus, Bell, Trash2, Check, Edit2, Save, X } from 'lucide-react';

interface ReminderSectionProps {
  reminders: Reminder[];
  onAdd: (text: string, priority: Reminder['priority']) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Reminder>) => void;
  onDelete: (id: string) => void;
}

const POST_IT_COLORS = [
  'bg-yellow-100 border-yellow-300',
  'bg-pink-100 border-pink-300',
  'bg-blue-100 border-blue-300',
  'bg-emerald-100 border-emerald-300',
  'bg-purple-100 border-purple-300',
];

export const ReminderSection: React.FC<ReminderSectionProps> = ({ 
  reminders, 
  onAdd, 
  onToggle, 
  onUpdate,
  onDelete 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleStartEdit = (rem: Reminder) => {
    setEditingId(rem.id);
    setEditText(rem.text);
  };

  const handleSaveEdit = (id: string) => {
    onUpdate(id, { text: editText.trim() });
    setEditingId(null);
  };

  return (
    <div className="bg-slate-100/50 rounded-[2.5rem] p-8 border border-slate-200/60 shadow-inner flex flex-col min-h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-800 tracking-tighter uppercase leading-none">Mural Sem Neura</h3>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Post-its rápidos</p>
          </div>
        </div>
        <button
          onClick={() => onAdd('', 'MEDIUM')}
          className="p-3 bg-brand-600 text-white rounded-2xl hover:bg-brand-500 transition-all shadow-brand active:scale-90 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 auto-rows-fr overflow-y-auto custom-scrollbar pr-1 max-h-[600px]">
        {reminders.length === 0 && (
          <div className="col-span-2 py-12 flex flex-col items-center justify-center opacity-30 text-slate-500">
            <Plus size={48} className="mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Clique no + para colar</p>
          </div>
        )}
        
        {reminders.map((rem, index) => {
          const colorClass = POST_IT_COLORS[index % POST_IT_COLORS.length];
          const isEditing = editingId === rem.id || rem.text === '';
          const rotation = (index % 3 === 0 ? '-rotate-1' : index % 3 === 1 ? 'rotate-1' : '-rotate-2');

          return (
            <div
              key={rem.id}
              className={`relative aspect-square p-4 rounded-lg shadow-md border-b-4 transition-all hover:scale-105 hover:z-10 group
                ${colorClass} ${rotation} ${rem.completed ? 'opacity-50 grayscale-[0.2]' : ''}
                flex flex-col text-slate-900
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <button 
                  onClick={() => onToggle(rem.id)}
                  className={`p-1 rounded-md transition-colors ${rem.completed ? 'bg-green-600 text-white' : 'bg-black/5 text-slate-400'}`}
                >
                  <Check size={14} strokeWidth={3} />
                </button>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => onDelete(rem.id)} className="p-1 hover:bg-rose-500 hover:text-white rounded text-slate-400"><Trash2 size={12} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden cursor-text" onClick={() => !isEditing && handleStartEdit(rem)}>
                {isEditing ? (
                  <textarea
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => handleSaveEdit(rem.id)}
                    className="w-full h-full bg-transparent outline-none resize-none font-bold text-sm leading-tight text-slate-900 placeholder:text-slate-400"
                    placeholder="Escreva algo..."
                  />
                ) : (
                  <p className={`text-sm font-black leading-tight break-words text-slate-900 ${rem.completed ? 'line-through opacity-40' : ''}`}>
                    {rem.text || 'Toque para editar...'}
                  </p>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-black/5 rounded-tl-xl pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
