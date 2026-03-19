
import React, { useState } from 'react';
import { DIVIDER_PLATES } from '../constants';

interface DividerCalcProps {
  t: any;
}

const DividerCalc: React.FC<DividerCalcProps> = ({ t }) => {
  const [divisions, setDivisions] = useState<string>('36');
  const [ratio, setRatio] = useState<string>('40');
  const [selectedPlate, setSelectedPlate] = useState<string>(DIVIDER_PLATES[0].id);
  const [showToast, setShowToast] = useState(false);

  const calculate = () => {
    const k = parseFloat(ratio);
    const z = parseFloat(divisions);
    if (!k || !z) return null;
    const fullTurns = Math.floor(k / z);
    const fraction = (k / z) - fullTurns;
    const plate = DIVIDER_PLATES.find(p => p.id === selectedPlate);
    let bestFit = null;
    if (fraction > 0 && plate) {
      for (const holeCount of plate.holes) {
        const neededHoles = fraction * holeCount;
        if (Math.abs(neededHoles - Math.round(neededHoles)) < 0.001) {
          bestFit = { holes: Math.round(neededHoles), plate: holeCount };
          break;
        }
      }
    }
    return { fullTurns, bestFit };
  };

  const res = calculate();

  const formatReport = () => {
    if (!res) return '';
    return `*CASILLAS - ${t.divider_calc}*\n\n` +
           `*${t.divisions} (Z):* ${divisions}\n` +
           `*${t.ratio} (K):* ${ratio}\n\n` +
           `*${t.result}:*\n` +
           `*${t.full_turns}:* ${res.fullTurns}\n` +
           `${res.bestFit ? `*${t.advance}:* ${res.bestFit.holes} ${t.holes} ${t.on_plate} ${res.bestFit.plate}` : t.exact_division}\n\n` +
           `_Gerado via Casillas Digital_`;
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(formatReport())}`, '_blank');
  const shareEmail = () => window.location.href = `mailto:?subject=${t.divider_calc} - Casillas&body=${encodeURIComponent(formatReport())}`;
  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem('casillas_history') || '[]');
    history.unshift({ date: new Date().toISOString(), type: t.divider_calc, report: formatReport() });
    localStorage.setItem('casillas_history', JSON.stringify(history.slice(0, 50)));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#121214] text-white relative">
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#eab308] text-black px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-2xl animate-bounce">
           {t.saved}!
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-32">
        <input type="number" value={divisions} onChange={(e) => setDivisions(e.target.value)} className="w-full bg-[#1c1e22] border-2 border-white/5 rounded-2xl h-16 px-5 text-white font-mono text-xl outline-none" placeholder={t.divisions} />
        <input type="number" value={ratio} onChange={(e) => setRatio(e.target.value)} className="w-full bg-[#1c1e22] border-2 border-white/5 rounded-2xl h-16 px-5 text-white font-mono text-xl outline-none" placeholder={t.ratio} />
        
        {res && (
          <div className="bg-[#1c1e22] rounded-[40px] p-8 border border-white/5 shadow-2xl flex flex-col items-center">
             <div className="flex items-baseline gap-4">
                <h3 className="text-8xl font-black text-[#eab308] tracking-tighter">{res.fullTurns}</h3>
                <span className="text-2xl font-black text-white">{t.turns}</span>
             </div>
             {res.bestFit && (
                <div className="w-full grid grid-cols-2 gap-8 mt-6 border-t border-white/5 pt-6 text-center">
                   <div><p className="text-xs text-gray-500 uppercase">{t.holes}</p><span className="text-3xl font-black text-[#eab308]">{res.bestFit.holes}</span></div>
                   <div><p className="text-xs text-gray-500 uppercase">{t.plate}</p><span className="text-3xl font-black text-white">{res.bestFit.plate}</span></div>
                </div>
             )}
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-40 bg-[#121214]/80 backdrop-blur-md p-2 rounded-2xl border border-white/5">
         <button onClick={shareWhatsApp} className="size-12 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-xl active:scale-95 transition-all shrink-0">
            <span className="material-symbols-outlined text-xl">chat</span>
         </button>
         <button onClick={shareEmail} className="size-12 bg-white/10 text-gray-300 rounded-xl border border-white/5 flex items-center justify-center shadow-xl active:scale-95 transition-all shrink-0">
            <span className="material-symbols-outlined text-xl">mail</span>
         </button>
         <button onClick={handleSave} className="flex-1 bg-[#eab308] text-black font-black py-3 rounded-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-[11px] tracking-widest">
            <span className="material-symbols-outlined text-lg">save</span> {t.save}
         </button>
      </div>
    </div>
  );
};

export default DividerCalc;
