
import React from 'react';
import { Screen, User } from '../types';
import { CASILLAS_CONSULTANT_IMAGE } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (screen: Screen) => void;
  user: User | null;
  t: any;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, navigate, user, t }) => {
  const menuGroups = [
    {
      title: t.tools,
      items: [
        { id: 'consultant', label: t.consultant_title || "Engenheiro Casillas", icon: 'engineering' },
        { id: 'hailtools_voice', label: t.ai_hailtools_title || "Consultor Hailtools", icon: 'record_voice_over' },
        { id: 'tool_library', label: t.sb_hailtools, icon: 'auto_stories' },
        { id: 'glossary', label: t.sb_glossary, icon: 'menu_book' },
        { id: 'materials', label: t.sb_materials, icon: 'science' },
        { id: 'material_comparison', label: t.sb_comparison, icon: 'compare_arrows' },
      ]
    },
    {
      title: t.calculations,
      items: [
        { id: 'machining_params', label: t.machining_params, icon: 'speed' },
        { id: 'trigonometry', label: t.sb_trig, icon: 'architecture' },
        { id: 'calc_weight', label: t.sb_weight, icon: 'inventory' },
        { id: 'calc_gears', label: t.sb_gears, icon: 'settings_suggest' },
        { id: 'calc_divider', label: t.sb_divider, icon: 'grid_on' },
        { id: 'table_conversion', label: t.sb_conversion, icon: 'calculate' },
      ]
    },
    {
      title: t.tables,
      items: [
        { id: 'table_threads', label: t.sb_threads, icon: 'bolt' },
        { id: 'table_tolerances', label: t.sb_tolerances, icon: 'square_foot' },
        { id: 'table_shackles', label: t.sb_shackles, icon: 'plumbing' },
        { id: 'table_arc', label: t.sb_arc, icon: 'architecture' },
      ]
    }
  ];

  return (
    <>
      <div className={`fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={onClose} />
      <aside className={`fixed top-0 left-0 z-[110] h-full w-[85%] max-w-[320px] bg-[#1c1e22] border-r border-white/10 shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-6 flex items-center gap-4 bg-[#121214]/50 border-b border-white/5">
            <div className="size-12 rounded-full border-2 border-[#eab308] overflow-hidden bg-[#252930] shrink-0">
              <img src={user?.photoURL || CASILLAS_CONSULTANT_IMAGE} alt="Operador" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-base uppercase italic truncate">{user?.displayName || 'OPERADOR'}</p>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest truncate">{user?.role || 'Consultor Técnico'}</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar bg-[#1c1e22]">
            {menuGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <p className="px-5 mb-3 text-[11px] font-black text-[#eab308]/40 uppercase tracking-[0.4em]">{group.title}</p>
                {group.items.map((item) => (
                  <button key={item.id} onClick={() => navigate(item.id as Screen)} className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 group transition-all">
                    <div className="size-8 rounded-lg bg-[#252930] flex items-center justify-center text-gray-600 group-hover:text-[#eab308] transition-colors border border-white/5">
                       <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    </div>
                    <span className="text-base font-bold tracking-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="p-6 border-t border-white/10 bg-[#121214] shrink-0">
             <button onClick={() => navigate('profile')} className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-[#eab308]/5 text-[#eab308] font-black uppercase text-xs tracking-widest border border-[#eab308]/10">
                <span className="material-symbols-outlined text-lg">settings</span>
                {t.sb_manage_profile}
             </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
