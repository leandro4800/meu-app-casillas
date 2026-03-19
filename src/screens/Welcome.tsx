
import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const benefits = [
    { icon: 'psychology', title: 'Consultor IA Especialista', desc: 'Respostas técnicas instantâneas com Gemini 3 Pro.' },
    { icon: 'straighten', title: 'Metrologia Avançada', desc: 'Simuladores de micrômetro e tabelas de tolerância ISO.' },
    { icon: 'precision_manufacturing', title: 'Cálculos de Usinagem', desc: 'RPM, Avanço, Engrenagens e Pesos em segundos.' },
    { icon: 'verified', title: 'Normas Técnicas', desc: 'Acesso a tabelas de roscas, flanges e manilhas.' }
  ];

  return (
    <div className="w-full min-h-screen bg-[#0a0908] flex flex-col items-center relative overflow-y-auto custom-scrollbar pb-12">
      
      {/* Background Industrial Hero */}
      <div className="w-full h-[45vh] relative shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0908]/50 to-[#0a0908] z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200" 
          className="w-full h-full object-cover grayscale opacity-40"
          alt="Industrial Background"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center">
            <img 
              src="/logo_casillas.png" 
              className="size-32 object-contain mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]"
              alt="Casillas Logo"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-[#eab308] text-7xl font-black tracking-tighter uppercase italic leading-none drop-shadow-2xl mb-2">
              Casillas
            </h1>
            <p className="text-white text-xs font-black uppercase tracking-[0.4em] opacity-80">Engenharia & Usinagem</p>
          </div>
        </div>
      </div>
      
      <div className="relative z-30 -mt-12 px-6 w-full space-y-10">
        {/* Intro Text */}
        <div className="text-center space-y-4">
          <p className="text-gray-400 text-sm leading-relaxed font-medium">
            A ferramenta definitiva para o profissional de usinagem moderno. 
            Precisão de engenharia no seu bolso.
          </p>
          <div className="h-1 w-12 bg-[#eab308] mx-auto rounded-full"></div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-4">
          {benefits.map((benefit, idx) => (
            <div 
              key={benefit.title} 
              className="bg-[#1c1e22]/40 backdrop-blur-md border border-white/5 p-5 rounded-[2rem] flex items-start gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="size-12 rounded-2xl bg-[#eab308]/10 flex items-center justify-center text-[#eab308] shrink-0 border border-[#eab308]/20">
                <span className="material-symbols-outlined text-2xl">{benefit.icon}</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-black text-sm uppercase tracking-tight">{benefit.title}</h3>
                <p className="text-gray-500 text-[11px] leading-relaxed font-bold">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof / Trust */}
        <div className="bg-[#eab308] rounded-[2.5rem] p-8 text-black text-center space-y-4 shadow-[0_20px_50px_rgba(234,179,8,0.15)]">
          <div className="flex justify-center -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <img 
                key={i}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                className="size-10 rounded-full border-2 border-[#eab308] bg-white"
                alt="User"
              />
            ))}
            <div className="size-10 rounded-full border-2 border-[#eab308] bg-black flex items-center justify-center text-white text-[10px] font-black">
              +500
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest leading-tight">
            Utilizado por centenas de técnicos e engenheiros em todo o Brasil.
          </p>
        </div>

        {/* CTA Section */}
        <div className="space-y-6 pt-4">
          <button 
            onClick={onStart}
            className="w-full bg-[#eab308] hover:bg-[#facc15] active:scale-95 transition-all text-black font-black py-6 rounded-[2rem] shadow-[0_15px_40px_rgba(234,179,8,0.2)] flex items-center justify-center gap-3 group"
          >
            <span className="tracking-widest uppercase text-sm">Começar Agora</span>
            <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          
          <div className="flex flex-col items-center gap-2 opacity-30">
             <div className="flex items-center gap-4">
                <span className="text-[9px] font-black uppercase tracking-widest">Acesso Seguro</span>
                <div className="size-1 bg-gray-600 rounded-full"></div>
                <span className="text-[9px] font-black uppercase tracking-widest">Suporte 24/7</span>
             </div>
             <p className="text-[8px] font-black uppercase tracking-[0.3em]">v2.4.0 PRO READY</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Welcome;
