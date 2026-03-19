import React, { useState } from 'react';
import { ISO_TOLERANCES } from '../data/tolerances';
import BottomNav from '../components/BottomNav';
import { Screen } from '../types';

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
      // Handle 'js' specifically as it's two letters
      const orderA = baseA === 'js' ? 'i' : baseA[0]; // 'js' usually sits between 'h' and 'j'
      const orderB = baseB === 'js' ? 'i' : baseB[0];
      
      return orderA.localeCompare(orderB);
    }
    
    return getNum(a) - getNum(b);
  });

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-[#eab308]">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-white font-black text-sm uppercase tracking-widest">Tolerâncias ISO</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setType('shafts')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              type === 'shafts' ? 'bg-[#eab308] text-black' : 'bg-white/5 text-gray-400'
            }`}
          >
            Eixos (Letras minúsculas)
          </button>
          <button
            onClick={() => setType('holes')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              type === 'holes' ? 'bg-[#eab308] text-black' : 'bg-white/5 text-gray-400'
            }`}
          >
            Furos (Letras maiúsculas)
          </button>
        </div>

        <div className="mb-6">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">
            Faixa de Diâmetro (mm)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ranges.map((range, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRangeIndex(idx)}
                className={`py-2 px-3 rounded-lg text-xs font-mono transition-all border ${
                  selectedRangeIndex === idx
                    ? 'bg-[#eab308]/10 border-[#eab308] text-[#eab308]'
                    : 'bg-white/5 border-transparent text-gray-400'
                }`}
              >
                {range.min} - {range.max}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1c1e22] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 text-[10px] uppercase tracking-widest text-[#eab308] font-black border-b border-white/5">Classe</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-[#eab308] font-black border-b border-white/5">Superior (mm)</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-[#eab308] font-black border-b border-white/5">Inferior (mm)</th>
              </tr>
            </thead>
            <tbody>
              {availableClasses.map((cls) => (
                <tr key={cls} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-black italic">{cls}</td>
                  <td className={`p-4 font-mono text-sm ${currentRange.values[cls].upper >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {currentRange.values[cls].upper > 0 ? '+' : ''}{currentRange.values[cls].upper.toFixed(3)}
                  </td>
                  <td className={`p-4 font-mono text-sm ${currentRange.values[cls].lower >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {currentRange.values[cls].lower > 0 ? '+' : ''}{currentRange.values[cls].lower.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-[#eab308]/5 border border-[#eab308]/20 rounded-xl">
          <p className="text-[10px] text-gray-400 leading-relaxed italic">
            * Valores em milímetros (mm). Baseado nas normas ISO/ABNT para ajustes e tolerâncias.
          </p>
        </div>
      </div>

      <BottomNav currentScreen="tolerance_tables" navigate={navigate} />
    </div>
  );
};

export default ToleranceTables;
