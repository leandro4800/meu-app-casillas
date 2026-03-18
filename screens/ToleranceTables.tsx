
import React, { useState, useMemo } from 'react';

// ISO 286-2 Simplified Tables (Values in micrometers)
const ISO_HOLES: Record<string, { ranges: number[], values: number[] }> = {
  'H7': { ranges: [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500], values: [0, 10, 12, 15, 18, 21, 25, 30, 35, 40, 46, 52, 57, 63] },
  'H8': { ranges: [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500], values: [0, 14, 18, 22, 27, 33, 39, 46, 54, 63, 72, 81, 89, 97] },
  'JS9': { ranges: [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500], values: [0, 12.5, 15, 18, 21, 26, 31, 37, 43, 50, 57, 65, 70, 77] }, // +/- values
};

const ISO_SHAFTS: Record<string, { ranges: number[], values: number[], offset?: number[] }> = {
  'h6': { ranges: [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500], values: [0, 6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40] },
  'g6': { ranges: [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500], values: [0, 6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40], offset: [0, 2, 4, 5, 6, 7, 9, 10, 12, 14, 15, 17, 18, 20] },
  'k6': { ranges: [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500], values: [0, 6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40], offset: [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5] }, // positive offset
};

// DIN 6885 Keyway Tolerances (Simplified)
const KEYWAY_TABLE = [
  { from: 0, to: 6, width: 2, depth: 1.2, tol: 0.1 },
  { from: 6, to: 8, width: 3, depth: 1.8, tol: 0.1 },
  { from: 8, to: 10, width: 4, depth: 2.5, tol: 0.1 },
  { from: 10, to: 12, width: 5, depth: 3.0, tol: 0.1 },
  { from: 12, to: 17, width: 6, depth: 3.5, tol: 0.1 },
  { from: 17, to: 22, width: 8, depth: 4.0, tol: 0.2 },
  { from: 22, to: 30, width: 10, depth: 5.0, tol: 0.2 },
  { from: 30, to: 38, width: 12, depth: 5.0, tol: 0.2 },
  { from: 38, to: 44, width: 14, depth: 5.5, tol: 0.2 },
  { from: 44, to: 50, width: 16, depth: 6.0, tol: 0.2 },
  { from: 50, to: 58, width: 18, depth: 7.0, tol: 0.2 },
];

interface ToleranceTablesProps {
  t: any;
}

const ToleranceTables: React.FC<ToleranceTablesProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<'shafts' | 'holes' | 'keys'>('shafts');
  const [dimension, setDimension] = useState('45');
  const [isoClass, setIsoClass] = useState('h6');
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTables, setShowTables] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const results = useMemo(() => {
    const nominal = parseFloat(dimension);
    if (isNaN(nominal) || nominal <= 0) return null;

    if (activeTab === 'keys') {
      const key = KEYWAY_TABLE.find(k => nominal > k.from && nominal <= k.to);
      if (!key) return null;
      return {
        nominal,
        label: `Chaveta DIN 6885`,
        width: key.width,
        depth: key.depth,
        tol: key.tol,
        max: key.depth + key.tol,
        min: key.depth,
        upperDev: key.tol,
        lowerDev: 0
      };
    }

    const table = activeTab === 'holes' ? ISO_HOLES : ISO_SHAFTS;
    const config = table[isoClass];
    if (!config) return null;

    let itValue = 0;
    let offset = 0;
    for (let i = 0; i < config.ranges.length - 1; i++) {
      if (nominal > config.ranges[i] && nominal <= config.ranges[i + 1]) {
        itValue = config.values[i + 1];
        if ('offset' in config && config.offset) offset = config.offset[i + 1];
        break;
      }
    }

    const itMm = itValue / 1000;
    const offsetMm = offset / 1000;

    if (activeTab === 'holes') {
      if (isoClass === 'JS9') {
        return {
          nominal,
          max: nominal + (itMm / 2),
          min: nominal - (itMm / 2),
          upperDev: itMm / 2,
          lowerDev: -itMm / 2
        };
      }
      return {
        nominal,
        max: nominal + itMm,
        min: nominal,
        upperDev: itMm,
        lowerDev: 0
      };
    } else {
      // Shafts
      if (isoClass === 'g6') {
        return {
          nominal,
          max: nominal - offsetMm,
          min: nominal - offsetMm - itMm,
          upperDev: -offsetMm,
          lowerDev: -(offsetMm + itMm)
        };
      }
      if (isoClass === 'k6') {
        return {
          nominal,
          max: nominal + offsetMm + itMm,
          min: nominal + offsetMm,
          upperDev: offsetMm + itMm,
          lowerDev: offsetMm
        };
      }
      return {
        nominal,
        max: nominal,
        min: nominal - itMm,
        upperDev: 0,
        lowerDev: -itMm
      };
    }
  }, [dimension, isoClass, activeTab]);

  const handleCalculate = () => {
    if (results) {
      setHistory(prev => [{ ...results, id: Date.now(), date: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0908] relative">
      <div className="p-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar pb-24">
        <div className="flex bg-[#1c1e22] rounded-2xl p-1 border border-white/5">
          {[
            { id: 'shafts', label: t.shafts || 'Eixos' },
            { id: 'holes', label: t.diameters || 'Furos' },
            { id: 'keys', label: t.keys || 'Chavetas' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'holes') setIsoClass('H7');
                else if (tab.id === 'shafts') setIsoClass('h6');
              }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-[#eab308] text-black shadow-lg' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-[#1c1e22] rounded-[32px] p-6 border border-white/5 space-y-6 shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.dimension} (mm)</label>
              <input 
                type="number" 
                value={dimension} 
                onChange={(e) => setDimension(e.target.value)}
                className="w-full bg-[#252930] rounded-2xl h-14 px-4 text-white font-mono font-black text-lg outline-none border border-white/5 focus:border-[#eab308]/50 transition-all" 
              />
            </div>
            {activeTab !== 'keys' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.class}</label>
                <select 
                  value={isoClass} 
                  onChange={(e) => setIsoClass(e.target.value)}
                  className="w-full bg-[#252930] rounded-2xl h-14 px-4 text-[#eab308] font-black text-lg outline-none border border-white/5"
                >
                  {activeTab === 'holes' ? (
                    <>
                      <option value="H7">H7</option>
                      <option value="H8">H8</option>
                      <option value="JS9">JS9</option>
                    </>
                  ) : (
                    <>
                      <option value="h6">h6</option>
                      <option value="g6">g6</option>
                      <option value="k6">k6</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>

          <button 
            onClick={handleCalculate}
            className="w-full bg-[#eab308] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-[#eab308]/10 uppercase tracking-widest text-xs"
          >
            <span className="material-symbols-outlined">calculate</span>
            {t.calculate_tolerance || 'Calcular Tolerância'}
          </button>
        </div>

        {results && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-white font-black text-base uppercase tracking-tight">{t.results}</h3>
              <span className="text-[10px] font-black bg-white/5 text-gray-500 px-3 py-1 rounded-full border border-white/10 uppercase">
                {activeTab === 'keys' ? 'DIN 6885' : 'ISO 286-2'}
              </span>
            </div>

            <div className="bg-gradient-to-br from-[#1c1e22] to-[#121214] rounded-[40px] p-8 border border-[#eab308]/20 shadow-2xl relative overflow-hidden">
               <div className="absolute top-6 right-6 bg-[#eab308]/10 text-[#eab308] text-[10px] font-black px-4 py-1.5 rounded-full border border-[#eab308]/20 uppercase tracking-widest">
                 {activeTab === 'keys' ? 'Chaveta' : activeTab === 'holes' ? 'Furo' : 'Eixo'}
               </div>
               
               <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black text-white tracking-tighter">{results.nominal}</span>
                  <span className="text-3xl font-black text-[#eab308] italic uppercase">{activeTab === 'keys' ? '' : isoClass}</span>
               </div>

               <div className="w-full h-px bg-white/5 my-8"></div>

               {activeTab === 'keys' ? (
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Largura (mm)</p>
                      <p className="text-3xl font-black text-white tabular-nums">{results.width.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Profundidade (mm)</p>
                      <p className="text-3xl font-black text-white tabular-nums">{results.depth.toFixed(2)}</p>
                      <p className="text-[11px] font-bold text-green-500">+ {results.tol.toFixed(2)}</p>
                    </div>
                 </div>
               ) : (
                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{t.maximum} (mm)</p>
                      <p className="text-3xl font-black text-white tabular-nums">{results.max.toFixed(3)}</p>
                      <p className="text-[11px] font-bold text-green-500">{results.upperDev >= 0 ? '+' : ''}{results.upperDev.toFixed(3)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{t.minimum} (mm)</p>
                      <p className="text-3xl font-black text-white tabular-nums">{results.min.toFixed(3)}</p>
                      <p className="text-[11px] font-bold text-red-500">{results.lowerDev >= 0 ? '+' : ''}{results.lowerDev.toFixed(3)}</p>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Historico Modal-like Overlay */}
        {showHistory && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-[#eab308] text-2xl font-black uppercase italic tracking-tighter">Histórico</h3>
                <button onClick={() => setShowHistory(false)} className="size-12 rounded-full bg-white/5 flex items-center justify-center text-white"><span className="material-symbols-outlined">close</span></button>
             </div>
             <div className="space-y-4">
                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-20 font-black uppercase tracking-widest text-xs">Nenhum registro encontrado</p>
                ) : (
                  history.map((h) => (
                    <div key={h.id} className="bg-[#1c1e22] p-5 rounded-3xl border border-white/5 flex justify-between items-center">
                       <div>
                          <p className="text-white font-black text-lg leading-none">{h.nominal} {h.label || isoClass}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase mt-2">{h.date}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-green-500 font-black text-sm">Max: {h.max.toFixed(3)}</p>
                          <p className="text-red-500 font-black text-sm">Min: {h.min.toFixed(3)}</p>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}

        {/* Tabelas Modal-like Overlay */}
        {showTables && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300 overflow-y-auto custom-scrollbar">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-[#eab308] text-2xl font-black uppercase italic tracking-tighter">Tabelas ISO</h3>
                <button onClick={() => setShowTables(false)} className="size-12 rounded-full bg-white/5 flex items-center justify-center text-white"><span className="material-symbols-outlined">close</span></button>
             </div>
             <div className="space-y-8">
                <section>
                   <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4 border-l-4 border-[#eab308] pl-3">Furos (H7)</h4>
                   <div className="bg-[#1c1e22] rounded-2xl overflow-hidden border border-white/5">
                      <div className="grid grid-cols-2 p-4 bg-black/20 text-[10px] font-black text-gray-500 uppercase">
                         <span>Faixa (mm)</span>
                         <span className="text-right">Tolerância (μm)</span>
                      </div>
                      {ISO_HOLES.H7.ranges.slice(0, -1).map((r, i) => (
                        <div key={i} className="grid grid-cols-2 p-4 border-t border-white/5 text-xs font-bold text-gray-300">
                           <span>{r} - {ISO_HOLES.H7.ranges[i+1]}</span>
                           <span className="text-right text-[#eab308]">+ {ISO_HOLES.H7.values[i+1]}</span>
                        </div>
                      ))}
                   </div>
                </section>
             </div>
          </div>
        )}

        {/* Configurações Modal-like Overlay */}
        {showSettings && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-[#eab308] text-2xl font-black uppercase italic tracking-tighter">Configurações</h3>
                <button onClick={() => setShowSettings(false)} className="size-12 rounded-full bg-white/5 flex items-center justify-center text-white"><span className="material-symbols-outlined">close</span></button>
             </div>
             <div className="space-y-6">
                <div className="bg-[#1c1e22] p-6 rounded-3xl border border-white/5 flex justify-between items-center">
                   <div>
                      <p className="text-white font-black uppercase tracking-widest text-xs">Unidade de Medida</p>
                      <p className="text-gray-500 text-[10px] font-bold mt-1">Alternar entre MM e POL</p>
                   </div>
                   <div className="bg-black/40 px-4 py-2 rounded-xl text-[#eab308] font-black text-xs">MM</div>
                </div>
                <div className="bg-[#1c1e22] p-6 rounded-3xl border border-white/5 flex justify-between items-center">
                   <div>
                      <p className="text-white font-black uppercase tracking-widest text-xs">Precisão Decimal</p>
                      <p className="text-gray-500 text-[10px] font-bold mt-1">Casas decimais nos resultados</p>
                   </div>
                   <div className="bg-black/40 px-4 py-2 rounded-xl text-[#eab308] font-black text-xs">3</div>
                </div>
             </div>
          </div>
        )}
      </div>

      <nav className="absolute bottom-0 left-0 right-0 bg-[#121214] border-t border-white/5 p-3 flex justify-around items-center safe-pb z-40">
         <button onClick={() => { setShowHistory(false); setShowTables(false); setShowSettings(false); }} className="flex flex-col items-center gap-1 p-2">
            <span className={`material-symbols-outlined text-2xl ${!showHistory && !showTables && !showSettings ? 'text-[#eab308] filled' : 'text-gray-600'}`}>calculate</span>
            <span className={`text-[8px] font-black uppercase tracking-widest ${!showHistory && !showTables && !showSettings ? 'text-[#eab308]' : 'text-gray-600'}`}>{t.calculate || 'Calcular'}</span>
         </button>
         <button onClick={() => setShowTables(true)} className="flex flex-col items-center gap-1 p-2">
            <span className={`material-symbols-outlined text-2xl ${showTables ? 'text-[#eab308] filled' : 'text-gray-600'}`}>list_alt</span>
            <span className={`text-[8px] font-black uppercase tracking-widest ${showTables ? 'text-[#eab308]' : 'text-gray-600'}`}>{t.tables || 'Tabelas'}</span>
         </button>
         <button onClick={() => setShowHistory(true)} className="flex flex-col items-center gap-1 p-2">
            <span className={`material-symbols-outlined text-2xl ${showHistory ? 'text-[#eab308] filled' : 'text-gray-600'}`}>history</span>
            <span className={`text-[8px] font-black uppercase tracking-widest ${showHistory ? 'text-[#eab308]' : 'text-gray-600'}`}>{t.history || 'Histórico'}</span>
         </button>
         <button onClick={() => setShowSettings(true)} className="flex flex-col items-center gap-1 p-2">
            <span className={`material-symbols-outlined text-2xl ${showSettings ? 'text-[#eab308] filled' : 'text-gray-600'}`}>settings</span>
            <span className={`text-[8px] font-black uppercase tracking-widest ${showSettings ? 'text-[#eab308]' : 'text-gray-600'}`}>{t.settings || 'Configurações'}</span>
         </button>
      </nav>
    </div>
  );
};

export default ToleranceTables;
