import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Anchor, Search } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';

interface ShackleInfo {
  size: string;
  wll: number; // Working Load Limit in tons
  pinDia: number; // mm
}

const shackleData: ShackleInfo[] = [
  { size: '1/4"', wll: 0.5, pinDia: 8 },
  { size: '5/16"', wll: 0.75, pinDia: 10 },
  { size: '3/8"', wll: 1.0, pinDia: 11 },
  { size: '1/2"', wll: 2.0, pinDia: 16 },
  { size: '5/8"', wll: 3.25, pinDia: 19 },
  { size: '3/4"', wll: 4.75, pinDia: 22 },
  { size: '7/8"', wll: 6.5, pinDia: 25 },
  { size: '1"', wll: 8.5, pinDia: 28 },
];

interface ShacklesProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const Shackles: React.FC<ShacklesProps> = ({ onBack, navigate, currentScreen }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = shackleData.filter(s => s.size.includes(searchTerm));

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Tabela de Manilhas</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="BUSCAR TAMANHO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold focus:border-[#eab308]/50 outline-none transition-all placeholder:text-gray-700 uppercase tracking-widest"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filtered.map((shackle, idx) => (
            <motion.div 
              key={shackle.size}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#141414] rounded-3xl border border-white/5 p-6 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-[#eab308]">
                  <Anchor size={20} />
                </div>
                <div>
                  <h3 className="text-white font-black italic text-lg tracking-tight">{shackle.size}</h3>
                  <p className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Pino: {shackle.pinDia}mm</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">Carga (WLL)</p>
                <span className="text-[#eab308] text-2xl font-black italic tracking-tighter">{shackle.wll}t</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default Shackles;
