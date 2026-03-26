import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Settings } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';

interface GearCalcProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const GearCalc: React.FC<GearCalcProps> = ({ onBack, navigate, currentScreen }) => {
  const [module, setModule] = useState('');
  const [teeth, setTeeth] = useState('');

  const calculate = () => {
    const m = parseFloat(module);
    const z = parseInt(teeth);
    if (isNaN(m) || isNaN(z)) return null;

    return {
      dp: m * z, // Diâmetro Primitivo
      de: m * (z + 2), // Diâmetro Externo
      di: m * (z - 2.334), // Diâmetro Interno
      h: 2.167 * m, // Altura do dente
      p: Math.PI * m, // Passo
    };
  };

  const results = calculate();

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Cálculo de Engrenagens</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Módulo (M)</label>
              <input
                type="number"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                placeholder="Ex: 2.0"
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Nº de Dentes (Z)</label>
              <input
                type="number"
                value={teeth}
                onChange={(e) => setTeeth(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                placeholder="Ex: 30"
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid grid-cols-1 gap-4"
            >
              {[
                { label: 'Diâmetro Primitivo (dp)', value: results.dp.toFixed(2) + ' mm' },
                { label: 'Diâmetro Externo (de)', value: results.de.toFixed(2) + ' mm' },
                { label: 'Diâmetro Interno (di)', value: results.di.toFixed(2) + ' mm' },
                { label: 'Altura do Dente (h)', value: results.h.toFixed(2) + ' mm' },
                { label: 'Passo (p)', value: results.p.toFixed(2) + ' mm' },
              ].map((res) => (
                <div key={res.label} className="bg-[#141414] rounded-2xl border border-white/5 p-4 flex justify-between items-center">
                  <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">{res.label}</span>
                  <span className="text-[#eab308] text-xs font-black italic">{res.value}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!results && (
          <div className="mt-12 text-center opacity-20">
            <Settings size={48} className="mx-auto text-gray-700 mb-4 animate-spin-slow" />
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Insira os valores para calcular</p>
          </div>
        )}
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default GearCalc;
