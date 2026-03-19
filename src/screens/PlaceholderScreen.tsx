import React from 'react';
import BottomNav from '../components/BottomNav';
import { Screen } from '../types';

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
        <button onClick={onBack} className="size-10 flex items-center justify-center text-[#eab308]">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-white font-black text-sm uppercase tracking-widest">{title}</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-24 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
          <span className="material-symbols-outlined text-gray-500 text-4xl">construction</span>
        </div>
        <h2 className="text-2xl font-black italic text-white mb-2">Em Desenvolvimento</h2>
        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold max-w-[240px]">
          Esta ferramenta está sendo preparada para a próxima atualização.
        </p>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default PlaceholderScreen;
