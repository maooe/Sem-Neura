
import React, { useState } from 'react';
import { X, UserPlus, Users, Check, Trash2, UserCircle } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: string[];
  currentProfile: string;
  onSelectProfile: (name: string) => void;
  onCreateProfile: (name: string) => void;
  onDeleteProfile: (name: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profiles,
  currentProfile,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile
}) => {
  const [newProfileName, setNewProfileName] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    onCreateProfile(newProfileName.trim());
    setNewProfileName('');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 bg-slate-100 flex justify-between items-center border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <Users size={20} />
            </div>
            <h3 className="font-black uppercase tracking-tighter text-slate-900">Perfis de Usuário</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Selecione uma Base de Dados</p>
          
          <div className="space-y-3 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {profiles.map((profile) => (
              <div 
                key={profile}
                className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  currentProfile === profile 
                    ? 'border-blue-600 bg-blue-50/50' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                }`}
                onClick={() => onSelectProfile(profile)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${
                    currentProfile === profile ? 'bg-blue-600' : 'bg-slate-400'
                  }`}>
                    {profile.charAt(0).toUpperCase()}
                  </div>
                  <span className={`font-bold ${currentProfile === profile ? 'text-blue-900' : 'text-slate-600'}`}>
                    {profile}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {currentProfile === profile ? (
                    <div className="p-1 bg-blue-600 text-white rounded-full">
                      <Check size={14} />
                    </div>
                  ) : (
                    profiles.length > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteProfile(profile); }}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCreate} className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Criar Novo Perfil</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ex: Empresa, Pessoal, João..."
                className="flex-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
              />
              <button 
                type="submit"
                className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
              >
                <UserPlus size={20} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 italic text-center mt-4">
              Cada perfil tem seus próprios lançamentos, lembretes e configurações de nuvem.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
