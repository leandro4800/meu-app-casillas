import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Weight, Box, Circle } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';
import { materials } from '../data/materials';

interface WeightCalcProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const WeightCalc: React.FC<WeightCalcProps> = ({ onBack, navigate, currentScreen }) => {
  const [shape, setShape] = useState<'round' | 'square' | 'plate'>('round');
  const [material, setMaterial] = useState(materials[0]);
  const [dimensions, setDimensions] = useState({ d: '', l: '', w: '', h: '' });

  const getResult = () => {
    const { d, l, w, h } = dimensions;
    const density = material.density; // g/cm3
    let volume = 0; // cm3

    const valD = parseFloat(d) / 10; // mm to cm
    const valL = parseFloat(l) / 10; // mm to cm
    const valW = parseFloat(w) / 10; // mm to cm
    const valH = parseFloat(h) / 10; // mm to cm

    if (shape === 'round' && valD && valL) {
      volume = Math.PI * Math.pow(valD / 2, 2) * valL;
    } else if (shape === 'square' && valD && valL) {
      volume = Math.pow(valD, 2) * valL;
    } else if (shape === 'plate' && valL && valW && valH) {
      volume = valL * valW * valH;
    }

    if (volume > 0) {
      return (volume * density) / 1000; // g to kg
    }
    return null;
  };

  const result = getResult();

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Cálculo de Peso</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="flex gap-2 mb-8">
          {[
            { id: 'round', icon: Circle, label: 'Redondo' },
            { id: 'square', icon: Box, label: 'Quadrado' },
            { id: 'plate', icon: Box, label: 'Chapa' }
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setShape(s.id as 'round' | 'square' | 'plate')}
              className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${
                shape === s.id 
                  ? 'bg-[#eab308] border-[#eab308] text-black' 
                  : 'bg-[#141414] border-white/5 text-gray-500'
              }`}
            >
              <s.icon size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Material</label>
            <select 
              value={material.name}
              onChange={(e) => setMaterial(materials.find(m => m.name === e.target.value) || materials[0])}
              className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all appearance-none uppercase tracking-widest"
            >
              {materials.map(m => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {shape !== 'plate' ? (
              <>
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Diâmetro / Lado (mm)</label>
                  <input
                    type="number"
                    value={dimensions.d}
                    onChange={(e) => setDimensions({ ...dimensions, d: e.target.value })}
                    className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Comprimento (mm)</label>
                  <input
                    type="number"
                    value={dimensions.l}
                    onChange={(e) => setDimensions({ ...dimensions, l: e.target.value })}
                    className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="col-span-2 grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Largura (mm)</label>
                    <input
                      type="number"
                      value={dimensions.w}
                      onChange={(e) => setDimensions({ ...dimensions, w: e.target.value })}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Comp. (mm)</label>
                    <input
                      type="number"
                      value={dimensions.l}
                      onChange={(e) => setDimensions({ ...dimensions, l: e.target.value })}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Espess. (mm)</label>
                    <input
                      type="number"
                      value={dimensions.h}
                      onChange={(e) => setDimensions({ ...dimensions, h: e.target.value })}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <AnimatePresence>
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mt-12 p-8 bg-[#eab308] rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl shadow-[#eab308]/20"
            >
              <div className="size-16 rounded-2xl bg-black/10 flex items-center justify-center mb-4">
                <Weight size={32} className="text-black" />
              </div>
              <p className="text-black/60 text-[10px] font-black uppercase tracking-widest mb-1">Peso Estimado</p>
              <h2 className="text-black text-5xl font-black italic tracking-tighter mb-2">
                {result.toFixed(3)}
                <span className="text-2xl ml-1">kg</span>
              </h2>
              <p className="text-black/40 text-[8px] font-bold uppercase tracking-widest">Densidade: {material.density} g/cm³</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default WeightCalc;
