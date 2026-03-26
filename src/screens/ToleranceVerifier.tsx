import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ISO_TOLERANCES } from '../data/tolerances';
import BottomNav from '../components/BottomNav';
import { Screen } from '../types';

interface ToleranceVerifierProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
}

const ToleranceVerifier: React.FC<ToleranceVerifierProps> = ({ onBack, navigate }) => {
  const [diameter, setDiameter] = useState('');
  const [toleranceClass, setToleranceClass] = useState('');
  const [type, setType] = useState<'shafts' | 'holes'>('holes');

  const result = useMemo(() => {
    const d = parseFloat(diameter);
    if (isNaN(d) || !toleranceClass) return null;

    const ranges = ISO_TOLERANCES[type];
    const range = ranges.find(r => d > r.min && d <= r.max);

    if (!range) return { error: 'Diâmetro fora das faixas suportadas (1-1000mm)' };

    const tolerance = range.values[toleranceClass];
    if (!tolerance) return { error: `Classe ${toleranceClass} não encontrada para esta faixa.` };

    const upperLimit = d + tolerance.upper;
    const lowerLimit = d + tolerance.lower;
    const toleranceValue = tolerance.upper - tolerance.lower;

    return {
      error: null,
      upper: tolerance.upper,
      lower: tolerance.lower,
      upperLimit,
      lowerLimit,
      toleranceValue: Math.abs(toleranceValue),
      range: `${range.min} - ${range.max} mm`
    };
  }, [diameter, toleranceClass, type]);

  const commonClasses = type === 'holes' 
    ? ['H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'G6', 'G7', 'F7', 'F8', 'F9', 'E7', 'E8', 'E9', 'D8', 'D9', 'D10', 'D11', 'JS6', 'JS7', 'J6', 'J7', 'J8', 'J9', 'K6', 'K7', 'M6', 'M7', 'N6', 'P6']
    : ['h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'h11', 'g6', 'f6', 'f7', 'f8', 'e6', 'e7', 'e8', 'e9', 'd8', 'd9', 'd10', 'js6', 'js7', 'j5', 'j6', 'j7', 'j8', 'k5', 'k6', 'm6', 'm7', 'n6', 'n7', 'p6', 'p7', 'r6', 's6', 's7'];

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-[#eab308] active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col">
          <h1 className="text-white font-black text-sm uppercase tracking-widest italic">Verificador ISO</h1>
          <p className="text-[#eab308] text-[8px] font-black uppercase tracking-[0.2em]">Cálculo de Ajustes</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-32">
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => { setType('holes'); setToleranceClass(''); }}
            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic ${
              type === 'holes' ? 'bg-[#eab308] text-black shadow-lg shadow-[#eab308]/20' : 'bg-white/5 text-gray-500'
            }`}
          >
            Furo (MAI)
          </button>
          <button
            onClick={() => { setType('shafts'); setToleranceClass(''); }}
            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic ${
              type === 'shafts' ? 'bg-[#eab308] text-black shadow-lg shadow-[#eab308]/20' : 'bg-white/5 text-gray-500'
            }`}
          >
            Eixo (min)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex flex-col gap-3">
            <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black italic ml-2">Diâmetro (mm)</label>
            <input
              type="number"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
              placeholder="Ex: 20"
              className="w-full h-16 bg-[#1c1e22] border border-white/10 rounded-[1.5rem] px-6 text-white font-black italic text-lg focus:border-[#eab308]/50 outline-none transition-all shadow-xl"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black italic ml-2">Classe</label>
            <input
              type="text"
              value={toleranceClass}
              onChange={(e) => setToleranceClass(e.target.value)}
              placeholder={type === 'holes' ? 'Ex: H7' : 'Ex: h7'}
              className="w-full h-16 bg-[#1c1e22] border border-white/10 rounded-[1.5rem] px-6 text-white font-black italic text-lg focus:border-[#eab308]/50 outline-none transition-all shadow-xl"
            />
          </div>
        </div>

        <div className="mb-10">
          <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black mb-4 block italic ml-2">Sugestões Comuns</label>
          <div className="flex flex-nowrap gap-2 overflow-x-auto pb-4 custom-scrollbar">
            {commonClasses.map((cls) => (
              <button
                key={cls}
                onClick={() => setToleranceClass(cls)}
                className={`px-5 py-3 rounded-xl text-[10px] font-black italic transition-all border shrink-0 ${
                  toleranceClass === cls
                    ? 'bg-[#eab308] border-[#eab308] text-black shadow-lg shadow-[#eab308]/20'
                    : 'bg-[#1c1e22] border-white/5 text-gray-500'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {result.error ? (
              <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] text-rose-400 text-[10px] text-center font-black uppercase tracking-widest">
                {result.error}
              </div>
            ) : (
              <div className="bg-[#1c1e22] rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#eab308]/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black mb-2 italic">Resultado</p>
                    <h2 className="text-4xl font-black italic text-white tracking-tighter">
                      Ø{diameter} <span className="text-[#eab308]">{toleranceClass}</span>
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black mb-2 italic">Campo</p>
                    <p className="text-white font-black text-xs italic">{result.range}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 font-black mb-2 italic">Afast. Superior</p>
                    <p className={`text-2xl font-black italic ${result.upper! >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {result.upper! > 0 ? '+' : ''}{result.upper!.toFixed(3)}
                    </p>
                  </div>
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 font-black mb-2 italic">Afast. Inferior</p>
                    <p className={`text-2xl font-black italic ${result.lower! >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {result.lower! > 0 ? '+' : ''}{result.lower!.toFixed(3)}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-[#eab308] rounded-2xl text-black">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] uppercase tracking-widest font-black italic opacity-60">Limite Máximo</p>
                    <p className="text-lg font-black italic">Ø{result.upperLimit!.toFixed(3)} mm</p>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] uppercase tracking-widest font-black italic opacity-60">Limite Mínimo</p>
                    <p className="text-lg font-black italic">Ø{result.lowerLimit!.toFixed(3)} mm</p>
                  </div>
                  <div className="h-px bg-black/10 my-3" />
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] uppercase tracking-widest font-black italic opacity-60">Tolerância Total</p>
                    <p className="text-lg font-black italic">{result.toleranceValue!.toFixed(3)} mm</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <BottomNav currentScreen="home" navigate={navigate} />
    </div>
  );
};

export default ToleranceVerifier;
