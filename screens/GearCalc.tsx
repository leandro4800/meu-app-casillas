
import React, { useState, useMemo } from 'react';

interface GearCalcProps {
  t: any;
}

const GearCalc: React.FC<GearCalcProps> = ({ t }) => {
  const [mod, setMod] = useState<string>('2.5');
  const [z, setZ] = useState<string>('40');
  const [showToast, setShowToast] = useState(false);

  const results = useMemo(() => {
    const m = parseFloat(mod);
    const teeth = parseFloat(z);
    if (!m || !teeth) return null;
    return { de: m * (teeth + 2), dp: m * teeth, h: 2.166 * m, p: Math.PI * m };
  }, [mod, z]);

  const formatReport = () => {
    if (!results) return '';
    return `*CASILLAS - ${t.calculate} ${t.gear}*\n\n` +
           `*${t.module} (m):* ${mod}\n` +
           `*${t.teeth} (Z):* ${z}\n\n` +
           `*${t.results}:*\n` +
           `*Ø ${t.external} (De):* ${results.de.toFixed(2)}${t.unit}\n` +
           `*Ø ${t.primitive} (Dp):* ${results.dp.toFixed(2)}${t.unit}\n` +
           `*${t.total_height} (h):* ${results.h.toFixed(2)}${t.unit}\n` +
           `*${t.pitch} (p):* ${results.p.toFixed(2)}${t.unit}\n\n` +
           `_Gerado via Casillas Digital_`;
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(formatReport())}`, '_blank');
  const shareEmail = () => window.location.href = `mailto:?subject=${t.calculate} ${t.gear} - Casillas&body=${encodeURIComponent(formatReport())}`;
  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem('casillas_history') || '[]');
    history.unshift({ date: new Date().toISOString(), type: `${t.calculate} ${t.gear}`, report: formatReport() });
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.module} (m)</label>
            <input type="number" value={mod} onChange={(e) => setMod(e.target.value)} className="w-full bg-[#1c1e22] border-2 border-white/5 rounded-2xl h-16 px-5 text-white font-mono text-xl outline-none" placeholder="Ex: 2.5" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.teeth} (Z)</label>
            <input type="number" value={z} onChange={(e) => setZ(e.target.value)} className="w-full bg-[#1c1e22] border-2 border-white/5 rounded-2xl h-16 px-5 text-white font-mono text-xl outline-none" placeholder="Ex: 40" />
          </div>
        </div>

        {results && (
          <div className="space-y-4">
             <div className="bg-[#1c1e22] border-l-4 border-[#eab308] p-6 rounded-r-3xl shadow-xl">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{t.external_diameter} (De)</p>
                <div className="flex items-baseline gap-2 mt-1">
                   <h4 className="text-5xl font-black text-white">{results.de.toFixed(2)}</h4>
                   <span className="text-xl font-bold text-gray-600">{t.unit}</span>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1c1e22] p-4 rounded-3xl border border-white/5 text-center">
                   <p className="text-[9px] font-black text-gray-600 uppercase mb-1">{t.primitive_diameter} (Dp)</p>
                   <p className="text-xl font-black text-white">{results.dp.toFixed(2)}</p>
                </div>
                <div className="bg-[#1c1e22] p-4 rounded-3xl border border-white/5 text-center">
                   <p className="text-[9px] font-black text-gray-600 uppercase mb-1">{t.total_height} (h)</p>
                   <p className="text-xl font-black text-white">{results.h.toFixed(2)}</p>
                </div>
             </div>
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

export default GearCalc;
