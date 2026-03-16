
import React, { useState } from 'react';
import { ThreadData } from '../types';

const THREADS_METRIC: ThreadData[] = [
  { nominal: 'M1.6', pitch: '0.35', drill: '1.25', extDia: '1.60', type: 'métrica' },
  { nominal: 'M2', pitch: '0.40', drill: '1.60', extDia: '2.00', type: 'métrica' },
  { nominal: 'M2.5', pitch: '0.45', drill: '2.05', extDia: '2.50', type: 'métrica' },
  { nominal: 'M3', pitch: '0.50', drill: '2.50', extDia: '3.00', type: 'métrica' },
  { nominal: 'M4', pitch: '0.70', drill: '3.30', extDia: '4.00', type: 'métrica' },
  { nominal: 'M5', pitch: '0.80', drill: '4.20', extDia: '5.00', type: 'métrica' },
  { nominal: 'M6', pitch: '1.00', drill: '5.00', extDia: '6.00', type: 'métrica' },
  { nominal: 'M8', pitch: '1.25', drill: '6.80', extDia: '8.00', type: 'métrica' },
  { nominal: 'M10', pitch: '1.50', drill: '8.50', extDia: '10.00', type: 'métrica' },
  { nominal: 'M12', pitch: '1.75', drill: '10.20', extDia: '12.00', type: 'métrica' },
  { nominal: 'M14', pitch: '2.00', drill: '12.00', extDia: '14.00', type: 'métrica' },
  { nominal: 'M16', pitch: '2.00', drill: '14.00', extDia: '16.00', type: 'métrica' },
  { nominal: 'M20', pitch: '2.50', drill: '17.50', extDia: '20.00', type: 'métrica' },
  { nominal: 'M24', pitch: '3.00', drill: '21.00', extDia: '24.00', type: 'métrica' },
  { nominal: 'M27', pitch: '3.00', drill: '24.00', extDia: '27.00', type: 'métrica' },
  { nominal: 'M30', pitch: '3.50', drill: '26.50', extDia: '30.00', type: 'métrica' },
  { nominal: 'M33', pitch: '3.50', drill: '29.50', extDia: '33.00', type: 'métrica' },
  { nominal: 'M36', pitch: '4.00', drill: '32.00', extDia: '36.00', type: 'métrica' },
  { nominal: 'M39', pitch: '4.00', drill: '35.00', extDia: '39.00', type: 'métrica' },
  { nominal: 'M42', pitch: '4.50', drill: '37.50', extDia: '42.00', type: 'métrica' },
  { nominal: 'M45', pitch: '4.50', drill: '40.50', extDia: '45.00', type: 'métrica' },
  { nominal: 'M48', pitch: '5.00', drill: '43.00', extDia: '48.00', type: 'métrica' },
  { nominal: 'M52', pitch: '5.00', drill: '47.00', extDia: '52.00', type: 'métrica' },
  { nominal: 'M56', pitch: '5.50', drill: '50.50', extDia: '56.00', type: 'métrica' },
  { nominal: 'M60', pitch: '5.50', drill: '54.50', extDia: '60.00', type: 'métrica' },
  { nominal: 'M64', pitch: '6.00', drill: '58.00', extDia: '64.00', type: 'métrica' },
];

const THREADS_WHITWORTH: ThreadData[] = [
  { nominal: '1/8"', tpi: '40', pitch: '0.635', drill: '2.55', extDia: '3.175', type: 'whitworth' },
  { nominal: '5/32"', tpi: '32', pitch: '0.794', drill: '3.20', extDia: '3.969', type: 'whitworth' },
  { nominal: '3/16"', tpi: '24', pitch: '1.058', drill: '3.70', extDia: '4.763', type: 'whitworth' },
  { nominal: '1/4"', tpi: '20', pitch: '1.270', drill: '5.10', extDia: '6.350', type: 'whitworth' },
  { nominal: '5/16"', tpi: '18', pitch: '1.411', drill: '6.50', extDia: '7.938', type: 'whitworth' },
  { nominal: '3/8"', tpi: '16', pitch: '1.588', drill: '7.90', extDia: '9.525', type: 'whitworth' },
  { nominal: '7/16"', tpi: '14', pitch: '1.814', drill: '9.30', extDia: '11.113', type: 'whitworth' },
  { nominal: '1/2"', tpi: '12', pitch: '2.117', drill: '10.50', extDia: '12.700', type: 'whitworth' },
  { nominal: '5/8"', tpi: '11', pitch: '2.309', drill: '13.50', extDia: '15.875', type: 'whitworth' },
  { nominal: '3/4"', tpi: '10', pitch: '2.540', drill: '16.50', extDia: '19.050', type: 'whitworth' },
  { nominal: '7/8"', tpi: '9', pitch: '2.822', drill: '19.25', extDia: '22.225', type: 'whitworth' },
  { nominal: '1"', tpi: '8', pitch: '3.175', drill: '22.00', extDia: '25.400', type: 'whitworth' },
  { nominal: '1.1/8"', tpi: '7', pitch: '3.628', drill: '24.75', extDia: '28.575', type: 'whitworth' },
  { nominal: '1.1/4"', tpi: '7', pitch: '3.628', drill: '27.75', extDia: '31.750', type: 'whitworth' },
  { nominal: '1.3/8"', tpi: '6', pitch: '4.233', drill: '30.50', extDia: '34.925', type: 'whitworth' },
  { nominal: '1.1/2"', tpi: '6', pitch: '4.233', drill: '33.50', extDia: '38.100', type: 'whitworth' },
  { nominal: '1.5/8"', tpi: '5', pitch: '5.080', drill: '35.50', extDia: '41.275', type: 'whitworth' },
  { nominal: '1.3/4"', tpi: '5', pitch: '5.080', drill: '39.00', extDia: '44.450', type: 'whitworth' },
  { nominal: '1.7/8"', tpi: '4.5', pitch: '5.644', drill: '41.50', extDia: '47.625', type: 'whitworth' },
  { nominal: '2"', tpi: '4.5', pitch: '5.644', drill: '44.50', extDia: '50.800', type: 'whitworth' },
];

const THREADS_UNF: ThreadData[] = [
  { nominal: 'Nº 10', tpi: '32', pitch: '0.794', drill: '4.10', extDia: '4.826', type: 'unf' },
  { nominal: '1/4"', tpi: '28', pitch: '0.907', drill: '5.50', extDia: '6.350', type: 'unf' },
  { nominal: '5/16"', tpi: '24', pitch: '1.058', drill: '6.90', extDia: '7.938', type: 'unf' },
  { nominal: '3/8"', tpi: '24', pitch: '1.058', drill: '8.50', extDia: '9.525', type: 'unf' },
  { nominal: '7/16"', tpi: '20', pitch: '1.270', drill: '9.90', extDia: '11.113', type: 'unf' },
  { nominal: '1/2"', tpi: '20', pitch: '1.270', drill: '11.50', extDia: '12.700', type: 'unf' },
  { nominal: '9/16"', tpi: '18', pitch: '1.411', drill: '12.90', extDia: '14.288', type: 'unf' },
  { nominal: '5/8"', tpi: '18', pitch: '1.411', drill: '14.50', extDia: '15.875', type: 'unf' },
  { nominal: '3/4"', tpi: '16', pitch: '1.588', drill: '17.50', extDia: '19.050', type: 'unf' },
  { nominal: '7/8"', tpi: '14', pitch: '1.814', drill: '20.50', extDia: '22.225', type: 'unf' },
  { nominal: '1"', tpi: '12', pitch: '2.117', drill: '23.25', extDia: '25.400', type: 'unf' },
  { nominal: '1.1/8"', tpi: '12', pitch: '2.117', drill: '26.50', extDia: '28.575', type: 'unf' },
  { nominal: '1.1/4"', tpi: '12', pitch: '2.117', drill: '29.50', extDia: '31.750', type: 'unf' },
  { nominal: '1.3/8"', tpi: '12', pitch: '2.117', drill: '32.75', extDia: '34.925', type: 'unf' },
  { nominal: '1.1/2"', tpi: '12', pitch: '2.117', drill: '36.00', extDia: '38.100', type: 'unf' },
];

const THREADS_NPT: ThreadData[] = [
  { nominal: '1/16"', tpi: '27', pitch: '0.941', drill: '6.20', extDia: '7.950', type: 'npt' },
  { nominal: '1/8"', tpi: '27', pitch: '0.941', drill: '8.50', extDia: '10.28', type: 'npt' },
  { nominal: '1/4"', tpi: '18', pitch: '1.411', drill: '11.10', extDia: '13.71', type: 'npt' },
  { nominal: '3/8"', tpi: '18', pitch: '1.411', drill: '14.50', extDia: '17.14', type: 'npt' },
  { nominal: '1/2"', tpi: '14', pitch: '1.814', drill: '17.80', extDia: '21.33', type: 'npt' },
  { nominal: '3/4"', tpi: '14', pitch: '1.814', drill: '23.00', extDia: '26.67', type: 'npt' },
  { nominal: '1"', tpi: '11.5', pitch: '2.209', drill: '29.00', extDia: '33.40', type: 'npt' },
  { nominal: '1.1/4"', tpi: '11.5', pitch: '2.209', drill: '38.10', extDia: '42.16', type: 'npt' },
  { nominal: '1.1/2"', tpi: '11.5', pitch: '2.209', drill: '44.00', extDia: '48.26', type: 'npt' },
  { nominal: '2"', tpi: '11.5', pitch: '2.209', drill: '56.00', extDia: '60.33', type: 'npt' },
  { nominal: '2.1/2"', tpi: '8', pitch: '3.175', drill: '67.00', extDia: '73.03', type: 'npt' },
  { nominal: '3"', tpi: '8', pitch: '3.175', drill: '83.00', extDia: '88.90', type: 'npt' },
  { nominal: '4"', tpi: '8', pitch: '3.175', drill: '108.00', extDia: '114.30', type: 'npt' },
];

interface ThreadTablesProps {
  t: any;
}

const ThreadTables: React.FC<ThreadTablesProps> = ({ t: trans }) => {
  const [tab, setTab] = useState<'métrica' | 'whitworth' | 'unf' | 'npt'>('métrica');
  const [search, setSearch] = useState('');

  const currentData = {
    'métrica': THREADS_METRIC,
    'whitworth': THREADS_WHITWORTH,
    'unf': THREADS_UNF,
    'npt': THREADS_NPT
  }[tab];

  const filteredData = currentData.filter(item => 
    item.nominal.toLowerCase().includes(search.toLowerCase())
  );

  const getNormInfo = () => {
    switch (tab) {
      case 'métrica': return { label: 'ISO DIN 13', angle: '60°', color: 'bg-blue-500/20 text-blue-400', desc: trans.metric_desc || 'Rosca métrica triangular comum.' };
      case 'whitworth': return { label: 'BSW (BS 84)', angle: '55°', color: 'bg-red-500/20 text-red-400', desc: trans.whitworth_desc || 'Rosca grossa padrão britânico.' };
      case 'unf': return { label: 'ANSI B1.1', angle: '60°', color: 'bg-emerald-500/20 text-emerald-400', desc: trans.unf_desc || 'Rosca unificada americana fina (Fina).' };
      case 'npt': return { label: 'ANSI B1.20.1', angle: '60°', color: 'bg-orange-500/20 text-orange-400', desc: trans.npt_desc || 'Rosca cônica para vedação.' };
    }
  };

  const info = getNormInfo();

  return (
    <div className="flex flex-col h-full bg-[#1c1e22]">
      <div className="p-4 space-y-4">
        {/* Seletor de Normas */}
        <div className="flex bg-[#121214] rounded-xl p-1 border border-white/5 overflow-x-auto no-scrollbar gap-1">
          {['métrica', 'whitworth', 'unf', 'npt'].map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => { setTab(tabKey as any); setSearch(''); }}
              className={`flex-1 min-w-[80px] py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${
                tab === tabKey ? 'bg-[#eab308] text-[#121214] shadow-lg shadow-[#eab308]/20' : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              {tabKey === 'npt' ? 'NPT' : tabKey === 'unf' ? 'UNF' : tabKey === 'métrica' ? trans.metric : tabKey}
            </button>
          ))}
        </div>

        {/* Busca */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">search</span>
          <input 
            type="text" 
            placeholder={`${trans.search}...`} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121214] border border-white/5 rounded-2xl h-14 pl-12 pr-4 text-sm text-white focus:ring-1 focus:ring-[#eab308] outline-none shadow-inner" 
          />
        </div>

        {/* Card de Informação Técnica */}
        <div className="bg-[#252930] rounded-3xl border border-white/5 p-5 shadow-2xl relative overflow-hidden flex gap-5 animate-in fade-in duration-500">
           <div className="flex-1 space-y-2 z-10">
              <div className="flex items-center gap-2">
                 <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-white/5 ${info.color}`}>
                    {info.label}
                 </span>
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{trans.angle}: {info.angle}</span>
              </div>
              <h3 className="text-white text-lg font-black uppercase tracking-tight capitalize">{trans.thread} {tab === 'métrica' ? trans.metric : tab}</h3>
              <p className="text-gray-500 text-[10px] font-bold leading-tight">{info.desc}</p>
           </div>
           <div className="size-20 bg-[#121214] rounded-2xl border border-white/5 flex items-center justify-center shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-4xl text-gray-700">bolt</span>
           </div>
        </div>
      </div>

      {/* Tabela de Parâmetros */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#121214]/30">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#121214]/80 backdrop-blur-md sticky top-0 z-10">
            <tr className="text-[9px] font-black text-gray-600 uppercase tracking-widest border-b border-white/5">
              <th className="p-4">{trans.size}</th>
              {tab !== 'métrica' && <th className="p-4 text-center">{trans.tpi}</th>}
              <th className="p-4 text-center">{trans.pitch} ({trans.unit})</th>
              <th className="p-4 text-center text-[#eab308]">{trans.drill} ({trans.unit})</th>
              <th className="p-4 text-right">Ø {trans.external} ({trans.unit})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredData.length > 0 ? (
              filteredData.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <span className="text-white font-black text-sm group-hover:text-[#eab308] transition-colors">{row.nominal}</span>
                  </td>
                  {tab !== 'métrica' && (
                    <td className="p-4 text-center text-gray-400 font-mono text-xs">{row.tpi}</td>
                  )}
                  <td className="p-4 text-center text-gray-500 font-mono text-xs">{row.pitch}</td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center justify-center h-8 px-2 min-w-[32px] rounded-lg bg-[#eab308]/5 border border-[#eab308]/20 text-[#eab308] font-black text-sm">
                       {row.drill}
                    </div>
                  </td>
                  <td className="p-4 text-right text-gray-500 font-mono text-xs">{row.extDia}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                   <span className="material-symbols-outlined text-gray-800 text-5xl">inventory_2</span>
                   <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest mt-4">{trans.not_found}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Informativo */}
      <div className="p-4 bg-[#121214] border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{trans.verified_data}</span>
         </div>
         <button className="text-[9px] font-black text-[#eab308] uppercase tracking-[0.2em] border border-[#eab308]/20 px-4 py-2 rounded-full hover:bg-[#eab308] hover:text-black transition-all">
            {trans.thread_formulas}
         </button>
      </div>
    </div>
  );
};

export default ThreadTables;
