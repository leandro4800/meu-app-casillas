import React from 'react';
import BottomNav from '../components/BottomNav';
import { Screen } from '../types';
import { ChevronLeft, Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const PlaceholderScreen: React.FC<PlaceholderProps> = ({ title, onBack, navigate, currentScreen }) => {
  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">{title}</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="size-24 rounded-[2rem] bg-white/[0.03] flex items-center justify-center mb-8 border border-white/5 shadow-inner">
          <Construction size={40} className="text-gray-600" />
        </div>
        <h2 className="text-2xl font-black italic text-white mb-3 tracking-tight">Em Desenvolvimento</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-bold max-w-[240px] leading-relaxed">
          Esta ferramenta está sendo preparada para a próxima atualização do Casillas Oficial.
        </p>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default PlaceholderScreen;
