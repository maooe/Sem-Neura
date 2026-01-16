
import React, { useState } from 'react';
import { Reminder } from '../types';
import { Plus, Bell, Trash2, Check, BrainCircuit, Sparkles, Loader2, X } from 'lucide-react';
import { processNaturalLanguageReminder } from '../services/gemini';

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
  
  // Estados para a IA
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);

  const handleStartEdit = (rem: Reminder) => {
    setEditingId(rem.id);
    setEditText(rem.text);
  };

  const handleSaveEdit = (id: string) => {
    onUpdate(id, { text: editText.trim() });
    setEditingId(null);
  };

  const handleAiSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiPrompt.trim() || isProcessingAi) return;

    setIsProcessingAi(true);
    const result = await processNaturalLanguageReminder(aiPrompt);
    
    onAdd(result.text, result.priority);
    
    setAiPrompt('');
    setIsProcessingAi(false);
    setShowAiInput(false);
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
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowAiInput(!showAiInput);
              if (!showAiInput) setTimeout(() => document.getElementById('ai-reminder-input')?.focus(), 100);
            }}
            title="Lembrete com IA"
            className={`p-3 rounded-2xl transition-all shadow-md active:scale-90 group ${showAiInput ? 'bg-slate-900 text-white' : 'bg-white text-brand-600 hover:bg-brand-50 border border-slate-200'}`}
          >
            {showAiInput ? <X size={20} /> : <BrainCircuit size={20} className="group-hover:animate-pulse" />}
          </button>
          <button
            onClick={() => onAdd('', 'MEDIUM')}
            className="p-3 bg-brand-600 text-white rounded-2xl hover:bg-brand-500 transition-all shadow-brand active:scale-90 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      {showAiInput && (
        <div className="mb-6 animate-in slide-in-from-top-4 fade-in duration-300">
          <form onSubmit={handleAiSubmit} className="relative">
            <input
              id="ai-reminder-input"
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ex: Pagar luz urgente amanhã..."
              disabled={isProcessingAi}
              className="w-full bg-white border-2 border-brand-200 p-4 pr-14 rounded-2xl text-sm font-bold text-slate-900 shadow-xl focus:border-brand-500 outline-none transition-all placeholder:text-slate-400"
            />
            <button 
              type="submit"
              disabled={!aiPrompt.trim() || isProcessingAi}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-600 text-white rounded-xl disabled:bg-slate-200 transition-colors"
            >
              {isProcessingAi ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            </button>
          </form>
          <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mt-2 ml-2 flex items-center gap-1">
            <Sparkles size={10} /> A IA irá definir o texto e a prioridade
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 auto-rows-fr overflow-y-auto custom-scrollbar pr-1 max-h-[600px]">
        {reminders.length === 0 && !showAiInput && (
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
                <div className="flex items-center gap-1">
                   {rem.priority === 'HIGH' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" title="Alta Prioridade" />}
                   <button onClick={() => onDelete(rem.id)} className="p-1 hover:bg-rose-500 hover:text-white rounded text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
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
