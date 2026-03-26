import React, { useState } from 'react';
import { ISO_TOLERANCES } from '../data/tolerances';
import BottomNav from '../components/BottomNav';
import { Screen } from '../types';
import { motion } from 'framer-motion';

interface ToleranceTablesProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
}

const ToleranceTables: React.FC<ToleranceTablesProps> = ({ onBack, navigate }) => {
  const [type, setType] = useState<'shafts' | 'holes'>('shafts');
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(0);

  const ranges = ISO_TOLERANCES[type];
  const currentRange = ranges[selectedRangeIndex];
  
  const availableClasses = Object.keys(currentRange.values).sort((a, b) => {
    const getBase = (s: string) => s.replace(/[0-9]/g, '').toLowerCase();
    const getNum = (s: string) => parseInt(s.replace(/[^0-9]/g, '')) || 0;
    
    const baseA = getBase(a);
    const baseB = getBase(b);
    
    if (baseA !== baseB) {
      const orderA = baseA === 'js' ? 'i' : baseA[0];
      const orderB = baseB === 'js' ? 'i' : baseB[0];
      return orderA.localeCompare(orderB);
    }
    return getNum(a) - getNum(b);
  });

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-[#eab308] active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col">
          <h1 className="text-white font-black text-sm uppercase tracking-widest italic">Tolerâncias ISO</h1>
          <p className="text-[#eab308] text-[8px] font-black uppercase tracking-[0.2em]">Normas ABNT / ISO</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-32">
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setType('shafts')}
            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic ${
              type === 'shafts' ? 'bg-[#eab308] text-black shadow-lg shadow-[#eab308]/20' : 'bg-white/5 text-gray-500'
            }`}
          >
            Eixos (min)
          </button>
          <button
            onClick={() => setType('holes')}
            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic ${
              type === 'holes' ? 'bg-[#eab308] text-black shadow-lg shadow-[#eab308]/20' : 'bg-white/5 text-gray-500'
            }`}
          >
            Furos (MAI)
          </button>
        </div>

        <div className="mb-8">
          <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black mb-4 block italic ml-2">
            Faixa de Diâmetro (mm)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ranges.map((range, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRangeIndex(idx)}
                className={`py-3 px-2 rounded-xl text-[10px] font-black transition-all border italic ${
                  selectedRangeIndex === idx
                    ? 'bg-[#eab308]/10 border-[#eab308] text-[#eab308]'
                    : 'bg-[#1c1e22] border-white/5 text-gray-500'
                }`}
              >
                {range.min}-{range.max}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          key={`${type}-${selectedRangeIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1c1e22] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl"
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-5 text-[9px] uppercase tracking-widest text-[#eab308] font-black italic">Classe</th>
                <th className="p-5 text-[9px] uppercase tracking-widest text-[#eab308] font-black italic text-right">Superior</th>
                <th className="p-5 text-[9px] uppercase tracking-widest text-[#eab308] font-black italic text-right">Inferior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {availableClasses.map((cls) => (
                <tr key={cls} className="hover:bg-white/5 transition-colors">
                  <td className="p-5 text-white font-black italic text-sm">{cls}</td>
                  <td className={`p-5 font-mono text-xs text-right font-bold ${currentRange.values[cls].upper >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {currentRange.values[cls].upper > 0 ? '+' : ''}{currentRange.values[cls].upper.toFixed(3)}
                  </td>
                  <td className={`p-5 font-mono text-xs text-right font-bold ${currentRange.values[cls].lower >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {currentRange.values[cls].lower > 0 ? '+' : ''}{currentRange.values[cls].lower.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <div className="mt-8 p-6 bg-[#eab308]/5 border border-[#eab308]/10 rounded-[2rem]">
          <p className="text-[9px] text-gray-500 leading-relaxed italic font-bold text-center uppercase tracking-widest">
            Valores em milímetros (mm). Baseado na norma ISO 286.
          </p>
        </div>
      </div>

      <BottomNav currentScreen="home" navigate={navigate} />
    </div>
  );
};

export default ToleranceTables;
