
import React, { useState, useMemo } from 'react';

type Shape = 'block' | 'round' | 'tube' | 'hex';
interface Material { name: string; density: number; }

const MATERIALS_LIST: Material[] = [
  { name: 'Aço Carbono', density: 7.85 },
  { name: 'Aço Inox', density: 8.00 },
  { name: 'Alumínio', density: 2.70 },
  { name: 'Latão', density: 8.50 }
];

interface WeightCalcProps {
  t: any;
}

const WeightCalc: React.FC<WeightCalcProps> = ({ t }) => {
  const MATERIALS_LIST: Material[] = [
    { name: t.carbon_steel || 'Aço Carbono', density: 7.85 },
    { name: t.stainless_steel || 'Aço Inox', density: 8.00 },
    { name: t.aluminum || 'Alumínio', density: 2.70 },
    { name: t.brass || 'Latão', density: 8.50 }
  ];

  const [shape, setShape] = useState<Shape>('block');
  const [material, setMaterial] = useState<Material>({ name: t.carbon_steel || 'Aço Carbono', density: 7.85 });
  const [dim1, setDim1] = useState('100');
  const [dim2, setDim2] = useState('50');
  const [dim3, setDim3] = useState('10');

  const calculateWeight = useMemo(() => {
    const d1 = parseFloat(dim1) || 0;
    const d2 = parseFloat(dim2) || 0;
    const d3 = parseFloat(dim3) || 0;
    let volMm3 = 0;
    if (shape === 'block') volMm3 = d1 * d2 * d3;
    else if (shape === 'round') volMm3 = Math.PI * Math.pow(d2 / 2, 2) * d1;
    else if (shape === 'tube') volMm3 = Math.PI * (Math.pow(d2 / 2, 2) - Math.pow(d3 / 2, 2)) * d1;
    else if (shape === 'hex') volMm3 = 0.866025 * Math.pow(d2, 2) * d1;
    return ((volMm3 / 1000) * material.density / 1000).toFixed(3);
  }, [shape, material, dim1, dim2, dim3]);

  return (
    <div className="flex flex-col h-full bg-[#121214] text-white relative">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-32">
        <select onChange={(e) => setMaterial(MATERIALS_LIST.find(m => m.name === e.target.value) || material)} className="w-full bg-[#1c1e22] border border-white/5 rounded-2xl h-16 px-5 text-white">
          {MATERIALS_LIST.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
        </select>
        
        <div className="grid grid-cols-4 gap-2">
           {['block', 'round', 'tube', 'hex'].map(s => (
             <button key={s} onClick={() => setShape(s as Shape)} className={`p-3 rounded-2xl border transition-all ${shape === s ? 'bg-[#eab308] border-[#eab308] text-black' : 'bg-[#1c1e22] border-white/5 text-gray-500'}`}>
                <span className="material-symbols-outlined">{s === 'block' ? 'square' : s === 'round' ? 'circle' : s === 'tube' ? 'radio_button_unchecked' : 'hexagon'}</span>
             </button>
           ))}
        </div>

        <div className="bg-[#1c1e22] p-6 rounded-3xl space-y-4">
          <div className="relative">
            <input type="number" value={dim1} onChange={(e) => setDim1(e.target.value)} className="w-full bg-[#121214] border-2 border-white/5 rounded-2xl h-14 px-5 text-white font-mono text-xl outline-none" placeholder={t.length} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-[#eab308] font-black">{(parseFloat(dim1) * t.unit_mult).toFixed(t.unit_precision)} {t.unit}</span>
          </div>
          <div className="relative">
            <input type="number" value={dim2} onChange={(e) => setDim2(e.target.value)} className="w-full bg-[#121214] border-2 border-white/5 rounded-2xl h-14 px-5 text-white font-mono text-xl outline-none" placeholder={t.width} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-[#eab308] font-black">{(parseFloat(dim2) * t.unit_mult).toFixed(t.unit_precision)} {t.unit}</span>
          </div>
          {(shape === 'block' || shape === 'tube') && (
            <div className="relative">
              <input type="number" value={dim3} onChange={(e) => setDim3(e.target.value)} className="w-full bg-[#121214] border-2 border-white/5 rounded-2xl h-14 px-5 text-white font-mono text-xl outline-none" placeholder={t.thickness} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-[#eab308] font-black">{(parseFloat(dim3) * t.unit_mult).toFixed(t.unit_precision)} {t.unit}</span>
            </div>
          )}
        </div>

        <div className="bg-black rounded-3xl p-8 border border-[#eab308]/20 flex flex-col items-center">
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">{t.weight}</span>
           <div className="flex items-baseline gap-3">
              <h4 className="text-6xl font-black text-[#eab308] tabular-nums">{calculateWeight}</h4>
              <span className="text-2xl font-black text-gray-500 uppercase">kg</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WeightCalc;
