
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
  const [activeTab, setActiveTab] = useState<'Fresamento' | 'Torneamento' | 'Furação'>('Fresamento');
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
        setZ(activeTab === 'Fresamento' ? 4 : 1);
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
           Salvo!
        </div>
      )}

      <div className="flex-1 p-4 space-y-3 overflow-hidden">
        <div className="grid grid-cols-2 gap-2">
          <select value={material} onChange={(e) => setMaterial(e.target.value)} className="bg-[#1c1e22] border border-white/5 rounded-xl h-10 px-2 text-[10px] text-[#eab308] font-black outline-none appearance-none">
            {Object.keys(PARAM_MATRIX).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={toolType} onChange={(e) => setToolType(e.target.value as any)} className="bg-[#1c1e22] border border-white/5 rounded-xl h-10 px-2 text-[10px] text-[#eab308] font-black outline-none appearance-none">
            <option value="HSS">HSS</option>
            <option value="HM">HM</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-1 bg-[#1c1e22] p-2 rounded-xl border border-white/5">
            <label className="text-gray-500 text-[8px] font-black uppercase tracking-widest ml-1">{t.diameter} ({t.unit})</label>
            <div className="flex items-center">
              <input type="number" value={dia} onChange={(e) => setDia(e.target.value)} className="w-full bg-transparent text-white font-mono text-xl outline-none" />
              <span className="text-[8px] font-black text-[#eab308]">{displayDia}</span>
            </div>
          </div>
          <div className="col-span-1 bg-[#1c1e22] p-2 rounded-xl border border-white/5">
            <label className="text-gray-500 text-[8px] font-black uppercase tracking-widest ml-1">{t.speed} ({t.vc_unit})</label>
            <div className="flex items-center">
              <input type="number" value={vc} onChange={(e) => setVc(e.target.value)} className="w-full bg-transparent text-white font-mono text-xl outline-none" />
              <span className="text-[8px] font-black text-[#eab308]">{displayVc}</span>
            </div>
          </div>
          <div className="col-span-1 bg-[#1c1e22] p-2 rounded-xl border border-white/5">
            <label className="text-gray-500 text-[8px] font-black uppercase tracking-widest ml-1">{t.feed} ({t.feed_unit})</label>
            <div className="flex items-center">
              <input type="number" step="0.01" value={fz} onChange={(e) => setFz(e.target.value)} className="w-full bg-transparent text-white font-mono text-xl outline-none" />
              <span className="text-[8px] font-black text-[#eab308]">{displayFz}</span>
            </div>
          </div>
          <div className="col-span-1 bg-[#1c1e22] p-2 rounded-xl border border-white/5">
            <label className="text-gray-500 text-[8px] font-black uppercase tracking-widest ml-1">{t.teeth} (z)</label>
            <div className="flex items-center justify-between">
              <button onClick={() => setZ(Math.max(1, z - 1))} className="text-[#eab308]"><span className="material-symbols-outlined text-sm">remove</span></button>
              <span className="font-mono text-xl text-white">{z}</span>
              <button onClick={() => setZ(z + 1)} className="text-[#eab308]"><span className="material-symbols-outlined text-sm">add</span></button>
            </div>
          </div>
        </div>

        <button onClick={handleCalculate} className="w-full bg-[#eab308] text-black font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 uppercase text-xs active:scale-95 transition-all">
          <span className="material-symbols-outlined font-black text-base">calculate</span> {t.calculate}
        </button>

        <div className="grid grid-cols-2 gap-2">
           <div className="bg-gradient-to-br from-[#1c1e22] to-black border-l-2 border-[#eab308] rounded-xl p-3 shadow-md">
              <p className="text-gray-500 text-[7px] font-black uppercase tracking-widest">{t.rotation} (n)</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white tabular-nums">{results.rpm}</span>
                <span className="text-[8px] font-black text-[#eab308]">RPM</span>
              </div>
           </div>
           <div className="bg-gradient-to-br from-[#1c1e22] to-black border-l-2 border-[#eab308] rounded-xl p-3 shadow-md">
              <p className="text-gray-500 text-[7px] font-black uppercase tracking-widest">{t.feed} (Vf)</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white tabular-nums">{(results.vf * t.unit_mult).toFixed(t.unit_precision === 4 ? 2 : 0)}</span>
                <span className="text-[8px] font-black text-[#eab308]">{t.unit}/min</span>
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
