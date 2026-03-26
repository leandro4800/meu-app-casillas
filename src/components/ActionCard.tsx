import React from 'react';
import { motion } from 'framer-motion';

interface ActionCardProps {
  id: string;
  icon: string;
  title: string;
  desc: string;
  isPremium?: boolean;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, desc, isPremium, onClick }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-[#1c1e22] border border-white/5 rounded-[2rem] p-5 flex flex-col items-start text-left relative overflow-hidden group hover:border-[#eab308]/30 transition-all"
    >
      <div className="size-12 rounded-2xl bg-[#252930] flex items-center justify-center text-[#eab308] mb-4 group-hover:bg-[#eab308]/20 transition-colors">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      
      <div className="flex items-center gap-2 mb-1">
        <p className="text-white font-black text-sm tracking-tight uppercase italic">{title}</p>
        {isPremium && (
          <span className="bg-[#eab308] text-black text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">PRO</span>
        )}
      </div>
      
      <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest leading-tight">{desc}</p>
      
      {/* Efeito visual de fundo */}
      <div className="absolute -bottom-4 -right-4 size-20 bg-[#eab308]/5 blur-2xl rounded-full group-hover:bg-[#eab308]/10 transition-all" />
    </motion.button>
  );
};

export default ActionCard;
