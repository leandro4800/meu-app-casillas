
import React, { useState, useMemo } from 'react';

const ISO_TABLE: Record<string, { ranges: number[], values: number[], type: 'hole' | 'shaft' }> = {
  'H7': { ranges: [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500], values: [0, 10, 12, 15, 18, 21, 25, 30, 35, 40, 46, 52, 57, 63], type: 'hole' },
  'H8': { ranges: [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500], values: [0, 14, 18, 22, 27, 33, 39, 46, 54, 63, 72, 81, 89, 97], type: 'hole' },
  'h6': { ranges: [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500], values: [0, 6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40], type: 'shaft' },
  'g6': { ranges: [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500], values: [2, 4, 5, 6, 7, 9, 10, 12, 14, 15, 17, 18, 20, 22], type: 'shaft' }
};

interface VerifierProps {
  t: any;
}

const Verifier: React.FC<VerifierProps> = ({ t }) => {
  const [nominalStr, setNominalStr] = useState('50');
  const [measuredValue, setMeasuredValue] = useState(50.012);
  const [isoClass, setIsoClass] = useState('H7');

  const toleranceLimits = useMemo(() => {
    const nominal = parseFloat(nominalStr);
    if (isNaN(nominal) || nominal <= 0) return { max: 0, min: 0, devUpper: 0, devLower: 0 };
    const config = ISO_TABLE[isoClass];
    let itValue = 0;
    for (let i = 0; i < config.ranges.length - 1; i++) {
      if (nominal > config.ranges[i] && nominal <= config.ranges[i+1]) {
        itValue = config.values[i+1];
        break;
      }
    }
    const itMm = itValue / 1000;
    if (config.type === 'hole') return { max: nominal + itMm, min: nominal, devUpper: itMm, devLower: 0 };
    else {
      if (isoClass === 'g6') {
        const fundamental = 0.010; 
        return { max: nominal - fundamental, min: nominal - fundamental - itMm, devUpper: -fundamental, devLower: -(fundamental + itMm) };
      }
      return { max: nominal, min: nominal - itMm, devUpper: 0, devLower: -itMm };
    }
  }, [nominalStr, isoClass]);

  const { max, min, devUpper, devLower } = toleranceLimits;
  const status = useMemo(() => {
    if (measuredValue >= (min - 0.0001) && measuredValue <= (max + 0.0001)) return { label: t.approved, color: 'text-green-500', bg: 'bg-green-500/10' };
    return { label: t.rejected, color: 'text-red-500', bg: 'bg-red-500/10' };
  }, [measuredValue, min, max, t]);

  const adjustValue = (stepMm: number) => setMeasuredValue(prev => parseFloat((prev + stepMm).toFixed(3)));

  return (
    <div className="p-5 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pb-32">
      <div className="space-y-1">
        <h3 className="text-[#eab308] text-2xl font-bold tracking-tight uppercase">Verificador ISO</h3>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Controle ({t.unit})</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-gray-500 uppercase ml-1">{t.nominal} (mm)</label>
          <input type="number" value={nominalStr} onChange={(e) => setNominalStr(e.target.value)} className="w-full bg-[#252930] rounded-xl h-14 px-4 text-white font-mono font-black text-lg outline-none" />
          <p className="text-[9px] text-[#eab308] font-bold mt-1">{(parseFloat(nominalStr) * t.unit_mult).toFixed(t.unit_precision)} {t.unit}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-gray-500 uppercase ml-1">{t.class}</label>
          <select value={isoClass} onChange={(e) => setIsoClass(e.target.value)} className="w-full bg-[#252930] rounded-xl h-14 px-4 text-[#eab308] font-black text-lg outline-none">
            <option value="H7">H7</option><option value="H8">H8</option><option value="h6">h6</option><option value="g6">g6</option>
          </select>
        </div>
      </div>

      <div className="bg-[#1c1e22] p-6 rounded-[32px] border border-white/5 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t.measured} ({t.unit})</label>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => adjustValue(-0.001)} className="size-14 bg-[#252930] rounded-2xl flex items-center justify-center text-red-500 active:scale-90 transition-all shadow-lg"><span className="material-symbols-outlined">remove</span></button>
           <div className="flex-1 flex flex-col items-center">
              <span className={`text-4xl font-black tabular-nums leading-none ${status.label === t.approved ? 'text-green-500' : 'text-red-500'}`}>
                {(measuredValue * t.unit_mult).toFixed(t.unit_precision)}
              </span>
           </div>
           <button onClick={() => adjustValue(0.001)} className="size-14 bg-[#252930] rounded-2xl flex items-center justify-center text-green-500 active:scale-90 transition-all shadow-lg"><span className="material-symbols-outlined">add</span></button>
        </div>
      </div>

      <div className={`${status.bg} border border-white/5 rounded-[32px] p-6 flex flex-col items-center justify-center shadow-xl`}>
        <h4 className={`${status.color} text-4xl font-black uppercase tracking-tighter italic`}>{status.label}</h4>
        
        <div className="w-full grid grid-cols-3 text-[10px] font-mono mt-8 gap-4 px-2">
          <div className="flex flex-col items-start bg-black/20 p-3 rounded-2xl border border-white/5">
            <span className="text-gray-600 font-black uppercase text-[8px] mb-1">MIN</span>
            <span className="text-red-500 font-black text-[10px]">{(min * t.unit_mult).toFixed(t.unit_precision)}</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-gray-600 font-black uppercase text-[8px] mb-1">NOM</span>
            <span className="text-white font-black text-[10px]">{(parseFloat(nominalStr) * t.unit_mult).toFixed(t.unit_precision)}</span>
          </div>
          <div className="flex flex-col items-end bg-black/20 p-3 rounded-2xl border border-white/5">
            <span className="text-gray-600 font-black uppercase text-[8px] mb-1">MAX</span>
            <span className="text-green-500 font-black text-[10px]">{(max * t.unit_mult).toFixed(t.unit_precision)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verifier;
