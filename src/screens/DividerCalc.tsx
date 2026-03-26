import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';

interface DividerCalcProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const DividerCalc: React.FC<DividerCalcProps> = ({ onBack, navigate, currentScreen }) => {
  const [divisions, setDivisions] = useState('');
  const [ratio, setRatio] = useState('40'); // Default ratio 40:1

  const calculate = () => {
    const z = parseInt(divisions);
    const r = parseInt(ratio);
    if (isNaN(z) || isNaN(r) || z <= 0) return null;

    const turns = Math.floor(r / z);
    const remainder = r % z;
    
    // Simplify fraction (remainder / z)
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const common = gcd(remainder, z);
    
    return {
      turns,
      num: remainder / common,
      den: z / common,
      hasFraction: remainder > 0
    };
  };

  const result = calculate();

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Aparelho Divisor</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Relação do Divisor (ex: 40:1)</label>
              <select 
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all appearance-none uppercase tracking-widest"
              >
                <option value="40">40:1 (Padrão)</option>
                <option value="60">60:1</option>
                <option value="80">80:1</option>
                <option value="90">90:1</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block italic">Nº de Divisões Desejadas</label>
              <input
                type="number"
                value={divisions}
                onChange={(e) => setDivisions(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-[#eab308]/50 transition-all"
                placeholder="Ex: 12"
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-[#eab308] rounded-[2.5rem] text-center shadow-2xl shadow-[#eab308]/20"
            >
              <p className="text-black/60 text-[10px] font-black uppercase tracking-widest mb-4">Resultado da Manivela</p>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-black text-6xl font-black italic tracking-tighter">{result.turns}</span>
                  <span className="text-black/40 text-[8px] font-bold uppercase tracking-widest">Voltas</span>
                </div>
                
                {result.hasFraction && (
                  <>
                    <span className="text-black/20 text-4xl font-light">+</span>
                    <div className="flex flex-col items-center">
                      <span className="text-black text-2xl font-black border-b-2 border-black/20 pb-1">{result.num}</span>
                      <span className="text-black text-2xl font-black pt-1">{result.den}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 bg-black/10 rounded-2xl">
                <p className="text-black text-[9px] font-bold uppercase leading-relaxed">
                  {result.turns > 0 ? `${result.turns} volta(s) completa(s)` : 'Nenhuma volta completa'}
                  {result.hasFraction ? ` e ${result.num} furos em um disco de ${result.den} furos.` : '.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!result && (
          <div className="mt-12 text-center opacity-20">
            <RotateCcw size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Insira as divisões para calcular</p>
          </div>
        )}
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default DividerCalc;
