import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ISO_TOLERANCES } from '../src/data/tolerances';

interface ToleranceVerifierProps {
  onBack: () => void;
}

const ToleranceVerifier: React.FC<ToleranceVerifierProps> = ({ onBack }) => {
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
        <button onClick={onBack} className="size-10 flex items-center justify-center text-[#eab308]">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-white font-black text-sm uppercase tracking-widest">Verificador ISO</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setType('holes'); setToleranceClass(''); }}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              type === 'holes' ? 'bg-[#eab308] text-black' : 'bg-white/5 text-gray-400'
            }`}
          >
            Furo (Maiúsculas)
          </button>
          <button
            onClick={() => { setType('shafts'); setToleranceClass(''); }}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              type === 'shafts' ? 'bg-[#eab308] text-black' : 'bg-white/5 text-gray-400'
            }`}
          >
            Eixo (Minúsculas)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Diâmetro (mm)</label>
            <input
              type="number"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
              placeholder="Ex: 20"
              className="w-full h-14 bg-[#1c1e22] border border-white/5 rounded-xl px-4 text-white font-mono focus:border-[#eab308] outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Classe</label>
            <input
              type="text"
              value={toleranceClass}
              onChange={(e) => setToleranceClass(e.target.value)}
              placeholder={type === 'holes' ? 'Ex: H7' : 'Ex: h7'}
              className="w-full h-14 bg-[#1c1e22] border border-white/5 rounded-xl px-4 text-white font-mono focus:border-[#eab308] outline-none transition-all"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 block">Sugestões Comuns</label>
          <div className="flex flex-nowrap gap-2 overflow-x-auto pb-4 no-scrollbar">
            {commonClasses.map((cls) => (
              <button
                key={cls}
                onClick={() => setToleranceClass(cls)}
                className={`px-4 py-2 rounded-lg text-xs font-black italic transition-all border ${
                  toleranceClass === cls
                    ? 'bg-[#eab308] border-[#eab308] text-black'
                    : 'bg-white/5 border-transparent text-gray-400'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {result.error ? (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs text-center font-bold">
                {result.error}
              </div>
            ) : (
              <>
                <div className="bg-[#1c1e22] rounded-2xl border border-white/5 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#eab308]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                  
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Ajuste Selecionado</p>
                      <h2 className="text-3xl font-black italic text-white">
                        Ø{diameter} <span className="text-[#eab308]">{toleranceClass}</span>
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Campo</p>
                      <p className="text-white font-mono text-sm">{result.range}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Afastamento Superior</p>
                      <p className={`text-xl font-mono ${result.upper! >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {result.upper! > 0 ? '+' : ''}{result.upper!.toFixed(3)}
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Afastamento Inferior</p>
                      <p className={`text-xl font-mono ${result.lower! >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {result.lower! > 0 ? '+' : ''}{result.lower!.toFixed(3)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-[#eab308]/10 rounded-xl border border-[#eab308]/20">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] uppercase tracking-widest text-[#eab308] font-black">Limite Máximo</p>
                      <p className="text-white font-mono font-bold">Ø{result.upperLimit!.toFixed(3)} mm</p>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] uppercase tracking-widest text-[#eab308] font-black">Limite Mínimo</p>
                      <p className="text-white font-mono font-bold">Ø{result.lowerLimit!.toFixed(3)} mm</p>
                    </div>
                    <div className="h-px bg-[#eab308]/20 my-2" />
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] uppercase tracking-widest text-[#eab308] font-black">Tolerância Total</p>
                      <p className="text-white font-mono font-bold">{result.toleranceValue!.toFixed(3)} mm</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ToleranceVerifier;
