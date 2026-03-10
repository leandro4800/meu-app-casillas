
import React from 'react';
import { ToolInsert } from '../types';

interface ToolDetailProps {
  tool: ToolInsert;
  isAdmin: boolean;
  onBack: () => void;
  onCalculate: () => void;
  onEdit: () => void;
}

const ToolDetail: React.FC<ToolDetailProps> = ({ tool, isAdmin, onBack, onCalculate, onEdit }) => {
  const isDrillWithInserts = tool.category === 'Furação' && tool.code.includes('PASTILHA');

  return (
    <div className="flex flex-col h-full bg-[#1c1e22]">
      <div className="sticky top-0 z-10 p-4 flex justify-between items-center bg-[#1c1e22]/95 backdrop-blur-md border-b border-white/5">
         <button onClick={onBack} className="text-[#eab308] p-1">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
         </button>
         <h2 className="text-white font-black text-xs uppercase tracking-[0.2em]">Ficha Técnica Industrial</h2>
         <div className="flex gap-2">
            {isAdmin && (
               <button onClick={onEdit} className="text-[#eab308] p-1">
                  <span className="material-symbols-outlined text-2xl">edit_note</span>
               </button>
            )}
            <button className="text-gray-500 p-1">
               <span className="material-symbols-outlined text-2xl">qr_code_2</span>
            </button>
         </div>
      </div>

      <div className="p-4 space-y-6 pb-20 overflow-y-auto custom-scrollbar">
         <div className="space-y-2">
            <div className="flex gap-2">
               <span className="bg-[#eab308] text-black text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest">HAILTOOLS / SANDVIK</span>
               <span className="bg-white/5 text-gray-500 text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest border border-white/5">OFFICIAL PARTNER</span>
            </div>
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-white text-3xl font-black tracking-tight leading-none italic uppercase">{tool.code}</h3>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-400 font-bold">
                      Grade: <span className="text-[#eab308]">{tool.grade}</span>
                    </p>
                    <p className="text-xs text-gray-500 font-bold">
                      Revestimento: <span className="text-gray-300">{tool.coating}</span>
                    </p>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-5 gap-1 bg-[#121214] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
            <div className="col-span-3 h-64 bg-gradient-to-br from-[#252930] to-transparent p-6 relative flex items-center justify-center">
               <img src={tool.image} className="w-full h-full object-contain drop-shadow-2xl scale-110" alt="" />
               <div className="absolute bottom-4 left-4 flex gap-1">
                  {tool.isoCategories.map(cat => (
                    <span key={cat} className="size-5 rounded bg-black/40 border border-white/10 flex items-center justify-center text-[8px] font-black text-white">{cat}</span>
                  ))}
               </div>
            </div>
            <div className="col-span-2 bg-[#1c1e22]/50 border-l border-white/5 p-5 flex flex-col justify-center space-y-6">
               <div className="space-y-2 text-center">
                  <p className="text-[9px] font-black text-[#eab308] uppercase tracking-widest leading-none">Geometria Base</p>
                  <h4 className="text-white font-black text-sm italic">{tool.geometry}</h4>
                  <div className="w-8 h-0.5 bg-[#eab308]/20 mx-auto"></div>
                  <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{tool.geometryDesc}</p>
               </div>
            </div>
         </div>

         {isDrillWithInserts && (
            <div className="bg-[#eab308]/5 border border-[#eab308]/20 rounded-3xl p-5 space-y-3">
               <h4 className="text-[#eab308] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Nota de Engenharia: CoroDrill 880
               </h4>
               <p className="text-gray-400 text-xs font-bold leading-relaxed">
                  Para performance otimizada, utilize a grade tenaz <span className="text-white">GC4344</span> no centro para resistir a velocidades zero, e a grade <span className="text-white">GC4334</span> na periferia para resistir ao desgaste por abrasão térmica.
               </p>
            </div>
         )}

         <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
               <span className="material-symbols-outlined text-[#eab308] text-xl">tune</span>
               <h3 className="text-white font-black text-[10px] uppercase tracking-widest">Parâmetros de Início (Start Values)</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
               {[
                 { label: 'Vc m/min', val: tool.parameters.vc, range: `${tool.parameters.vcRange[0]}-${tool.parameters.vcRange[1]}` },
                 { label: 'fn mm/r', val: tool.parameters.fn, range: `${tool.parameters.fnRange[0]}-${tool.parameters.fnRange[1]}` },
                 { label: 'ap mm', val: tool.parameters.ap === 0 ? '--' : tool.parameters.ap, range: tool.parameters.ap === 0 ? 'Furação' : `${tool.parameters.apRange[0]}-${tool.parameters.apRange[1]}` }
               ].map(p => (
                 <div key={p.label} className="bg-[#252930] rounded-2xl p-4 border border-white/5 shadow-lg flex flex-col items-center">
                    <p className="text-[8px] font-black text-gray-500 uppercase mb-2 tracking-widest">{p.label}</p>
                    <p className="text-2xl font-black text-white tracking-tighter">{p.val}</p>
                    <div className="mt-2 text-[8px] text-[#eab308] font-black uppercase tracking-tighter bg-[#eab308]/5 px-2 py-0.5 rounded">
                       {p.range}
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="flex gap-3 pt-6">
            <button 
              onClick={onCalculate}
              className="flex-1 bg-[#eab308] text-black font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all uppercase text-[11px] tracking-widest"
            >
               <span className="material-symbols-outlined font-black">calculate</span>
               Calcular RPM / Avanço
            </button>
         </div>
      </div>
    </div>
  );
};

export default ToolDetail;
