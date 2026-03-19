
import React, { useState, useEffect } from 'react';
import { MATERIALS } from '../constants';
import { ToolInsert } from '../types';

interface MachiningParamsProps {
  initialData?: ToolInsert | null;
  onBack: () => void;
  t: any;
}

const PARAM_MATRIX: Record<string, Record<string, [number, number, number]>> = {
  'SAE 1020': { 'Fresamento': [35, 250, 0.12], 'Torneamento': [30, 220, 0.25], 'Furação': [25, 100, 0.15] },
  'SAE 1045': { 'Fresamento': [28, 180, 0.10], 'Torneamento': [25, 160, 0.20], 'Furação': [20, 80, 0.12] },
  'INOX 304': { 'Fresamento': [15, 120, 0.08], 'Torneamento': [12, 100, 0.15], 'Furação': [10, 50, 0.08] },
  'SAE 4340': { 'Fresamento': [20, 140, 0.08], 'Torneamento': [18, 120, 0.18], 'Furação': [15, 60, 0.10] },
  'ALU 6061': { 'Fresamento': [80, 500, 0.15], 'Torneamento': [70, 450, 0.30], 'Furação': [50, 200, 0.20] }
};

const MachiningParams: React.FC<MachiningParamsProps> = ({ initialData, onBack, t }) => {
  const [activeTab, setActiveTab] = useState<'Fresamento' | 'Torneamento' | 'Furação'>(t.milling || 'Fresamento');
  const [material, setMaterial] = useState(MATERIALS[1].name);
  const [toolType, setToolType] = useState<'HSS' | 'HM'>('HM');
  const [dia, setDia] = useState<string>('12');
  const [vc, setVc] = useState<string>('120');
  const [fz, setFz] = useState<string>('0.05');
  const [z, setZ] = useState<number>(4);
  const [results, setResults] = useState({ rpm: 3183, vf: 636 });
  const [showToast, setShowToast] = useState(false);

  // Conversão de exibição
  const displayDia = (parseFloat(dia) * t.unit_mult).toFixed(t.unit_precision === 4 ? 4 : 2);
  const displayVc = (parseFloat(vc) * t.vc_mult).toFixed(0);
  const displayFz = (parseFloat(fz) * t.unit_mult).toFixed(t.unit_precision);

  useEffect(() => {
    if (!initialData) {
      const data = PARAM_MATRIX[material]?.[activeTab];
      if (data) {
        setVc((toolType === 'HSS' ? data[0] : data[1]).toString());
        setFz(data[2].toString());
        setZ(activeTab === (t.milling || 'Fresamento') ? 4 : 1);
      }
    }
  }, [material, toolType, activeTab]);

  const handleCalculate = () => {
    const dVal = parseFloat(dia) || 0;
    const vcVal = parseFloat(vc) || 0;
    const fzVal = parseFloat(fz) || 0;
    const zVal = z || 1;
    if (dVal > 0 && vcVal > 0) {
      const n = Math.round((vcVal * 1000) / (Math.PI * dVal));
      const vfMm = n * fzVal * zVal;
      setResults({ rpm: n, vf: Math.round(vfMm) });
    }
  };

  const formatReport = () => {
    return `*CASILLAS - RELATÓRIO TÉCNICO*\n\n` +
           `🛠 *${t.tools}:* ${activeTab}\n` +
           `📦 *${t.material}:* ${material}\n` +
           `⚙ *Vc:* ${displayVc} ${t.vc_unit}\n` +
           `📍 *fz:* ${displayFz} ${t.feed_unit}\n\n` +
           `*${t.calculate?.toUpperCase()}:*\n` +
           `🔄 *${t.rotation}:* ${results.rpm} RPM\n` +
           `⏩ *${t.feed}:* ${(results.vf * t.unit_mult).toFixed(t.unit_precision === 4 ? 2 : 0)} ${t.unit}/min\n\n` +
           `_Gerado via Casillas Digital_`;
  };

  const shareReport = () => {
    const text = formatReport();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#121214] text-white relative overflow-hidden">
      {showToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] bg-[#eab308] text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-2xl animate-bounce">
           {t.saved}!
        </div>
      )}

      <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-gray-500 text-xs font-black uppercase tracking-widest ml-1">{t.material}</label>
            <select value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full bg-[#1c1e22] border border-white/10 rounded-2xl h-16 px-4 text-base text-[#eab308] font-black outline-none appearance-none">
              {Object.keys(PARAM_MATRIX).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-gray-500 text-xs font-black uppercase tracking-widest ml-1">{t.tool_type}</label>
            <select value={toolType} onChange={(e) => setToolType(e.target.value as any)} className="w-full bg-[#1c1e22] border border-white/10 rounded-2xl h-16 px-4 text-base text-[#eab308] font-black outline-none appearance-none">
              <option value="HSS">HSS ({t.hss_desc})</option>
              <option value="HM">HM ({t.hm_desc})</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#1c1e22] p-4 rounded-2xl border border-white/10">
            <label className="text-gray-500 text-xs font-black uppercase tracking-widest ml-1">{t.diameter} ({t.unit})</label>
            <div className="flex items-center mt-1">
              <input type="number" value={dia} onChange={(e) => setDia(e.target.value)} className="w-full bg-transparent text-white font-mono text-3xl outline-none" />
              <span className="text-sm font-black text-[#eab308] bg-[#eab308]/10 px-3 py-1 rounded-lg">{displayDia}</span>
            </div>
          </div>
          <div className="bg-[#1c1e22] p-4 rounded-2xl border border-white/10">
            <label className="text-gray-500 text-xs font-black uppercase tracking-widest ml-1">{t.speed} ({t.vc_unit})</label>
            <div className="flex items-center mt-1">
              <input type="number" value={vc} onChange={(e) => setVc(e.target.value)} className="w-full bg-transparent text-white font-mono text-3xl outline-none" />
              <span className="text-sm font-black text-[#eab308] bg-[#eab308]/10 px-3 py-1 rounded-lg">{displayVc}</span>
            </div>
          </div>
          <div className="bg-[#1c1e22] p-4 rounded-2xl border border-white/10">
            <label className="text-gray-500 text-xs font-black uppercase tracking-widest ml-1">{t.feed} ({t.feed_unit})</label>
            <div className="flex items-center mt-1">
              <input type="number" step="0.01" value={fz} onChange={(e) => setFz(e.target.value)} className="w-full bg-transparent text-white font-mono text-3xl outline-none" />
              <span className="text-sm font-black text-[#eab308] bg-[#eab308]/10 px-3 py-1 rounded-lg">{displayFz}</span>
            </div>
          </div>
          <div className="bg-[#1c1e22] p-4 rounded-2xl border border-white/10">
            <label className="text-gray-500 text-xs font-black uppercase tracking-widest ml-1">{t.teeth} (z)</label>
            <div className="flex items-center justify-between mt-1">
              <button onClick={() => setZ(Math.max(1, z - 1))} className="size-14 rounded-xl bg-white/5 flex items-center justify-center text-[#eab308]"><span className="material-symbols-outlined text-3xl">remove</span></button>
              <span className="font-mono text-4xl text-white">{z}</span>
              <button onClick={() => setZ(z + 1)} className="size-14 rounded-xl bg-white/5 flex items-center justify-center text-[#eab308]"><span className="material-symbols-outlined text-3xl">add</span></button>
            </div>
          </div>
        </div>

        <button onClick={handleCalculate} className="w-full bg-[#eab308] text-black font-black py-6 rounded-2xl shadow-2xl flex items-center justify-center gap-3 uppercase text-xl active:scale-95 transition-all">
          <span className="material-symbols-outlined font-black text-3xl">calculate</span> {t.calculate}
        </button>

        <div className="grid grid-cols-1 gap-4">
           <div className="bg-gradient-to-br from-[#1c1e22] to-black border-l-4 border-[#eab308] rounded-2xl p-6 shadow-xl">
              <p className="text-gray-500 text-sm font-black uppercase tracking-widest">{t.rotation} (n)</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-5xl font-black text-white tabular-nums">{results.rpm}</span>
                <span className="text-base font-black text-[#eab308]">RPM</span>
              </div>
           </div>
           <div className="bg-gradient-to-br from-[#1c1e22] to-black border-l-4 border-[#eab308] rounded-2xl p-6 shadow-xl">
              <p className="text-gray-500 text-sm font-black uppercase tracking-widest">{t.feed} (Vf)</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-5xl font-black text-white tabular-nums">{(results.vf * t.unit_mult).toFixed(t.unit_precision === 4 ? 2 : 0)}</span>
                <span className="text-base font-black text-[#eab308]">{t.unit}/min</span>
              </div>
           </div>
        </div>
      </div>

      <div className="p-3 bg-[#121214]/90 backdrop-blur-md flex gap-2 border-t border-white/5">
         <button onClick={shareReport} className="size-10 bg-green-500/20 text-green-500 border border-green-500/20 rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base">share</span>
         </button>
         <button onClick={() => {}} className="size-10 bg-white/5 text-gray-500 rounded-xl border border-white/5 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base">mail</span>
         </button>
         <button onClick={() => setShowToast(true)} className="flex-1 bg-[#eab308] text-black font-black py-2 rounded-xl flex items-center justify-center gap-2 active:scale-95 uppercase text-[9px] tracking-widest shadow-lg">
            <span className="material-symbols-outlined text-sm">save</span> {t.save_result}
         </button>
      </div>
    </div>
  );
};

export default MachiningParams;
