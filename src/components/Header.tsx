import React from 'react';

interface HeaderProps {
  userInitials: string;
}

const Header: React.FC<HeaderProps> = ({ userInitials }) => {
  return (
    <header className="w-full h-16 px-6 flex items-center justify-between border-b border-white/5 z-20 bg-[#0a0908]">
      <button className="size-10 flex items-center justify-center text-[#eab308] active:scale-90 transition-transform">
        <span className="material-symbols-outlined text-3xl">menu</span>
      </button>
      
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-[#1c1e22] border border-[#eab308]/30 flex items-center justify-center text-[10px] font-black text-[#eab308] italic">
          {userInitials}
        </div>
      </div>
    </header>
  );
};

export default Header;
