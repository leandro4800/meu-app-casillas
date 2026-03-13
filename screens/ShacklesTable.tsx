
import React, { useState, useMemo } from 'react';
import { SHACKLES_DATA, EYEBOLTS_DATA } from '../constants';

type AccessoryType = 'Curva' | 'Reta' | 'Olhal';
type MaterialGrade = 'Aço Liga' | 'Aço Carbono' | 'Inox';

interface ShacklesTableProps {
  t: any;
}

const ShacklesTable: React.FC<ShacklesTableProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<AccessoryType>(t.curved || 'Curva');
  const [material, setMaterial] = useState<MaterialGrade>(t.alloy_steel || 'Aço Liga');
  const [search, setSearch] = useState('');

  const tableData = useMemo(() => {
    if (activeTab === t.eyebolt || activeTab === 'Olhal') {
      return EYEBOLTS_DATA.map(item => {
        let wll = item.wll_carbon;
        if (material === t.alloy_steel || material === 'Aço Liga') wll = item.wll_carbon * 1.5; // Aproximação Alloy vs Carbon
        if (material === t.stainless_steel || material === 'Inox') wll = item.wll_carbon * 0.8;    // Aproximação Inox vs Carbon

        return {
          id: item.size,
          size: item.size,
          wll: wll.toFixed(2) + ' t',
          a: item.d1,
          b: item.d2,
          c: item.h
        };
      });
    } else {
      return SHACKLES_DATA.map(item => {
        let wll = item.wll_alloy;
        if (material === t.carbon_steel || material === 'Aço Carbono') wll = item.wll_alloy * 0.65;
        if (material === t.stainless_steel || material === 'Inox') wll = item.wll_alloy * 0.55;

        return {
          id: item.size,
          size: item.size,
          wll: wll.toFixed(2) + ' t',
          a: item.a,
          b: item.b,
          c: '--'
        };
      });
    }
  }, [activeTab, material]);

  const filtered = tableData.filter(item => 
    item.size.toLowerCase().includes(search.toLowerCase()) || 
    item.wll.toLowerCase().includes(search.toLowerCase())
  );

  const getHeaderInfo = () => {
    if (activeTab === t.eyebolt || activeTab === 'Olhal') {
      return {
        title: t.eyebolt_title || 'Olhal de Suspensão',
        norm: 'DIN 580 / ISO 3266',
        desc: t.eyebolt_desc || 'Para içamento vertical de cargas. Verifique o torque de aperto e a integridade da rosca.',
        icon: 'emergency_home'
      };
    }
    return {
      title: `${t.shackle || 'Manilha'} ${activeTab}`,
      norm: 'G-209 / G-210',
      desc: t.shackle_desc || 'Pino roscado com trava de segurança. Ideal para conexões flexíveis e cabos de aço.',
      icon: 'plumbing'
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex flex-col h-full bg-[#1c1e22]">
      <div className="p-4 space-y-4">
        <h2 className="text-[#eab308] text-center font-black text-lg uppercase tracking-widest">{t.shackles_eyebolts}</h2>

        {/* Tab Selector */}
        <div className="bg-[#121214] rounded-xl p-1 flex gap-1 border border-white/5 shadow-inner">
          {([t.curved || 'Curva', t.straight || 'Reta', t.eyebolt || 'Olhal'] as AccessoryType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#252930] text-[#eab308] shadow-lg' : 'text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
          <input 
            type="text" 
            placeholder={activeTab === t.eyebolt || activeTab === 'Olhal' ? t.search_metric : t.search_imperial}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121214] border border-white/5 rounded-2xl h-14 pl-12 pr-4 text-sm text-white focus:ring-1 focus:ring-[#eab308] outline-none" 
          />
        </div>

        {/* Material Selector */}
        <div className="flex gap-2 p-1 bg-[#121214] rounded-full border border-white/5">
           {([t.alloy_steel || 'Aço Liga', t.carbon_steel || 'Aço Carbono', t.stainless_steel || 'Inox'] as MaterialGrade[]).map(m => (
             <button 
               key={m}
               onClick={() => setMaterial(m)}
               className={`flex-1 py-2 rounded-full text-[9px] font-black uppercase transition-all ${material === m ? 'bg-[#eab308] text-black shadow-md' : 'text-gray-600'}`}
             >
               {m}
             </button>
           ))}
        </div>

        {/* Accessory Card */}
        <div className="bg-[#252930] rounded-3xl p-5 border border-white/5 flex gap-5 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 size-32 bg-[#eab308]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#eab308]/10 transition-colors"></div>
           <div className="size-20 bg-[#121214] rounded-2xl border border-white/5 flex items-center justify-center shrink-0 shadow-inner relative z-10">
              <span className="material-symbols-outlined text-4xl text-[#eab308] opacity-70">{headerInfo.icon}</span>
           </div>
           <div className="flex-1 flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-2 mb-1">
                 <span className="bg-[#eab308]/20 text-[#eab308] text-[8px] font-black px-2 py-0.5 rounded border border-[#eab308]/20 uppercase">{headerInfo.norm}</span>
                 {material === 'Aço Liga' && <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">High Grade</span>}
              </div>
              <h4 className="text-white font-black text-lg leading-tight uppercase tracking-tight">{headerInfo.title}</h4>
              <p className="text-[10px] text-gray-500 font-bold leading-snug mt-1">{headerInfo.desc}</p>
           </div>
        </div>

        <div className="flex justify-between items-center px-1">
           <h3 className="text-[#eab308] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
             <span className="material-symbols-outlined text-sm">assignment</span>
             {t.load_table} ({material})
           </h3>
           <span className="text-gray-700 text-[8px] font-black uppercase tracking-tighter">{t.unit}: {t.tons} (t)</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#121214]/30 px-4">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#1c1e22]/95 backdrop-blur-md z-10">
            <tr className="text-[9px] font-black text-gray-600 uppercase tracking-widest border-b border-white/5">
              <th className="p-4">{activeTab === t.eyebolt || activeTab === 'Olhal' ? t.thread : t.diameter_pol}</th>
              <th className="p-4 text-[#eab308]">{t.load} (WLL)</th>
              <th className="p-4 text-center">{activeTab === t.eyebolt || activeTab === 'Olhal' ? `Ø ${t.internal} (mm)` : 'A (mm)'}</th>
              <th className="p-4 text-center">{activeTab === t.eyebolt || activeTab === 'Olhal' ? `Ø ${t.external} (mm)` : 'B (mm)'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length > 0 ? filtered.map((row) => (
              <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-white font-black text-sm">{row.size}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-[#eab308] font-black text-base tabular-nums">{row.wll}</span>
                    <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{t.working_load}</span>
                  </div>
                </td>
                <td className="p-4 text-center text-gray-500 font-mono text-xs font-bold">{row.a}</td>
                <td className="p-4 text-center text-gray-500 font-mono text-xs font-bold">{row.b}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-700 text-xs font-bold uppercase italic">{t.not_found}</td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="py-8 text-center">
           <button className="text-[#eab308] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto px-4 py-2 border border-[#eab308]/20 rounded-full hover:bg-[#eab308]/10 transition-all">
             {t.show_industrial_measures}
             <span className="material-symbols-outlined text-sm">expand_more</span>
           </button>
        </div>
      </div>

      {/* Alerta Técnico de Segurança */}
      <div className="p-4 bg-[#121214] border-t border-white/5">
         <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 flex gap-4 animate-pulse">
            <span className="material-symbols-outlined text-orange-500 text-2xl">security</span>
            <div className="space-y-1">
               <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{t.safety_protocol} 5:1</p>
               <p className="text-[10px] text-orange-500/80 font-bold leading-tight">
                 {t.safety_desc} {activeTab === t.eyebolt || activeTab === 'Olhal' ? t.eyebolt_safety : t.shackle_safety}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ShacklesTable;
