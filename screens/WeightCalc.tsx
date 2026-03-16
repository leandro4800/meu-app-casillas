
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
  const [dim1, setDim1] = useState('100'); // Comprimento (L)
  const [dim2, setDim2] = useState('50');  // Diâmetro Externo (D1)
  const [dim3, setDim3] = useState('0');   // Diâmetro Interno (D2)
  const [isHollow, setIsHollow] = useState(false);

  const calculateWeight = useMemo(() => {
    const L = parseFloat(dim1) || 0;
    const D1 = parseFloat(dim2) || 0;
    const D2 = isHollow ? (parseFloat(dim3) || 0) : 0;
    
    let volMm3 = 0;
    if (shape === 'block') {
      const width = parseFloat(dim2) || 0;
      const thickness = parseFloat(dim3) || 0;
      volMm3 = L * width * thickness;
    } else if (shape === 'round') {
      // Área do círculo externo - Área do círculo interno
      const area = (Math.PI * Math.pow(D1 / 2, 2)) - (Math.PI * Math.pow(D2 / 2, 2));
      volMm3 = area * L;
    } else if (shape === 'hex') {
      volMm3 = 0.866025 * Math.pow(D1, 2) * L;
    } else if (shape === 'tube') {
      // Mantendo para compatibilidade ou se quiserem separado, mas o usuário pediu no botão de barra redonda
      const dInner = parseFloat(dim3) || 0;
      volMm3 = Math.PI * (Math.pow(D1 / 2, 2) - Math.pow(dInner / 2, 2)) * L;
    }
    
    return ((volMm3 / 1000) * material.density / 1000).toFixed(3);
  }, [shape, material, dim1, dim2, dim3, isHollow]);

  return (
    <div className="flex flex-col h-full bg-[#121214] text-white relative">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-32">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">{t.material || 'Material'}</label>
          <select 
            onChange={(e) => setMaterial(MATERIALS_LIST.find(m => m.name === e.target.value) || material)} 
            className="w-full bg-[#1c1e22] border border-white/5 rounded-2xl h-16 px-5 text-white outline-none focus:border-[#eab308]/50 transition-all"
          >
            {MATERIALS_LIST.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
          </select>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
           {[
             { id: 'block', icon: 'square', label: t.block || 'Bloco' },
             { id: 'round', icon: 'circle', label: t.round || 'Redondo' },
             { id: 'hex', icon: 'hexagon', label: t.hex || 'Sextavado' }
           ].map(s => (
             <button 
               key={s.id} 
               onClick={() => setShape(s.id as Shape)} 
               className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 ${shape === s.id ? 'bg-[#eab308] border-[#eab308] text-black shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'bg-[#1c1e22] border-white/5 text-gray-500 hover:border-white/20'}`}
             >
                <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-tighter">{s.label}</span>
             </button>
           ))}
        </div>

        {shape === 'round' && (
          <div className="flex items-center gap-3 bg-[#1c1e22] p-4 rounded-2xl border border-white/5">
            <button 
              onClick={() => setIsHollow(!isHollow)}
              className={`size-6 rounded-md border-2 flex items-center justify-center transition-all ${isHollow ? 'bg-[#eab308] border-[#eab308]' : 'border-white/20'}`}
            >
              {isHollow && <span className="material-symbols-outlined text-black text-sm font-black">check</span>}
            </button>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">Tubo / Barra com Furo</span>
          </div>
        )}

        <div className="bg-[#1c1e22] p-6 rounded-3xl space-y-4 border border-white/5">
          <div className="relative">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Comprimento (L)</label>
            <input type="number" value={dim1} onChange={(e) => setDim1(e.target.value)} className="w-full bg-[#121214] border-2 border-white/5 rounded-2xl h-14 px-5 text-white font-mono text-xl outline-none focus:border-[#eab308]/30 transition-all" placeholder="0" />
            <span className="absolute right-4 bottom-4 text-[9px] text-[#eab308] font-black">mm</span>
          </div>

          <div className="relative">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-1 block">
              {shape === 'block' ? 'Largura (W)' : 'Diâmetro Externo (D1)'}
            </label>
            <input type="number" value={dim2} onChange={(e) => setDim2(e.target.value)} className="w-full bg-[#121214] border-2 border-white/5 rounded-2xl h-14 px-5 text-white font-mono text-xl outline-none focus:border-[#eab308]/30 transition-all" placeholder="0" />
            <span className="absolute right-4 bottom-4 text-[9px] text-[#eab308] font-black">mm</span>
          </div>

          {(shape === 'block' || (shape === 'round' && isHollow)) && (
            <div className="relative">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-1 block">
                {shape === 'block' ? 'Espessura (T)' : 'Diâmetro Interno (D2)'}
              </label>
              <input type="number" value={dim3} onChange={(e) => setDim3(e.target.value)} className="w-full bg-[#121214] border-2 border-white/5 rounded-2xl h-14 px-5 text-white font-mono text-xl outline-none focus:border-[#eab308]/30 transition-all" placeholder="0" />
              <span className="absolute right-4 bottom-4 text-[9px] text-[#eab308] font-black">mm</span>
            </div>
          )}
        </div>

        <div className="bg-black rounded-3xl p-8 border border-[#eab308]/20 flex flex-col items-center shadow-2xl">
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">{t.weight || 'Peso Estimado'}</span>
           <div className="flex items-baseline gap-3">
              <h4 className="text-7xl font-black text-[#eab308] tabular-nums tracking-tighter">{calculateWeight}</h4>
              <span className="text-2xl font-black text-gray-500 uppercase">kg</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WeightCalc;
