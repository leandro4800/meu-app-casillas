
import React, { useState, useMemo } from 'react';

const GearCalc: React.FC = () => {
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
    return `*CASILLAS - CÁLCULO DE ENGRENAGEM*\n\n` +
           `*Módulo (m):* ${mod}\n` +
           `*Nº de Dentes (Z):* ${z}\n\n` +
           `*RESULTADOS:*\n` +
           `*Ø Externo (De):* ${results.de.toFixed(2)}mm\n` +
           `*Ø Primitivo (Dp):* ${results.dp.toFixed(2)}mm\n` +
           `*Altura Total (h):* ${results.h.toFixed(2)}mm\n` +
           `*Passo (p):* ${results.p.toFixed(2)}mm\n\n` +
           `_Gerado via Casillas Digital_`;
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(formatReport())}`, '_blank');
  const shareEmail = () => window.location.href = `mailto:?subject=Cálculo de Engrenagem - Casillas&body=${encodeURIComponent(formatReport())}`;
  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem('casillas_history') || '[]');
    history.unshift({ date: new Date().toISOString(), type: 'Cálculo Engrenagem', report: formatReport() });
    localStorage.setItem('casillas_history', JSON.stringify(history.slice(0, 50)));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#121214] text-white relative">
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#eab308] text-black px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-2xl animate-bounce">
           Salvo com Sucesso!
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-32">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Módulo (m)</label>
            <input type="number" value={mod} onChange={(e) => setMod(e.target.value)} className="w-full bg-[#1c1e22] border-2 border-white/5 rounded-2xl h-16 px-5 text-white font-mono text-xl outline-none" placeholder="Ex: 2.5" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nº Dentes (Z)</label>
            <input type="number" value={z} onChange={(e) => setZ(e.target.value)} className="w-full bg-[#1c1e22] border-2 border-white/5 rounded-2xl h-16 px-5 text-white font-mono text-xl outline-none" placeholder="Ex: 40" />
          </div>
        </div>

        {results && (
          <div className="space-y-4">
             <div className="bg-[#1c1e22] border-l-4 border-[#eab308] p-6 rounded-r-3xl shadow-xl">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Diâmetro Externo (De)</p>
                <div className="flex items-baseline gap-2 mt-1">
                   <h4 className="text-5xl font-black text-white">{results.de.toFixed(2)}</h4>
                   <span className="text-xl font-bold text-gray-600">mm</span>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1c1e22] p-4 rounded-3xl border border-white/5 text-center">
                   <p className="text-[9px] font-black text-gray-600 uppercase mb-1">Ø Primitivo (Dp)</p>
                   <p className="text-xl font-black text-white">{results.dp.toFixed(2)}</p>
                </div>
                <div className="bg-[#1c1e22] p-4 rounded-3xl border border-white/5 text-center">
                   <p className="text-[9px] font-black text-gray-600 uppercase mb-1">Altura Total (h)</p>
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
            <span className="material-symbols-outlined text-lg">save</span> SALVAR
         </button>
      </div>
    </div>
  );
};

export default GearCalc;
