
import React, { useState } from 'react';

interface ToleranceTablesProps {
  t: any;
}

const ToleranceTables: React.FC<ToleranceTablesProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState(t.shafts || 'Eixos');
  const [dimension, setDimension] = useState('45');
  const [isoClass, setIsoClass] = useState('h7');

  // Simulated logic for h7 at 45mm
  const nominal = parseFloat(dimension) || 0;
  const upperDev = 0.000;
  const lowerDev = -0.025;
  const max = nominal + upperDev;
  const min = nominal + lowerDev;

  return (
    <div className="flex flex-col h-full bg-[#1c1e22]">
      <div className="p-4 space-y-6">
        <div className="flex bg-[#121214] rounded-xl p-1 border border-white/5">
          {[t.shafts || 'Eixos', t.diameters || 'Diâmetros', t.keys || 'Chavetas'].map((tabName) => (
            <button
              key={tabName}
              onClick={() => setActiveTab(tabName)}
              className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${
                activeTab === tabName ? 'bg-[#eab308] text-[#121214]' : 'text-gray-500'
              }`}
            >
              {tabName}
            </button>
          ))}
        </div>

        <div className="bg-[#252930] rounded-2xl p-5 border border-white/5 space-y-5 shadow-xl">
          <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#eab308] text-base">tune</span>
            {t.input_data}
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.dimension} ({t.unit})</label>
              <div className="bg-[#121214] rounded-xl p-3 border border-white/10 flex items-center justify-between">
                <input 
                  type="number" 
                  value={dimension} 
                  onChange={(e) => setDimension(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-white font-bold text-lg w-full" 
                />
                <span className="text-gray-600 text-[10px] font-bold">{t.unit}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.class}</label>
              <div className="bg-[#121214] rounded-xl p-3 border border-white/10 flex items-center justify-between text-white font-bold text-lg">
                {isoClass}
                <span className="material-symbols-outlined text-[#eab308]">expand_more</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#eab308] text-[#121214] font-black py-4 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-[#eab308]/10">
            <span className="material-symbols-outlined">calculate</span>
            {t.calculate_tolerance}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-white font-black text-base uppercase tracking-tight">{t.results}</h3>
            <span className="text-[10px] font-black bg-white/5 text-gray-500 px-2 py-1 rounded">ISO 286-2</span>
          </div>

          <div className="bg-gradient-to-br from-[#121214] to-black rounded-3xl p-6 border border-[#eab308]/20 shadow-2xl relative overflow-hidden">
             <div className="absolute top-4 right-4 bg-[#eab308]/5 text-[#eab308] text-[10px] font-black px-3 py-1 rounded-full border border-[#eab308]/20 uppercase">{t.standard_shaft}</div>
             
             <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{dimension}</span>
                <span className="text-3xl font-black text-[#eab308]">{isoClass}</span>
             </div>

             <div className="w-full h-px bg-white/5 my-6"></div>

             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{t.maximum} ({t.unit})</p>
                  <p className="text-2xl font-black text-white tabular-nums">{max.toFixed(3)}</p>
                  <p className="text-[11px] font-bold text-green-500">+ {upperDev.toFixed(3)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{t.minimum} ({t.unit})</p>
                  <p className="text-2xl font-black text-white tabular-nums">{min.toFixed(3)}</p>
                  <p className="text-[11px] font-bold text-red-500">{lowerDev.toFixed(3)}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-[#252930] rounded-2xl p-5 border border-white/5 space-y-4">
           <div className="flex justify-between items-center">
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#eab308] text-base">bar_chart</span>
                {t.zone_visualization}
              </h4>
              <button className="text-gray-500 text-[10px] font-bold uppercase hover:text-white transition-colors">{t.details}</button>
           </div>
           
           <div className="relative h-20 flex flex-col justify-center">
              <div className="absolute top-0 left-0 text-[8px] font-bold text-gray-600 uppercase">{t.nominal}</div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-white/10 dashed"></div>
              
              <div className="w-full h-1 bg-white/5 rounded-full relative overflow-visible">
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-3 bg-[#eab308] rounded-r-lg shadow-[0_0_15px_rgba(234,179,8,0.3)]"></div>
                 <div className="absolute top-[-30px] right-[25%] -translate-x-1/2 bg-[#eab308] text-black text-[9px] font-black px-2 py-0.5 rounded before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-[#eab308]">
                   -25 μm
                 </div>
              </div>

              <div className="flex justify-between mt-4 text-[9px] font-black text-gray-700 uppercase">
                 <span>0</span>
                 <span>-25 μm</span>
              </div>
           </div>
        </div>

        <div className="space-y-3 pb-8">
           <h4 className="text-[#eab308] text-[10px] font-black uppercase tracking-widest ml-1">{t.nearby_values} ({isoClass})</h4>
           <div className="bg-[#121214] rounded-2xl border border-white/5 overflow-hidden">
              <div className="grid grid-cols-3 p-4 text-[9px] font-black text-gray-600 uppercase tracking-widest border-b border-white/5">
                 <span>{t.dimension}</span>
                 <span className="text-center">{t.upper_short} ({t.unit})</span>
                 <span className="text-right">{t.lower_short} ({t.unit})</span>
              </div>
              {[
                { r: '30 - 40 mm', s: '0', i: '-25' },
                { r: '40 - 50 mm', s: '0', i: '-25', active: true },
                { r: '50 - 65 mm', s: '0', i: '-30' },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-3 p-4 items-center text-xs font-bold ${row.active ? 'bg-[#eab308]/5 border-y border-[#eab308]/20' : 'text-gray-400'}`}>
                   <span className={row.active ? 'text-white' : ''}>{row.r}</span>
                   <span className="text-center">0</span>
                   <span className={`text-right ${row.active ? 'text-red-500' : ''}`}>{row.i}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <nav className="sticky bottom-0 bg-[#1c1e22] border-t border-white/5 p-2 flex justify-around items-center safe-pb">
         {[t.calculate, t.tables, t.history, t.settings].map((n, idx) => (
           <button key={idx} className="flex flex-col items-center gap-1 p-2">
              <span className={`material-symbols-outlined text-xl ${idx === 0 ? 'text-[#eab308] filled' : 'text-gray-600'}`}>
                {idx === 0 ? 'calculate' : idx === 1 ? 'list_alt' : idx === 2 ? 'history' : 'settings'}
              </span>
              <span className={`text-[8px] font-black uppercase tracking-widest ${idx === 0 ? 'text-[#eab308]' : 'text-gray-600'}`}>{n}</span>
           </button>
         ))}
      </nav>
    </div>
  );
};

export default ToleranceTables;
