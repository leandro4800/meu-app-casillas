import React, { useState } from 'react';
import { ChevronLeft, Ruler, PlayCircle } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';
import MicrometerVisualSimulator from '../components/MicrometerVisualSimulator';

interface MicrometerProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const Micrometer: React.FC<MicrometerProps> = ({ onBack, navigate, currentScreen }) => {
  const [reading, setReading] = useState({ main: '0', thimble: '0', vernier: '0' });
  const [showSimulator, setShowSimulator] = useState(false);

  const calculateTotal = () => {
    const main = parseFloat(reading.main) || 0;
    const thimble = (parseFloat(reading.thimble) || 0) * 0.01;
    const vernier = (parseFloat(reading.vernier) || 0) * 0.001;
    return (main + thimble + vernier).toFixed(3);
  };

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      {showSimulator && (
        <MicrometerVisualSimulator onClose={() => setShowSimulator(false)} />
      )}
      
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Simulador de Micrômetro</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        {/* Interactive Simulator Button */}
        <button 
          onClick={() => setShowSimulator(true)}
          className="w-full bg-[#eab308] hover:bg-[#d9a307] p-8 rounded-[2.5rem] mb-8 flex items-center justify-between group transition-all active:scale-95 shadow-2xl shadow-[#eab308]/20"
        >
          <div className="text-left">
            <h3 className="text-black font-black text-xl italic tracking-tighter mb-2">Micrômetro: Um simulador interativo para leitura</h3>
            <p className="text-black/60 text-[10px] font-black uppercase tracking-widest leading-relaxed">Simule a catraca de forma que facilite a leitura na tela para o usuário.</p>
          </div>
          <div className="size-16 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlayCircle size={32} className="text-[#eab308]" />
          </div>
        </button>

        <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 p-8 mb-8">
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-[280px] h-32 bg-[#1c1e22] rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
              <div className="absolute left-0 w-1/2 h-1 bg-gray-800" />
              <div className="absolute right-0 w-1/3 h-8 bg-[#252930] border-l-2 border-[#eab308]" />
              <div className="z-10 text-center">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Leitura Atual</p>
                <h2 className="text-[#eab308] text-4xl font-black italic tracking-tighter">{calculateTotal()}mm</h2>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Escala Principal (0.5mm)</label>
              <input
                type="number"
                step="0.5"
                value={reading.main}
                onChange={(e) => setReading({ ...reading, main: e.target.value })}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                placeholder="Ex: 12.5"
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Tambor (0.01mm)</label>
              <input
                type="number"
                max="50"
                value={reading.thimble}
                onChange={(e) => setReading({ ...reading, thimble: e.target.value })}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                placeholder="Ex: 32"
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Nônio (0.001mm)</label>
              <input
                type="number"
                max="10"
                value={reading.vernier}
                onChange={(e) => setReading({ ...reading, vernier: e.target.value })}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                placeholder="Ex: 4"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#eab308]/5 rounded-3xl border border-[#eab308]/20">
          <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-[#eab308] flex items-center justify-center shrink-0">
              <Ruler size={20} className="text-black" />
            </div>
            <div>
              <h4 className="text-[#eab308] font-black text-[10px] uppercase tracking-widest mb-1">Como ler</h4>
              <p className="text-gray-400 text-[9px] font-bold leading-relaxed uppercase tracking-wider">
                Some a escala principal + a marcação do tambor (x0.01) + o nônio (x0.001) para obter a medida final com precisão milesimal.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default Micrometer;
