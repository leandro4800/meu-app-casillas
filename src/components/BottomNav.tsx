import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, navigate }) => {
  const navItems = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'ai_agent', icon: 'smart_toy', label: 'IA Agent' },
    { id: 'profile', icon: 'person', label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 bg-[#0a0908]/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-6 pb-4 z-50">
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id as Screen)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-[#eab308] scale-110' : 'text-gray-500'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${isActive ? 'fill-1' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest italic">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
