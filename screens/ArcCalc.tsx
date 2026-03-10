
import React, { useState, useMemo } from 'react';

type InputMode = 'raio_corda' | 'arco_raio' | 'corda_flecha';

interface ArcCalcProps {
  t: any;
}

const ArcCalc: React.FC<ArcCalcProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<'calc' | 'table'>('calc');
  const [mode, setMode] = useState<InputMode>('raio_corda');
  const [val1, setVal1] = useState('100');
  const [val2, setVal2] = useState('50');
  const [showToast, setShowToast] = useState(false);

  const results = useMemo(() => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    if (isNaN(v1) || isNaN(v2) || v1 <= 0 || v2 <= 0) return null;

    let r = 0, c = 0, f = 0, l = 0, ang = 0;

    if (mode === 'raio_corda') {
      r = v1; c = v2;
      if (c > 2 * r) return null;
      const halfAng = Math.asin(c / (2 * r));
      ang = (halfAng * 2 * 180) / Math.PI;
      f = r * (1 - Math.cos(halfAng));
      l = r * (halfAng * 2);
    } else if (mode === 'arco_raio') {
      l = v1; r = v2;
      const angleRad = l / r;
      ang = (angleRad * 180) / Math.PI;
      c = 2 * r * Math.sin(angleRad / 2);
      f = r * (1 - Math.cos(angleRad / 2));
    } else if (mode === 'corda_flecha') {
      c = v1; f = v2;
      r = (Math.pow(c / 2, 2) + Math.pow(f, 2)) / (2 * f);
      const halfAng = Math.asin(c / (2 * r));
      ang = (halfAng * 2 * 180) / Math.PI;
      l = r * (halfAng * 2);
    }

    return { r, c, f, l, ang };
  }, [mode, val1, val2]);

  const formatReport = () => {
    if (!results) return '';
    return `*CASILLAS - ARCO, FLECHA E CORDA*\n\n` +
           `*Modo:* ${mode.replace('_', ' & ').toUpperCase()}\n` +
           `*Raio (r):* ${results.r.toFixed(2)} mm\n` +
           `*Arco (l):* ${results.l.toFixed(2)} mm\n` +
           `*Flecha (f):* ${results.f.toFixed(2)} mm\n` +
           `*Corda (c):* ${results.c.toFixed(2)} mm\n\n` +
           `_Gerado via Casillas Digital_`;
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(formatReport())}`, '_blank');
  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem('casillas_history') || '[]');
    history.unshift({ date: new Date().toISOString(), type: 'Arco e Flecha', report: formatReport() });
    localStorage.setItem('casillas_history', JSON.stringify(history.slice(0, 50)));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#161412] text-white relative">
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-[#eab308] text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
           Resultado Salvo no Histórico
        </div>
      )}

      {/* Sub-Header Tabs */}
      <div className="px-6 pt-4 shrink-0">
        <div className="bg-[#1c1e22] p-1.5 rounded-2xl flex gap-1 border border-white/5 shadow-inner">
          <button 
            onClick={() => setActiveTab('calc')} 
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${activeTab === 'calc' ? 'bg-[#eab308] text-black shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}
          >
            Calculadora
          </button>
          <button 
            onClick={() => setActiveTab('table')} 
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${activeTab === 'table' ? 'bg-[#eab308] text-black shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}
          >
            Tabela de Flechas
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 space-y-6 pb-32 pt-6">
        {activeTab === 'calc' ? (
          <>
            {/* Diagrama Blueprint */}
            <div className="bg-[#12100e] rounded-[32px] h-56 flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-2xl border border-white/5">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs><pattern id="arc-blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#eab308" strokeWidth="0.5"/></pattern></defs>
                    <rect width="100%" height="100%" fill="url(#arc-blueprint-grid)" />
                  </svg>
               </div>
               
               <svg viewBox="0 0 200 100" className="w-full h-full stroke-[#eab308] fill-none stroke-2 drop-shadow-[0_0_12px_rgba(234,179,8,0.35)]">
                  {/* O Arco */}
                  <path d="M 40 85 Q 100 15 160 85" strokeWidth="3" strokeLinecap="round" />
                  {/* A Corda */}
                  <line x1="40" y1="85" x2="160" y2="85" strokeOpacity="0.3" strokeDasharray="4 2" />
                  {/* A Flecha */}
                  <line x1="100" y1="50" x2="100" y2="85" strokeOpacity="0.5" strokeDasharray="3" />
                  <path d="M 97 50 L 100 45 L 103 50" strokeOpacity="0.8" />
               </svg>
               
               <div className="absolute bottom-4 left-6 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-[#eab308] animate-pulse"></div>
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">Cálculo Trigonométrico</span>
               </div>
            </div>

            {/* Seletor de Modo de Entrada */}
            <div className="space-y-3">
              <p className="text-[#eab308]/60 text-[9px] font-black uppercase tracking-[0.2em] ml-1">Variáveis de Entrada</p>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {(['raio_corda', 'arco_raio', 'corda_flecha'] as InputMode[]).map(m => (
                  <button 
                    key={m} 
                    onClick={() => setMode(m)} 
                    className={`whitespace-nowrap px-5 py-3 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest ${mode === m ? 'bg-[#eab308] text-black border-[#eab308] shadow-lg shadow-[#eab308]/10' : 'bg-[#221e1b] text-gray-500 border-white/5'}`}
                  >
                    {m.replace('_', ' & ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs de Dados */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">
                  {mode === 'raio_corda' ? 'Raio (R)' : mode === 'arco_raio' ? 'Arco (l)' : 'Corda (c)'}
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={val1} 
                    onChange={e => setVal1(e.target.value)} 
                    className="w-full bg-[#1c1e22] border border-white/10 rounded-2xl h-16 px-5 font-mono text-xl text-white outline-none focus:border-[#eab308]/40 transition-all shadow-inner" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-700">MM</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">
                  {mode === 'raio_corda' ? 'Corda (c)' : mode === 'arco_raio' ? 'Raio (R)' : 'Flecha (f)'}
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={val2} 
                    onChange={e => setVal2(e.target.value)} 
                    className="w-full bg-[#1c1e22] border border-white/10 rounded-2xl h-16 px-5 font-mono text-xl text-white outline-none focus:border-[#eab308]/40 transition-all shadow-inner" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-700">MM</span>
                </div>
              </div>
            </div>

            {/* Resultados em Cards Industriais */}
            <div className="space-y-4">
               <div className="bg-[#221e1b] rounded-[32px] p-6 border-l-4 border-[#eab308] shadow-2xl group transition-all hover:bg-[#252930]">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Flecha Calculada (f)</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white tabular-nums tracking-tighter">{results ? results.f.toFixed(3) : '--'}</span>
                    <span className="text-xl font-black text-gray-700 italic">mm</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#221e1b] p-5 rounded-3xl border border-white/5 shadow-xl">
                     <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">Comprimento do Arco</p>
                     <p className="text-xl font-black text-[#eab308] mt-1 tabular-nums">{results ? results.l.toFixed(2) : '--'} mm</p>
                  </div>
                  <div className="bg-[#221e1b] p-5 rounded-3xl border border-white/5 shadow-xl">
                     <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">Raio Calculado</p>
                     <p className="text-xl font-black text-white mt-1 tabular-nums">{results ? results.r.toFixed(2) : '--'} mm</p>
                  </div>
               </div>
            </div>
          </>
        ) : (
          /* Tabela Técnica Refinada */
          <div className="bg-[#1c1e22] rounded-[32px] border border-white/5 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="p-5 border-b border-white/5 bg-[#252930]/50 flex justify-between items-center">
                <h4 className="text-[#eab308] font-black text-[10px] uppercase tracking-[0.2em]">Referência Técnica (R=100)</h4>
                <span className="material-symbols-outlined text-[#eab308] text-xl opacity-30">table_chart</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-[#121214]/80 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                         <th className="p-5 border-b border-white/5">Ângulo α</th>
                         <th className="p-5 text-center border-b border-white/5">Corda (c)</th>
                         <th className="p-5 text-right border-b border-white/5">Flecha (f)</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {[15, 30, 45, 60, 90, 120, 180].map(ang => {
                        const r = 100;
                        const rad = (ang * Math.PI) / 180;
                        const c = 2 * r * Math.sin(rad / 2);
                        const f = r * (1 - Math.cos(rad / 2));
                        return (
                          <tr key={ang} className="hover:bg-white/5 transition-colors group">
                            <td className="p-5 text-white font-black text-sm">{ang}°</td>
                            <td className="p-5 text-center text-gray-500 font-mono text-xs">{c.toFixed(3)}</td>
                            <td className="p-5 text-right text-[#eab308] font-black font-mono text-xs">{f.toFixed(3)}</td>
                          </tr>
                        );
                      })}
                   </tbody>
                </table>
             </div>
             <div className="p-4 bg-[#121214]/40 text-center">
                <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Valores proporcionais ao raio selecionado</p>
             </div>
          </div>
        )}
      </div>

      {/* Action Bar Flutuante */}
      <div className="absolute bottom-6 left-6 right-6 flex gap-3 z-40 bg-[#161412]/90 backdrop-blur-xl p-2.5 rounded-[28px] border border-white/5 shadow-2xl">
         <button onClick={shareWhatsApp} className="size-14 bg-green-500/10 text-green-500 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all shrink-0">
            <span className="material-symbols-outlined text-2xl">chat</span>
         </button>
         <button onClick={handleSave} className="flex-1 bg-[#eab308] text-black font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all uppercase text-xs tracking-widest">
            <span className="material-symbols-outlined text-xl font-black">save</span> 
            Salvar Resultado
         </button>
      </div>
    </div>
  );
};

export default ArcCalc;
