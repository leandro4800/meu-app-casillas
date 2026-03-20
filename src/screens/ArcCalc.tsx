import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CircleDot } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';

interface ArcCalcProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const ArcCalc: React.FC<ArcCalcProps> = ({ onBack, navigate, currentScreen }) => {
  const [radius, setRadius] = useState('');
  const [angle, setAngle] = useState('');

  const calculate = () => {
    const r = parseFloat(radius);
    const a = parseFloat(angle);
    if (isNaN(r) || isNaN(a)) return null;

    const angleRad = (a * Math.PI) / 180;
    return {
      arcLength: angleRad * r,
      chordLength: 2 * r * Math.sin(angleRad / 2),
      area: (angleRad / 2) * r * r
    };
  };

  const result = calculate();

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Cálculo de Arcos</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Raio (R) em mm</label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                placeholder="Ex: 50"
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Ângulo (º)</label>
              <input
                type="number"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                placeholder="Ex: 45"
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 gap-4"
            >
              <div className="bg-[#eab308] rounded-[2rem] p-6 text-black shadow-2xl shadow-[#eab308]/20">
                <p className="text-black/60 text-[8px] font-black uppercase tracking-widest mb-1">Comprimento do Arco</p>
                <h3 className="text-3xl font-black italic tracking-tighter">{result.arcLength.toFixed(3)}mm</h3>
              </div>
              
              <div className="bg-[#141414] rounded-2xl border border-white/5 p-4 flex justify-between items-center">
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Corda</span>
                <span className="text-white text-xs font-black italic">{result.chordLength.toFixed(3)}mm</span>
              </div>
              
              <div className="bg-[#141414] rounded-2xl border border-white/5 p-4 flex justify-between items-center">
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Área do Setor</span>
                <span className="text-white text-xs font-black italic">{result.area.toFixed(2)}mm²</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!result && (
          <div className="mt-12 text-center opacity-20">
            <CircleDot size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Insira os valores para calcular</p>
          </div>
        )}
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default ArcCalc;
