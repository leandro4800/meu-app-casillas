import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Search, Info } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';
import { materials } from '../data/materials';

interface MaterialsProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const Materials: React.FC<MaterialsProps> = ({ onBack, navigate, currentScreen }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Materiais</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="BUSCAR MATERIAL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold focus:border-[#eab308]/50 outline-none transition-all placeholder:text-gray-700 uppercase tracking-widest"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredMaterials.map((material, idx) => (
            <motion.div 
              key={material.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#141414] rounded-[2rem] border border-white/5 p-6 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[8px] text-[#eab308] font-black uppercase tracking-widest mb-1">{material.category}</p>
                  <h3 className="text-white font-black italic text-lg tracking-tight">{material.name}</h3>
                </div>
                <div className="size-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
                  <Info size={18} className="text-gray-600" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest mb-1">Dureza</span>
                  <span className="text-[10px] font-bold text-white uppercase">{material.hardness}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest mb-1">Usinab.</span>
                  <span className="text-[10px] font-black text-[#eab308]">{material.machinability}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest mb-1">Densidade</span>
                  <span className="text-[10px] font-bold text-white">{material.density} g/cm³</span>
                </div>
              </div>

              <div className="mt-4 h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${material.machinability}%` }}
                  className="h-full bg-[#eab308]/30"
                />
              </div>

              <div className="absolute -bottom-4 -right-4 size-20 bg-[#eab308]/5 blur-2xl rounded-full group-hover:bg-[#eab308]/10 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default Materials;
