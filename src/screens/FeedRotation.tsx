
import React, { useState, useEffect } from 'react';
import { ToolInsert } from '../types';

interface FeedRotationProps {
  initialData?: ToolInsert | null;
  t: any;
}

const FeedRotation: React.FC<FeedRotationProps> = ({ initialData, t }) => {
  const [n, setN] = useState<string>('1500');
  const [fz, setFz] = useState<string>('0.15');
  const [z, setZ] = useState<number>(4);
  const [vf, setVf] = useState<number>(900);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFz(initialData.parameters.fn.toString());
      setZ(initialData.category === 'Fresamento' ? 4 : 1);
    }
  }, [initialData]);

  const calculate = () => {
    const rpm = parseFloat(n) || 0;
    const feedTooth = parseFloat(fz) || 0;
    const teeth = z || 0;
    setVf(Math.round(rpm * feedTooth * teeth));
  };

  const formatReport = () => {
    return `*CASILLAS - ${t.calculate} VF*\n\n` +
           `*${t.rotation} (n):* ${n} RPM\n` +
           `*${t.feed_tooth} (fz):* ${fz} ${t.unit}\n` +
           `*${t.teeth} (Z):* ${z}\n\n` +
           `*${t.result} (VF):* ${vf} ${t.unit}/min\n\n` +
           `_Gerado via Casillas Digital_`;
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(formatReport())}`, '_blank');
  const shareEmail = () => window.location.href = `mailto:?subject=${t.calculate} VF&body=${encodeURIComponent(formatReport())}`;
  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem('casillas_history') || '[]');
    history.unshift({ date: new Date().toISOString(), type: `${t.calculate} VF`, report: formatReport() });
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

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-32">
        <div className="bg-[#1c1e22] rounded-2xl p-4 flex items-center gap-4 border border-white/5">
          <div className="size-10 rounded-full bg-[#252930] flex items-center justify-center text-[#eab308]"><span className="material-symbols-outlined">info</span></div>
          <div className="flex-1">
            <p className="text-[#eab308] text-sm font-bold">{t.formula_used}</p>
            <code className="text-gray-400 text-xs font-mono">Vf = fz × n × Z</code>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[#eab308] text-sm font-bold">{t.rotation} (n)</label>
            <input type="number" value={n} onChange={(e) => setN(e.target.value)} className="w-full bg-[#1c1e22] border border-white/5 rounded-2xl h-16 px-5 text-gray-300 text-lg outline-none focus:border-[#eab308]/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[#eab308] text-sm font-bold">{t.feed_tooth} (fz)</label>
            <input type="number" step="0.01" value={fz} onChange={(e) => setFz(e.target.value)} className="w-full bg-[#1c1e22] border border-white/5 rounded-2xl h-16 px-5 text-gray-300 text-lg outline-none focus:border-[#eab308]/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[#eab308] text-sm font-bold">{t.teeth} (Z)</label>
            <div className="flex items-center bg-[#1c1e22] border border-white/5 rounded-2xl h-16 px-2">
              <button onClick={() => setZ(Math.max(1, z - 1))} className="size-12 rounded-xl bg-[#252930] text-[#eab308]"><span className="material-symbols-outlined">remove</span></button>
              <div className="flex-1 text-center text-xl font-bold text-white">{z}</div>
              <button onClick={() => setZ(z + 1)} className="size-12 rounded-xl bg-[#252930] text-[#eab308]"><span className="material-symbols-outlined">add</span></button>
            </div>
          </div>
        </div>

        <button onClick={calculate} className="w-full bg-[#eab308] text-black font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-lg active:scale-95 transition-all">{t.calculate}</button>

        <div className="bg-[#1c1e22] rounded-3xl p-8 border-l-4 border-[#eab308] shadow-2xl">
           <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{t.result} (VF)</p>
           <div className="flex items-baseline gap-3 mt-2">
              <h4 className="text-6xl font-black text-[#eab308] tracking-tighter tabular-nums leading-none">{vf}</h4>
              <span className="text-xl font-black text-gray-500">{t.unit}/min</span>
           </div>
        </div>
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

export default FeedRotation;
