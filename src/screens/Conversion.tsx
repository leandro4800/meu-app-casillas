import React, { useState } from 'react';
import { ChevronLeft, ArrowRightLeft } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';

interface ConversionProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const Conversion: React.FC<ConversionProps> = ({ onBack, navigate, currentScreen }) => {
  const [mode, setMode] = useState<'mm_to_inch' | 'inch_to_mm'>('mm_to_inch');
  const [input, setInput] = useState('');

  const getResult = () => {
    const val = parseFloat(input);
    if (isNaN(val)) return '';

    if (mode === 'mm_to_inch') {
      const inches = val / 25.4;
      return inches.toFixed(4) + '"';
    } else {
      const mm = val * 25.4;
      return mm.toFixed(3) + ' mm';
    }
  };

  const result = getResult();

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Conversão</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${mode === 'mm_to_inch' ? 'text-[#eab308]' : 'text-gray-600'}`}>Milímetros</span>
              <div className={`size-2 rounded-full ${mode === 'mm_to_inch' ? 'bg-[#eab308]' : 'bg-gray-800'}`} />
            </div>
            
            <button 
              onClick={() => setMode(mode === 'mm_to_inch' ? 'inch_to_mm' : 'mm_to_inch')}
              className="size-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-[#eab308] hover:bg-[#eab308] hover:text-black transition-all group"
            >
              <ArrowRightLeft size={20} className="group-active:scale-90 transition-transform" />
            </button>

            <div className="flex flex-col items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${mode === 'inch_to_mm' ? 'text-[#eab308]' : 'text-gray-600'}`}>Polegadas</span>
              <div className={`size-2 rounded-full ${mode === 'inch_to_mm' ? 'bg-[#eab308]' : 'bg-gray-800'}`} />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">
                Valor em {mode === 'mm_to_inch' ? 'Milímetros' : 'Polegadas'}
              </label>
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-6 px-6 text-white text-2xl font-black italic outline-none focus:border-[#eab308]/50 transition-all placeholder:text-gray-800"
                placeholder="0.00"
              />
            </div>

            <div className="pt-6 border-t border-white/5">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Resultado</label>
              <div className="w-full bg-[#eab308]/5 border border-[#eab308]/20 rounded-2xl py-6 px-6">
                <span className="text-[#eab308] text-3xl font-black italic tracking-tight">
                  {result || '---'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
            <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-[#eab308]" />
              Referência Rápida
            </h4>
            <div className="grid grid-cols-2 gap-y-3">
              {[
                { i: '1/16"', m: '1.588 mm' },
                { i: '1/8"', m: '3.175 mm' },
                { i: '1/4"', m: '6.350 mm' },
                { i: '1/2"', m: '12.700 mm' },
                { i: '3/4"', m: '19.050 mm' },
                { i: '1"', m: '25.400 mm' },
              ].map((ref) => (
                <div key={ref.i} className="flex justify-between pr-4 border-r border-white/5 last:border-0">
                  <span className="text-gray-500 text-[10px] font-bold">{ref.i}</span>
                  <span className="text-white text-[10px] font-black italic">{ref.m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default Conversion;
