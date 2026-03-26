import React from 'react';
import { Screen, User } from '../src/types';
import { motion } from 'motion/react';

interface HomeProps {
  user: User | null;
  navigate: (screen: Screen) => void;
}

const Home: React.FC<HomeProps> = ({ user, navigate }) => {
  const mainActions = [
    { id: 'machining_params', icon: 'precision_manufacturing', title: 'Cálculos de Usinagem', desc: 'RPM, Avanço e Potência' },
    { id: 'ai_agent', icon: 'psychology', title: 'Consultor IA', desc: 'Especialista em usinagem' },
    { id: 'materials', icon: 'inventory_2', title: 'Materiais', desc: 'Propriedades e usinabilidade' },
    { id: 'thread_tables', icon: 'reorder', title: 'Tabelas de Roscas', desc: 'Métrica, UNC, UNF, BSP, NPT' }
  ];

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="w-full h-16 px-6 flex items-center justify-between border-b border-white/5 z-20">
        <button className="size-10 flex items-center justify-center text-[#eab308]">
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
        <div className="size-10 rounded-full bg-[#1c1e22] border border-[#eab308]/30 flex items-center justify-center text-[10px] font-black text-[#eab308]">
          BR
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-8 pb-24">
        <div className="flex flex-col items-center text-center mb-12">
          {/* Logo Frame - Correcting the error reported by the user */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="size-48 rounded-[3rem] bg-[#1c1e22] border-4 border-[#eab308] flex items-center justify-center relative shadow-[0_0_50px_rgba(234,179,8,0.2)] mb-8"
          >
            <img 
              src="/logo_casillas.png" 
              alt="Casillas Logo" 
              className="size-32 object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                console.error("Logo failed to load");
                // Fallback if logo fails to load
                e.currentTarget.src = "https://picsum.photos/seed/casillas/200/200";
              }}
            />
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-[#eab308]/10 to-transparent pointer-events-none"></div>
          </motion.div>

          <h1 className="text-[#eab308] text-6xl font-black tracking-tighter uppercase italic leading-none mb-2 drop-shadow-2xl">
            CASILLAS
          </h1>
          <h2 className="text-[#eab308] text-sm font-black tracking-[0.2em] uppercase opacity-80 mb-6">
            FORMULÁRIO TÉCNICO DIGITAL
          </h2>
          
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-[280px]">
            ELIMINE CÁLCULOS MANUAIS. OBTENHA PRECISÃO ABSOLUTA E DADOS TÉCNICOS EM SEGUNDOS.
          </p>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 gap-4">
          {mainActions.map((action, idx) => (
            <motion.button
              key={action.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => navigate(action.id as Screen)}
              className="w-full bg-[#1c1e22] border border-white/5 rounded-[2rem] p-6 flex items-center gap-6 text-left active:scale-[0.98] transition-all shadow-xl hover:border-[#eab308]/30 group"
            >
              <div className="size-16 rounded-2xl bg-[#252930] flex items-center justify-center text-[#eab308] shrink-0 border border-white/10 group-hover:bg-[#eab308]/20 transition-colors">
                <span className="material-symbols-outlined text-4xl">{action.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-black text-base tracking-tight leading-none">{action.title}</p>
                <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mt-2">{action.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0908]/80 backdrop-blur-xl border-t border-white/5 px-8 flex items-center justify-between z-30">
        <button className="flex flex-col items-center gap-1 text-[#eab308]">
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-[8px] font-black uppercase tracking-widest">Início</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-500">
          <span className="material-symbols-outlined text-2xl">search</span>
          <span className="text-[8px] font-black uppercase tracking-widest">Busca</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-500">
          <span className="material-symbols-outlined text-2xl">person</span>
          <span className="text-[8px] font-black uppercase tracking-widest">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default Home;
