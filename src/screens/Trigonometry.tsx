import React, { useState } from 'react';
import { ChevronLeft, Triangle } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';

interface TrigonometryProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const Trigonometry: React.FC<TrigonometryProps> = ({ onBack, navigate, currentScreen }) => {
  const [sideA, setSideA] = useState('');
  const [sideB, setSideB] = useState('');

  const getHypotenuse = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    if (!isNaN(a) && !isNaN(b)) {
      return Math.sqrt(a * a + b * b);
    }
    return null;
  };

  const hypotenuse = getHypotenuse();

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Trigonometria</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 p-8 mb-8 relative overflow-hidden">
          <div className="flex justify-center mb-8">
            <div className="relative size-32 border-b-2 border-l-2 border-[#eab308]/30">
              <div className="absolute bottom-0 left-0 w-full h-full border-t-2 border-r-2 border-transparent border-t-[#eab308] origin-bottom-left -rotate-[36.87deg] w-[125%]" style={{ width: '125%', transform: 'rotate(-36.87deg)', transformOrigin: 'bottom left' }} />
              <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500 italic">A</span>
              <span className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-500 italic">B</span>
              <span className="absolute top-0 right-[-10px] text-[10px] font-black text-[#eab308] italic">H</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Cateto A (mm)</label>
                <input
                  type="number"
                  value={sideA}
                  onChange={(e) => setSideA(e.target.value)}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Cateto B (mm)</label>
                <input
                  type="number"
                  value={sideB}
                  onChange={(e) => setSideB(e.target.value)}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Hipotenusa (H)</label>
              <div className="w-full bg-[#eab308]/5 border border-[#eab308]/20 rounded-2xl py-6 px-6 flex items-center justify-between">
                <span className="text-[#eab308] text-3xl font-black italic tracking-tight">
                  {hypotenuse ? hypotenuse.toFixed(3) : '---'}
                </span>
                <Triangle size={24} className="text-[#eab308]/30" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
            <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-4">Fórmulas Rápidas</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[10px] font-bold uppercase">Seno</span>
                <span className="text-white text-[10px] font-black italic">Cat. Oposto / Hipotenusa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[10px] font-bold uppercase">Cosseno</span>
                <span className="text-white text-[10px] font-black italic">Cat. Adjacente / Hipotenusa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[10px] font-bold uppercase">Tangente</span>
                <span className="text-white text-[10px] font-black italic">Cat. Oposto / Cat. Adjacente</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default Trigonometry;
