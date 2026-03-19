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

const Home: React.FC<HomeProps> = ({ navigate }) => {
  const mainActions = [
    { id: 'tolerance_tables', icon: 'reorder', title: 'Tolerâncias ISO', desc: 'Tabelas ABNT Eixo/Furo' },
    { id: 'verifier', icon: 'check_circle', title: 'Verificador ISO', desc: 'Cálculo de ajustes e limites' },
    { id: 'machining_params', icon: 'precision_manufacturing', title: 'Cálculos de Usinagem', desc: 'RPM, Avanço e Potência' },
    { id: 'ai_agent', icon: 'psychology', title: 'Consultor IA', desc: 'Especialista em usinagem' },
    { id: 'materials', icon: 'inventory_2', title: 'Materiais', desc: 'Propriedades e usinabilidade' },
    { id: 'thread_tables', icon: 'reorder', title: 'Tabelas de Roscas', desc: 'Métrica, UNC, UNF, BSP, NPT' }
  ];

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <Header />

      {/* Hero Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-8 pb-24">
        <div className="flex flex-col items-center text-center mb-12">
          {/* Logo Frame */}
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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('checkout')}
            className="mt-8 px-8 py-3 bg-[#eab308] text-black rounded-full font-black uppercase tracking-widest text-[10px] shadow-[0_10px_20px_rgba(234,179,8,0.2)]"
          >
            Upgrade Premium
          </motion.button>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 gap-4">
          {mainActions.map((action, idx) => (
            <ActionCard
              key={action.id}
              id={action.id}
              icon={action.icon}
              title={action.title}
              desc={action.desc}
              idx={idx}
              onClick={() => navigate(action.id as Screen)}
            />
          ))}
        </div>
      </div>

      <BottomNav currentScreen="home" navigate={navigate} />
    </div>
  );
};

export default Home;
