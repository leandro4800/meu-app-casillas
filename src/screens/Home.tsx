import React from 'react';
import { Screen, User } from '../types';
import { motion } from 'motion/react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import ActionCard from '../components/ActionCard';

interface HomeProps {
  user: User | null;
  navigate: (screen: Screen) => void;
}

const Home: React.FC<HomeProps> = ({ user, navigate }) => {
  const mainActions = [
    { id: 'tolerance_tables', icon: 'reorder', title: 'Tolerâncias ISO', desc: 'Tabelas ABNT Eixo/Furo', isPremium: false },
    { id: 'verifier', icon: 'check_circle', title: 'Verificador ISO', desc: 'Cálculo de ajustes e limites', isPremium: false },
    { id: 'machining_params', icon: 'precision_manufacturing', title: 'Cálculos Usinagem', desc: 'RPM, Avanço e Potência', isPremium: true },
    { id: 'ai_agent', icon: 'smart_toy', title: 'Consultor IA', desc: 'Especialista em usinagem', isPremium: true },
    { id: 'materials', icon: 'inventory_2', title: 'Materiais', desc: 'Propriedades e usinabilidade', isPremium: true },
    { id: 'thread_tables', icon: 'reorder', title: 'Tabelas Roscas', desc: 'Métrica, UNC, UNF, BSP, NPT', isPremium: true }
  ];

  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'BR';

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <Header userInitials={userInitials} />

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-6 pb-24">
        {/* Welcome Banner */}
        <div className="mb-8">
          <p className="text-[#eab308] text-[10px] font-black uppercase tracking-[0.3em] mb-1 italic">Bem-vindo de volta,</p>
          <h2 className="text-white text-2xl font-black tracking-tight uppercase italic">{user?.name || 'Usuário'}</h2>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          {mainActions.map((action) => (
            <ActionCard
              key={action.id}
              id={action.id}
              icon={action.icon}
              title={action.title}
              desc={action.desc}
              isPremium={action.isPremium}
              onClick={() => navigate(action.id as Screen)}
            />
          ))}
        </div>

        {/* Premium Banner */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('checkout')}
          className="w-full mt-8 bg-gradient-to-r from-[#eab308] to-[#ca8a04] p-6 rounded-[2rem] flex items-center justify-between shadow-[0_20px_40px_rgba(234,179,8,0.15)] relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h3 className="text-black font-black text-lg uppercase italic leading-none mb-1">Seja Premium</h3>
            <p className="text-black/60 text-[9px] font-black uppercase tracking-widest">Acesso total a todos os cálculos</p>
          </div>
          <span className="material-symbols-outlined text-4xl text-black/20 group-hover:text-black/40 transition-colors relative z-10">workspace_premium</span>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        </motion.button>

        {/* Footer Info */}
        <div className="mt-12 text-center opacity-30">
          <img src="/logo_casillas.png" alt="Logo" className="size-8 mx-auto grayscale mb-2" />
          <p className="text-[8px] text-white font-black uppercase tracking-[0.5em]">Casillas Professional Edition</p>
        </div>
      </div>

      <BottomNav currentScreen="home" navigate={navigate} />
    </div>
  );
};

export default Home;
