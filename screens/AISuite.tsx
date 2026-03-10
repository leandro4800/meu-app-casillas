
import React from 'react';
import { Screen } from '../types';

interface AISuiteProps {
  navigate: (screen: Screen) => void;
  t: any;
}

const AISuite: React.FC<AISuiteProps> = ({ navigate, t }) => {
  const tools = [
    {
      id: 'drawing_analysis',
      title: "Análise de Desenho",
      desc: "Interprete projetos offshore e sugestão de processos",
      icon: 'architecture',
      color: 'border-orange-500/30 text-orange-400 bg-orange-500/5'
    },
    {
      id: 'voice_consultant',
      title: "Consultor por Voz",
      desc: "Suporte técnico hands-free em tempo real",
      icon: 'mic',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/5'
    },
    {
      id: 'media_lab',
      title: "Laboratório Visual",
      desc: "Crie imagens e vídeos técnicos das suas ideias",
      icon: 'photo_camera',
      color: 'border-[#eab308]/30 text-[#eab308] bg-[#eab308]/5'
    },
    {
      id: 'consultant',
      title: "Engenheiro Casillas",
      desc: "Consultoria sênior em usinagem e caldeiraria",
      icon: 'engineering',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
    }
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 h-full overflow-y-auto custom-scrollbar">
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-[#eab308] italic uppercase tracking-tighter leading-none">Casillas Hub</h2>
        <div className="flex items-center gap-2">
           <div className="h-0.5 w-6 bg-[#eab308]/30"></div>
           <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">Inteligência Industrial Ativa</p>
        </div>
      </div>

      <div className="grid gap-4">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => navigate(tool.id as Screen)}
            className={`w-full p-5 rounded-[2.5rem] border flex items-center gap-5 transition-all active:scale-95 shadow-2xl relative overflow-hidden group ${tool.color}`}
          >
            <div className="size-16 rounded-3xl bg-black/40 flex items-center justify-center shrink-0 border border-white/5 shadow-inner overflow-hidden">
               <span className="material-symbols-outlined text-4xl block leading-none">
                 {tool.icon}
               </span>
            </div>
            
            <div className="flex-1 text-left min-w-0">
               <h3 className="font-black text-lg tracking-tight uppercase italic leading-none text-white group-hover:text-[#eab308] transition-colors truncate">
                 {tool.title}
               </h3>
               <p className="text-[10px] font-bold opacity-60 leading-tight uppercase tracking-widest mt-2 block">
                 {tool.desc}
               </p>
            </div>

            <div className="size-8 rounded-full bg-black/20 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity shrink-0">
               <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-[#1c1e22] p-5 rounded-[32px] border border-white/5 mt-2">
         <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-black/40 flex items-center justify-center text-[#eab308] shrink-0">
               <span className="material-symbols-outlined text-xl">security</span>
            </div>
            <p className="text-[9px] font-black text-gray-500 leading-tight uppercase tracking-[0.2em]">
              Processamento seguro via Google AI. Seus dados técnicos estão protegidos.
            </p>
         </div>
      </div>
    </div>
  );
};

export default AISuite;
