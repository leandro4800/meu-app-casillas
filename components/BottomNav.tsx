
import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  t: any;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, navigate, t }) => {
  const items = [
    { id: 'home', icon: 'home', label: t.home || 'Início' },
    { id: 'ai_suite', icon: 'auto_spark', label: 'Consultor Técnico' },
    { id: 'ai_agent', icon: 'business_center', label: 'Gestão' },
    { id: 'trigonometry', icon: 'architecture', label: t.trig || 'Trig' },
    { id: 'profile', icon: 'person', label: t.profile || 'Perfil' },
  ];

  return (
    <nav className="sticky bottom-0 z-50 bg-[#121214] border-t border-[#252930] safe-pb px-1 py-2 flex justify-around items-center shrink-0">
      {items.map((item) => {
        const isActive = currentScreen === item.id || 
                        (item.id === 'ai_suite' && (currentScreen === 'voice_consultant' || currentScreen === 'media_lab' || currentScreen === 'consultant'));
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id as Screen)}
            className={`flex flex-col items-center gap-1 p-1 transition-all min-w-[70px] ${
              isActive ? 'text-[#eab308]' : 'text-gray-500 hover:text-white'
            }`}
          >
            <div className="size-7 flex items-center justify-center overflow-hidden">
               <span className={`material-symbols-outlined text-[24px] ${isActive ? 'filled' : ''} leading-none block`}>
                {item.icon}
              </span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-tight text-center leading-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
