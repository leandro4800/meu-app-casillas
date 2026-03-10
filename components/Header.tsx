
import React from 'react';
import { Screen } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  onBack: () => void;
  currentScreen: Screen;
  t: any;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onBack, currentScreen, t }) => {
  const isHome = currentScreen === 'home';

  const getTitle = () => {
    switch (currentScreen) {
      case 'home': return '';
      case 'machining_params': return t.machining_params;
      case 'consultant': return t.ai_chat;
      case 'ai_agent': return 'Gestão Industrial';
      case 'trigonometry': return t.trig;
      case 'profile': return t.profile;
      case 'checkout': return t.premium;
      case 'glossary': return 'Manual Técnico';
      default: return 'Casillas';
    }
  };

  return (
    <header className={`sticky top-0 z-50 p-4 flex items-center justify-between shrink-0 transition-colors duration-300 ${isHome ? 'bg-transparent' : 'bg-[#1c1e22]/95 backdrop-blur-md border-b border-[#252930]'}`}>
      <button 
        onClick={onMenuClick}
        className="text-[#eab308] p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors"
      >
        <span className="material-symbols-outlined text-3xl font-bold">menu</span>
      </button>
      
      <h1 className="text-sm font-black text-[#eab308] uppercase tracking-[0.2em] flex-1 text-center">
        {getTitle()}
      </h1>

      {!isHome ? (
        <button 
          onClick={onBack}
          className="text-[#eab308] p-2 -mr-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
        </button>
      ) : (
        <div className="w-10"></div>
      )}
    </header>
  );
};

export default Header;
