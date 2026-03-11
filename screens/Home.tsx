
import React, { useState, useMemo } from 'react';
import { Screen, Language, User } from '../types';

interface HomeProps {
  user: User | null;
  navigate: (screen: Screen) => void;
  t: any;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Home: React.FC<HomeProps> = ({ user, navigate, t, language, setLanguage }) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const expirationNotice = useMemo(() => {
    if (!user || user.email === '48mineiro@gmail.com' || !user.expiryDate) return null;
    const now = new Date();
    const expiry = new Date(user.expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 5 && diffDays > 0) return { days: diffDays, urgent: diffDays <= 2 };
    return null;
  }, [user]);

  const mainActions = [
    { id: 'machining_params', icon: 'calculate', title: t.home_calc_title, desc: t.home_calc_desc },
    { id: 'verifier', icon: 'table_rows', title: t.home_iso_title, desc: t.home_iso_desc },
    { id: 'table_conversion', icon: 'swap_horiz', title: t.home_conv_title, desc: t.home_conv_desc }
  ];

  const languages = [
    { id: 'pt_BR', flag: '🇧🇷', label: 'Brasil' },
    { id: 'en_US', flag: '🇺🇸', label: 'English' },
    { id: 'fr_QC', flag: '🇨🇦', label: 'Québec' },
    { id: 'pt_PT', flag: '🇵🇹', label: 'Portugal' }
  ];

  const currentLang = languages.find(l => l.id === language);

  return (
    <div className="flex flex-col min-h-full bg-[#0a0908] relative overflow-y-auto custom-scrollbar">
      {/* Banner de Expiração */}
      {expirationNotice && (
        <div className={`w-full py-3 px-6 flex items-center justify-between border-b ${expirationNotice.urgent ? 'bg-red-600 border-red-500' : 'bg-[#eab308] border-[#eab308]'}`}>
           <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-black font-black">warning</span>
              <p className="text-black font-black text-[10px] uppercase tracking-widest">
                Expira em {expirationNotice.days} dias
              </p>
           </div>
           <button onClick={() => navigate('checkout')} className="bg-black text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
             Renovar
           </button>
        </div>
      )}

      {/* Seletor de Idioma */}
      <div className="absolute top-4 right-6 z-50">
        <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="size-12 rounded-2xl bg-[#1c1e22]/80 backdrop-blur-md border border-[#eab308]/30 flex items-center justify-center shadow-xl">
          <span className="text-2xl">{currentLang?.flag}</span>
        </button>
        {isLangMenuOpen && (
          <div className="absolute top-14 right-0 w-48 bg-[#1c1e22] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[60]">
               {languages.map(l => (
                 <button key={l.id} onClick={() => { setLanguage(l.id as Language); setIsLangMenuOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-all ${language === l.id ? 'bg-[#eab308]/10' : ''}`}>
                    <span className="text-xl">{l.flag}</span>
                    <span className={`text-[11px] font-black uppercase tracking-wider ${language === l.id ? 'text-[#eab308]' : 'text-gray-400'}`}>
                      {l.label}
                    </span>
                 </button>
               ))}
          </div>
        )}
      </div>

      <div className="relative z-20 flex flex-col items-center pt-12 px-6">
        <h1 className="text-[#eab308] text-6xl font-black tracking-tighter uppercase italic leading-none mb-1">Casillas</h1>
        <h2 className="text-[#eab308] text-base font-black tracking-[0.2em] uppercase opacity-70 mb-8">{t.app_subtitle}</h2>

        <p className="text-gray-400 text-[11px] leading-relaxed max-w-[280px] mx-auto text-center mb-10 font-black uppercase tracking-widest opacity-60">
          {t.app_desc}
        </p>

        <div className="w-full space-y-4 mb-16">
          {mainActions.map((action) => (
            <button key={action.id} onClick={() => navigate(action.id as Screen)} className="w-full bg-[#1c1e22]/60 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex items-center gap-5 text-left active:scale-[0.98] transition-all shadow-xl hover:border-[#eab308]/20 group">
              <div className="size-14 rounded-2xl bg-[#252930] flex items-center justify-center text-[#eab308] shrink-0 border border-white/5 group-hover:bg-[#eab308]/10 transition-colors">
                <span className="material-symbols-outlined text-3xl">{action.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-black text-base tracking-tight">{action.title}</p>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mt-0.5">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
