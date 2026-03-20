import React from 'react';
import { motion } from 'motion/react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#eab308]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#eab308]/5 rounded-full blur-[120px]" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 flex flex-col items-center"
      >
        <div className="size-40 rounded-[2.5rem] bg-[#1c1e22] border-2 border-[#eab308]/20 flex items-center justify-center mb-10 shadow-[0_0_60px_rgba(234,179,8,0.1)] relative group">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-[#eab308]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <img 
            src="/logo_casillas.png" 
            alt="Casillas Logo" 
            className="size-24 object-contain relative z-10"
            referrerPolicy="no-referrer"
          />
        </div>

        <h1 className="text-[#eab308] text-6xl font-black tracking-tighter uppercase italic leading-none mb-3 drop-shadow-2xl">
          CASILLAS
        </h1>
        <div className="h-px w-24 bg-[#eab308]/30 mb-4" />
        <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.4em] mb-16 max-w-[240px] leading-relaxed">
          FORMULÁRIO TÉCNICO <span className="text-[#eab308]">DIGITAL</span>
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(234,179,8,0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-14 py-5 bg-[#eab308] text-black rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_15px_35px_rgba(234,179,8,0.25)] transition-all"
        >
          Acessar Sistema
        </motion.button>
      </motion.div>

      <div className="absolute bottom-10 left-0 w-full text-center">
        <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.5em] opacity-50">
          PROFESSIONAL EDITION 2026
        </p>
      </div>
    </div>
  );
};

export default Welcome;
