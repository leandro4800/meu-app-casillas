import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  t?: any;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, navigate, t }) => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0908]/80 backdrop-blur-xl border-t border-white/5 px-8 flex items-center justify-between z-30">
      <button 
        onClick={() => navigate('home')}
        className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'home' ? 'text-[#eab308]' : 'text-gray-500'}`}
      >
        <span className="material-symbols-outlined text-2xl">home</span>
        <span className="text-[8px] font-black uppercase tracking-widest">Início</span>
      </button>
      <button 
        onClick={() => navigate('ai_agent')}
        className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'ai_agent' ? 'text-[#eab308]' : 'text-gray-500'}`}
      >
        <span className="material-symbols-outlined text-2xl">psychology</span>
        <span className="text-[8px] font-black uppercase tracking-widest">IA</span>
      </button>
      <button 
        onClick={() => navigate('profile')}
        className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'profile' ? 'text-[#eab308]' : 'text-gray-500'}`}
      >
        <span className="material-symbols-outlined text-2xl">person</span>
        <span className="text-[8px] font-black uppercase tracking-widest">Perfil</span>
      </button>
    </nav>
  );
};

export default BottomNav;
