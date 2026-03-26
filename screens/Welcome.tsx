import React from 'react';
import { motion } from 'motion/react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-[#eab308]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center text-center z-10"
      >
        <div className="size-40 rounded-[2.5rem] bg-[#1c1e22] border-2 border-[#eab308]/30 flex items-center justify-center mb-10 shadow-2xl">
          <img 
            src="/logo_casillas.png" 
            alt="Casillas Logo" 
            className="size-28 object-contain animate-float"
            referrerPolicy="no-referrer"
          />
        </div>

        <h1 className="text-white text-4xl font-black tracking-tighter uppercase italic leading-none mb-4">
          BEM-VINDO AO <span className="text-[#eab308]">CASILLAS</span>
        </h1>
        <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[280px] mb-12">
          A ferramenta definitiva para o profissional de usinagem moderno. Precisão de engenharia no seu bolso.
        </p>

        <button 
          onClick={onStart}
          className="w-full max-w-[280px] bg-[#eab308] hover:bg-[#facc15] active:scale-95 transition-all text-black font-black py-5 rounded-[2rem] shadow-[0_15px_40px_rgba(234,179,8,0.2)] flex items-center justify-center gap-3 group"
        >
          <span className="tracking-widest uppercase text-sm">Começar Agora</span>
          <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </motion.div>

      <div className="absolute bottom-10 text-center opacity-30">
        <p className="text-[8px] font-black uppercase tracking-[0.4em]">v2.5.0 PRO READY</p>
      </div>
    </div>
  );
};

export default Welcome;
