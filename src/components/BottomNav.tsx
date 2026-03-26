import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  t?: any;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, navigate, t }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0a0908]/95 backdrop-blur-xl border-t border-white/5 px-6 flex items-center justify-between z-30">
      <button 
        onClick={() => navigate('home')}
        className={`flex flex-col items-center gap-1 transition-all flex-1 ${currentScreen === 'home' ? 'text-[#eab308]' : 'text-gray-500'}`}
      >
        <span className="material-symbols-outlined text-2xl">home</span>
        <span className="text-[8px] font-black uppercase tracking-widest">Início</span>
      </button>
      
      <button 
        onClick={() => navigate('ai_suite')}
        className={`flex flex-col items-center gap-1 transition-all flex-1 ${currentScreen === 'ai_suite' ? 'text-[#eab308]' : 'text-gray-500'}`}
      >
        <span className="text-2xl font-light tracking-tighter leading-none h-6 flex items-center">_)_</span>
        <span className="text-[8px] font-black uppercase tracking-widest">Consultor Técnico</span>
      </button>

      <button 
        onClick={() => navigate('tool_library')}
        className={`flex flex-col items-center gap-1 transition-all flex-1 ${currentScreen === 'tool_library' ? 'text-[#eab308]' : 'text-gray-500'}`}
      >
        <span className="material-symbols-outlined text-2xl">work</span>
        <span className="text-[8px] font-black uppercase tracking-widest">Gestão</span>
      </button>

      <button 
        onClick={() => navigate('trigonometry')}
        className={`flex flex-col items-center gap-1 transition-all flex-1 ${currentScreen === 'trigonometry' ? 'text-[#eab308]' : 'text-gray-500'}`}
      >
        <span className="material-symbols-outlined text-2xl">architecture</span>
        <span className="text-[8px] font-black uppercase tracking-widest">Trig</span>
      </button>

      <button 
        onClick={() => navigate('profile')}
        className={`flex flex-col items-center gap-1 transition-all flex-1 ${currentScreen === 'profile' ? 'text-[#eab308]' : 'text-gray-500'}`}
      >
        <span className="material-symbols-outlined text-2xl">person</span>
        <span className="text-[8px] font-black uppercase tracking-widest">Perfil</span>
      </button>
    </nav>
  );
};

export default BottomNav;
