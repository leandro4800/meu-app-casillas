import React from 'react';
import { motion } from 'motion/react';

interface ActionCardProps {
  id: string;
  icon: string;
  title: string;
  desc: string;
  idx: number;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ id, icon, title, desc, idx, onClick }) => {
  return (
    <motion.button
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: idx * 0.1 }}
      onClick={onClick}
      className="w-full bg-[#1c1e22] border border-white/5 rounded-[2rem] p-6 flex items-center gap-6 text-left active:scale-[0.98] transition-all shadow-xl hover:border-[#eab308]/30 group"
    >
      <div className="size-16 rounded-2xl bg-[#252930] flex items-center justify-center text-[#eab308] shrink-0 border border-white/10 group-hover:bg-[#eab308]/20 transition-colors">
        <span className="material-symbols-outlined text-4xl">{icon}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-white font-black text-base tracking-tight leading-none">{title}</p>
          {(id === 'tolerance_tables' || id === 'verifier') && (
            <span className="bg-[#eab308] text-black text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">NOVO</span>
          )}
        </div>
        <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mt-2">{desc}</p>
      </div>
    </motion.button>
  );
};

export default ActionCard;
