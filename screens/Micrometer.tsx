
import React, { useState, useMemo } from 'react';

interface MicrometerProps {
  t: any;
}

const Micrometer: React.FC<MicrometerProps> = ({ t }) => {
  const [sleeve, setSleeve] = useState(5.5);
  const [thimble, setThimble] = useState(21);
  const [vernier, setVernier] = useState(2);
  const [showToast, setShowToast] = useState(false);

  const finalValue = sleeve + (thimble * 0.01) + (vernier * 0.001);

  const reset = () => {
    setSleeve(0);
    setThimble(0);
    setVernier(0);
  };

  const sleeveOptions = Array.from({ length: 51 }, (_, i) => i * 0.5); 
  const thimbleOptions = Array.from({ length: 50 }, (_, i) => i);
  const vernierOptions = Array.from({ length: 10 }, (_, i) => i);

  const handleSave = () => {
    const report = `*CASILLAS - LEITURA MICRÔMETRO*\n\n` +
                   `*Bainha:* ${sleeve.toFixed(3)} mm\n` +
                   `*Tambor:* ${(thimble * 0.01).toFixed(3)} mm\n` +
                   `*Nônio:* ${(vernier * 0.001).toFixed(3)} mm\n\n` +
                   `*RESULTADO FINAL:* ${finalValue.toFixed(3)} mm\n\n` +
                   `_Simulação Prática Casillas_`;
    
    const history = JSON.parse(localStorage.getItem('casillas_history') || '[]');
    history.unshift({ date: new Date().toISOString(), type: 'Metrologia', report });
    localStorage.setItem('casillas_history', JSON.stringify(history.slice(0, 50)));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#161412] text-white relative">
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#eab308] text-black px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-2xl animate-bounce">
           Leitura Salva!
        </div>
      )}

      <div className="p-6 bg-[#221e1b]/50 border-b border-white/5 flex flex-col items-center">
         <div className="w-full flex justify-between items-center mb-4">
            <div className="flex flex-col">
               <h2 className="text-white text-xl font-black uppercase tracking-tight">Leitura de Micrômetro</h2>
               <span className="text-[#eab308] text-[9px] font-black uppercase tracking-widest bg-[#eab308]/10 px-2 py-0.5 rounded border border-[#eab308]/10">MODO PRÁTICO</span>
            </div>
         </div>
         <div className="w-full h-48 bg-[#161412] rounded-3xl border border-white/5 relative flex items-center justify-center overflow-hidden">
            <div className="relative flex items-center scale-125">
               <div className="w-24 h-12 bg-gradient-to-b from-[#2d2622] to-[#221e1b] border border-white/10 rounded-l-md flex items-center relative">
                  <div className="w-full h-[1px] bg-[#eab308]/40 absolute top-1/2 -translate-y-1/2"></div>
               </div>
               <div className="w-16 h-20 bg-gradient-to-b from-[#3a322e] via-[#2d2622] to-[#3a322e] border border-white/10 rounded-md shadow-2xl relative flex items-center justify-center">
                  <div className="absolute left-0 h-full w-[2px] bg-[#eab308]"></div>
                  <div className="flex flex-col gap-2 items-center opacity-50">
                     <span className="text-[10px] text-[#eab308] font-black">{thimble}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-40">
         <div className="bg-[#221e1b] rounded-[32px] p-1 grid grid-cols-3 gap-1 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col items-center py-4 rounded-2xl bg-[#161412]/50 relative">
               <span className="text-[9px] font-black text-[#eab308] uppercase mb-4 tracking-tighter opacity-60">Bainha</span>
               <div className="h-40 w-full overflow-y-auto no-scrollbar snap-y snap-mandatory flex flex-col items-center">
                  {sleeveOptions.map(v => (
                     <button key={v} onClick={() => setSleeve(v)} className={`h-12 shrink-0 flex items-center justify-center text-base font-black transition-all snap-center ${sleeve === v ? 'text-[#eab308] scale-125' : 'text-gray-700 opacity-20'}`}>
                        {v.toFixed(1)}
                     </button>
                  ))}
               </div>
            </div>
            <div className="flex flex-col items-center py-4 rounded-2xl bg-[#161412]/50 relative">
               <span className="text-[9px] font-black text-[#eab308] uppercase mb-4 tracking-tighter opacity-60">Tambor</span>
               <div className="h-40 w-full overflow-y-auto no-scrollbar snap-y snap-mandatory flex flex-col items-center">
                  {thimbleOptions.map(v => (
                     <button key={v} onClick={() => setThimble(v)} className={`h-12 shrink-0 flex items-center justify-center text-base font-black transition-all snap-center ${thimble === v ? 'text-[#eab308] scale-125' : 'text-gray-700 opacity-20'}`}>
                        {v}
                     </button>
                  ))}
               </div>
            </div>
            <div className="flex flex-col items-center py-4 rounded-2xl bg-[#161412]/50 relative">
               <span className="text-[9px] font-black text-[#eab308] uppercase mb-4 tracking-tighter opacity-60">Nônio</span>
               <div className="h-40 w-full overflow-y-auto no-scrollbar snap-y snap-mandatory flex flex-col items-center">
                  {vernierOptions.map(v => (
                     <button key={v} onClick={() => setVernier(v)} className={`h-12 shrink-0 flex items-center justify-center text-base font-black transition-all snap-center ${vernier === v ? 'text-[#eab308] scale-125' : 'text-gray-700 opacity-20'}`}>
                        {v}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-gradient-to-br from-[#161412] to-black rounded-[40px] p-10 border border-[#eab308]/20 shadow-2xl flex flex-col items-center justify-center">
            <h4 className="text-7xl font-black text-white tracking-tighter tabular-nums leading-none">
               {finalValue.toFixed(3)}
            </h4>
            <span className="text-2xl font-black text-gray-700 uppercase italic">mm</span>
         </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex gap-3 z-50 bg-[#161412]/90 backdrop-blur-lg p-2 rounded-3xl border border-white/5 shadow-2xl">
         <button onClick={reset} className="flex-1 bg-[#2d2622] text-gray-400 font-black py-4 rounded-2xl flex items-center justify-center gap-2 border border-white/5 active:scale-95 transition-all uppercase text-[10px]">Reiniciar</button>
         <button onClick={handleSave} className="flex-[1.5] bg-[#eab308] text-black font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-[10px]">Salvar</button>
      </div>
    </div>
  );
};

export default Micrometer;
