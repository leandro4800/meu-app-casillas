
import React, { useState } from 'react';

const ConversionFactors: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Comprimento');
  const [val, setVal] = useState('10');

  const tabs = ['Comprimento', 'Força', 'Pressão', 'Torque'];

  return (
    <div className="p-4 space-y-6 flex flex-col h-full bg-[#1c1e22]">
      <div className="space-y-4">
        <h2 className="text-[#eab308] text-2xl font-bold tracking-tight">Fatores de Conversão</h2>
        
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
          <input 
            type="text" 
            placeholder="Buscar unidade (ex: polegada)..." 
            className="w-full bg-[#252930] border border-white/10 rounded-2xl h-14 pl-12 pr-4 text-sm text-white focus:ring-1 focus:ring-[#eab308] outline-none" 
          />
        </div>

        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
           {tabs.map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === tab ? 'bg-[#eab308] text-black' : 'bg-[#252930] text-gray-500 border border-white/5'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-[#252930] rounded-2xl p-6 border border-white/5 space-y-6 shadow-xl">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Converter De</label>
          <div className="flex gap-2">
            <div className="w-1/3 bg-[#121214] border border-white/10 rounded-xl flex flex-col items-center justify-center p-2 relative">
               <input 
                type="number" 
                value={val} 
                onChange={(e) => setVal(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-white font-bold text-xl text-center w-full" 
               />
               <span className="text-[9px] text-gray-600 font-bold uppercase">val</span>
            </div>
            <div className="flex-1 bg-[#121214] border border-white/10 rounded-xl px-4 flex items-center justify-between text-white font-bold text-sm">
               Milímetros (mm)
               <span className="material-symbols-outlined text-sm text-[#eab308]">expand_more</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center -my-3">
           <div className="size-10 rounded-full bg-[#eab308] border-4 border-[#1c1e22] flex items-center justify-center text-black shadow-lg z-10">
              <span className="material-symbols-outlined text-lg font-black">swap_vert</span>
           </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Para</label>
          <div className="bg-[#121214] border border-white/10 rounded-xl h-14 px-4 flex items-center justify-between text-white font-bold text-sm">
             Polegadas (in)
             <span className="material-symbols-outlined text-sm text-[#eab308]">expand_more</span>
          </div>
        </div>

        <div className="bg-[#121214] rounded-2xl p-8 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
           <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Resultado</p>
           <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#eab308] tracking-tight tabular-nums">0.3937</span>
              <span className="text-gray-500 font-bold text-sm italic">in</span>
           </div>
           <div className="mt-4 bg-white/5 rounded-lg px-4 py-1 text-[10px] font-mono text-gray-600">
              Fórmula: x ÷ 25.4
           </div>
        </div>

        <div className="flex justify-between items-center px-2">
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Precisão Decimal:</span>
           <div className="flex gap-1">
              {['.0', '.00', '.0000'].map(p => (
                <button key={p} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${p === '.0000' ? 'bg-[#eab308] text-black' : 'bg-[#121214] text-gray-600 border border-white/5'}`}>
                  {p}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="flex-1 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold text-base">Referências Rápidas</h3>
          <button className="text-[#eab308] text-[10px] font-bold uppercase tracking-widest hover:underline">Ver Tabela Completa</button>
        </div>
        <div className="space-y-1 bg-[#121214] rounded-xl overflow-hidden border border-white/5">
           <div className="grid grid-cols-3 p-3 text-[10px] font-black text-gray-600 uppercase tracking-widest border-b border-white/5">
              <span>Fração (Pol)</span>
              <span>Decimal (Pol)</span>
              <span className="text-right">Milímetros</span>
           </div>
           {[
             { f: '1/64"', d: '0.0156', m: '0.397' },
             { f: '1/32"', d: '0.0312', m: '0.794' },
             { f: '1/16"', d: '0.0625', m: '1.588' },
             { f: '1/8"', d: '0.1250', m: '3.175' },
           ].map((row, i) => (
             <div key={i} className="grid grid-cols-3 p-3 items-center border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
               <span className="text-white font-bold text-sm tracking-tight">{row.f}</span>
               <span className="text-gray-500 font-mono text-xs">{row.d}</span>
               <div className="flex justify-end items-center gap-1">
                 <span className="text-white font-bold text-sm">{row.m}</span>
                 <span className="text-[9px] text-gray-700 font-bold">mm</span>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ConversionFactors;
