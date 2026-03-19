import React from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
  onBack?: () => void;
  currentScreen?: string;
  t?: any;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onBack, currentScreen, t }) => {
  return (
    <header className="w-full h-16 px-6 flex items-center justify-between border-b border-white/5 z-20 bg-[#0a0908]">
      <button onClick={onMenuClick} className="size-10 flex items-center justify-center text-[#eab308]">
        <span className="material-symbols-outlined text-3xl">menu</span>
      </button>
      <div className="size-10 rounded-full bg-[#1c1e22] border border-[#eab308]/30 flex items-center justify-center text-[10px] font-black text-[#eab308]">
        {t?.lang || 'BR'}
      </div>
    </header>
  );
};

export default Header;
