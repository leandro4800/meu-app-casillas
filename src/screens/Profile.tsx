import React from 'react';
import { motion } from 'motion/react';
import { User as UserType, Screen } from '../types';
import { ChevronLeft, User, Crown, Settings, LogOut, ShieldCheck, Mail } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface ProfileProps {
  user: UserType | null;
  onBack: () => void;
  onUpgrade: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack, onUpgrade, navigate, currentScreen }) => {
  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-[#eab308]/5 blur-[120px] rounded-full pointer-events-none" />

      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Meu Perfil</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="size-28 rounded-full bg-[#141414] border-2 border-[#eab308] p-1 relative shadow-[0_0_40px_rgba(234,179,8,0.15)] mb-6"
          >
            <div className="size-full rounded-full overflow-hidden bg-[#1c1e22] flex items-center justify-center">
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt={user.name} className="size-full object-cover" />
              ) : (
                <User size={48} className="text-gray-600" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 size-8 rounded-full bg-[#eab308] flex items-center justify-center border-4 border-[#0a0908]">
              <Crown size={14} className="text-black" />
            </div>
          </motion.div>

          <h2 className="text-2xl font-black italic text-white mb-1 tracking-tight">{user?.name || 'Usuário'}</h2>
          <div className="flex items-center gap-2 text-gray-500 justify-center">
            <Mail size={12} />
            <p className="text-[10px] uppercase tracking-widest font-bold">{user?.email || 'email@exemplo.com'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-6 bg-[#141414] rounded-[2rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#eab308]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-black mb-3">Status da Conta</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#eab308]/10 flex items-center justify-center">
                  <Crown size={20} className="text-[#eab308]" />
                </div>
                <div>
                  <span className="text-white font-black italic text-lg uppercase tracking-tight">Premium</span>
                  <p className="text-[8px] text-emerald-400 uppercase tracking-widest font-black">Assinatura Ativa</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Expira em</p>
                <p className="text-[10px] text-white font-black">19/04/2026</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onUpgrade}
            className="w-full p-5 bg-[#eab308] text-black rounded-2xl flex items-center justify-between font-black uppercase tracking-[0.2em] text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(234,179,8,0.2)]"
          >
            <span>Renovar Assinatura</span>
            <Crown size={18} />
          </button>

          <div className="grid grid-cols-1 gap-2 pt-4">
            <button className="w-full p-5 bg-white/[0.03] text-gray-400 rounded-2xl flex items-center justify-between font-black uppercase tracking-[0.2em] text-[10px] border border-white/5 hover:bg-white/[0.05] transition-colors">
              <div className="flex items-center gap-3">
                <Settings size={16} />
                <span>Configurações</span>
              </div>
            </button>

            <button className="w-full p-5 bg-white/[0.03] text-gray-400 rounded-2xl flex items-center justify-between font-black uppercase tracking-[0.2em] text-[10px] border border-white/5 hover:bg-white/[0.05] transition-colors">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} />
                <span>Privacidade</span>
              </div>
            </button>

            <button className="w-full p-5 bg-rose-500/5 text-rose-400 rounded-2xl flex items-center justify-between font-black uppercase tracking-[0.2em] text-[10px] border border-rose-500/10 hover:bg-rose-500/10 transition-colors mt-4">
              <div className="flex items-center gap-3">
                <LogOut size={16} />
                <span>Sair da Conta</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default Profile;
