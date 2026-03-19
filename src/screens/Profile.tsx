import React from 'react';
import { motion } from 'motion/react';
import { User } from '../types';

interface ProfileProps {
  user: User | null;
  onBack: () => void;
  onUpgrade: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack, onUpgrade }) => {
  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-[#eab308]">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-white font-black text-sm uppercase tracking-widest">Meu Perfil</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="size-32 rounded-full bg-[#1c1e22] border-4 border-[#eab308] flex items-center justify-center relative shadow-[0_0_50px_rgba(234,179,8,0.2)] mb-6"
          >
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt={user.name} className="size-full rounded-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-gray-500 text-6xl">person</span>
            )}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#eab308]/10 to-transparent pointer-events-none"></div>
          </motion.div>

          <h2 className="text-2xl font-black italic text-white mb-2">{user?.name || 'Usuário'}</h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">{user?.email || 'email@exemplo.com'}</p>
        </div>

        <div className="space-y-4 mb-12">
          <div className="p-6 bg-[#1c1e22] rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#eab308]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2">Status da Conta</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#eab308]">workspace_premium</span>
                <span className="text-white font-black italic text-xl uppercase">Premium</span>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Ativo</span>
            </div>
            
            <p className="mt-4 text-[8px] text-gray-500 uppercase tracking-widest font-bold">Expira em: 19/04/2026</p>
          </div>

          <button 
            onClick={onUpgrade}
            className="w-full p-6 bg-[#eab308] text-black rounded-3xl flex items-center justify-between font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-[0_10px_20px_rgba(234,179,8,0.2)]"
          >
            <span>Renovar Assinatura</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>

          <button className="w-full p-6 bg-white/5 text-gray-400 rounded-3xl flex items-center justify-between font-black uppercase tracking-widest text-sm border border-white/5">
            <span>Configurações</span>
            <span className="material-symbols-outlined">settings</span>
          </button>

          <button className="w-full p-6 bg-rose-500/10 text-rose-400 rounded-3xl flex items-center justify-between font-black uppercase tracking-widest text-sm border border-rose-500/20">
            <span>Sair da Conta</span>
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
