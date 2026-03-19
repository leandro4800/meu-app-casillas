import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';
import { Screen } from '../types';

const MachiningParams: React.FC<{ onBack: () => void, navigate: (screen: Screen) => void }> = ({ onBack, navigate }) => {
  const [vc, setVc] = useState('');
  const [d, setD] = useState('');
  const [z, setZ] = useState('');
  const [fz, setFz] = useState('');

  const rpm = vc && d ? Math.round((parseFloat(vc) * 1000) / (Math.PI * parseFloat(d))) : 0;
  const feed = rpm && z && fz ? Math.round(rpm * parseFloat(z) * parseFloat(fz)) : 0;

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-[#eab308]">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col">
          <h1 className="text-white font-black text-sm uppercase tracking-widest">Cálculos de Usinagem</h1>
          <p className="text-[#eab308] text-[8px] font-black uppercase tracking-[0.2em]">Parâmetros de Corte</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-24">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Velocidade de Corte (Vc - m/min)</label>
            <input
              type="number"
              value={vc}
              onChange={(e) => setVc(e.target.value)}
              placeholder="Ex: 200"
              className="w-full bg-[#1c1e22] border border-white/10 rounded-3xl py-5 px-6 text-white focus:outline-none focus:border-[#eab308]/50 transition-all"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Diâmetro da Ferramenta (D - mm)</label>
            <input
              type="number"
              value={d}
              onChange={(e) => setD(e.target.value)}
              placeholder="Ex: 50"
              className="w-full bg-[#1c1e22] border border-white/10 rounded-3xl py-5 px-6 text-white focus:outline-none focus:border-[#eab308]/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Nº de Dentes (Z)</label>
              <input
                type="number"
                value={z}
                onChange={(e) => setZ(e.target.value)}
                placeholder="Ex: 4"
                className="w-full bg-[#1c1e22] border border-white/10 rounded-3xl py-5 px-6 text-white focus:outline-none focus:border-[#eab308]/50 transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Avanço/Dente (fz - mm)</label>
              <input
                type="number"
                value={fz}
                onChange={(e) => setFz(e.target.value)}
                placeholder="Ex: 0.15"
                className="w-full bg-[#1c1e22] border border-white/10 rounded-3xl py-5 px-6 text-white focus:outline-none focus:border-[#eab308]/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <div className="bg-[#eab308] rounded-[2.5rem] p-8 text-black shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Rotação Calculada</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black italic tracking-tighter">{rpm}</span>
              <span className="text-xs font-black uppercase tracking-widest">RPM</span>
            </div>
          </div>

          <div className="bg-[#1c1e22] border border-white/5 rounded-[2.5rem] p-8 text-white shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-gray-500">Avanço de Mesa</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black italic tracking-tighter text-[#eab308]">{feed}</span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">mm/min</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav currentScreen="machining_params" navigate={navigate} />
    </div>
  );
};

export default MachiningParams;
