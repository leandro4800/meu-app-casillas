
import React from 'react';
import { APP_LOGO_URL } from '../constants';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="w-full min-h-screen bg-[#161412] flex flex-col items-center justify-between p-8 text-center relative overflow-hidden">
      
      {/* Background Industrial Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#161412]/60 via-[#161412]/90 to-[#161412] z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200" 
          className="w-full h-full object-cover grayscale opacity-30 mix-blend-overlay"
          alt="Machining Background"
        />
        
        {/* Blueprint Grid Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="welcome-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#eab308" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#welcome-grid)" />
          </svg>
        </div>
      </div>
      
      <div className="relative z-20 pt-16 space-y-8">
        <div className="relative inline-block">
          <div className="size-28 rounded-[2.5rem] bg-[#221e1b] border-2 border-[#eab308] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(234,179,8,0.25)] relative z-10 overflow-hidden">
             <img src={APP_LOGO_URL} className="w-[80%] h-[80%] object-contain" alt="Logo Casillas" />
          </div>
          {/* Decorative Circles */}
          <div className="absolute -inset-4 border border-[#eab308]/5 rounded-full animate-spin-slow"></div>
          <div className="absolute -inset-8 border border-[#eab308]/5 rounded-full animate-reverse-spin"></div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-[#eab308] text-6xl font-black tracking-tighter uppercase italic leading-none">
            Casillas
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-[#eab308]/30"></div>
            <p className="text-white text-sm font-black uppercase tracking-[0.3em]">Guia Técnico de Usinagem</p>
            <div className="h-px w-8 bg-[#eab308]/30"></div>
          </div>
        </div>

        <p className="text-gray-500 text-xs leading-relaxed max-w-[280px] mx-auto font-bold uppercase tracking-wider">
          Alta precisão dimensional e cálculos complexos resolvidos em segundos.
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3 z-10 mb-10">
        <div className="bg-[#221e1b]/80 backdrop-blur-md border border-white/5 p-4 rounded-3xl flex items-center gap-4 text-left shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#eab308] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="size-11 rounded-2xl bg-[#2d2622] flex items-center justify-center text-[#eab308] border border-white/5">
            <span className="material-symbols-outlined text-2xl">settings_input_component</span>
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-tight">Banco de Dados ISO</p>
            <p className="text-[#eab308]/60 text-[9px] uppercase font-black tracking-widest">Tabelas e Normas Oficiais</p>
          </div>
        </div>

        <div className="bg-[#221e1b]/80 backdrop-blur-md border border-white/5 p-4 rounded-3xl flex items-center gap-4 text-left shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#eab308] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="size-11 rounded-2xl bg-[#2d2622] flex items-center justify-center text-[#eab308] border border-white/5">
            <span className="material-symbols-outlined text-2xl">architecture</span>
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-tight">Simulador de Medição</p>
            <p className="text-[#eab308]/60 text-[9px] uppercase font-black tracking-widest">Prática de Micrômetro</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xs z-10 pb-8 space-y-6">
        <button 
          onClick={onStart}
          className="w-full bg-[#eab308] hover:bg-[#facc15] active:scale-95 transition-all text-black font-black py-5 rounded-2xl shadow-[0_10px_40px_rgba(234,179,8,0.2)] flex items-center justify-center gap-3 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
          <span className="tracking-widest uppercase text-sm">Acessar Formulário</span>
          <span className="material-symbols-outlined font-black">arrow_forward</span>
        </button>
        
        <div className="flex items-center justify-center gap-4 text-gray-700">
           <span className="text-[9px] font-black uppercase tracking-widest">Build 302</span>
           <div className="size-1 bg-gray-800 rounded-full"></div>
           <span className="text-[9px] font-black uppercase tracking-widest">v2.4.0 Iron</span>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-reverse-spin { animation: reverse-spin 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default Welcome;
