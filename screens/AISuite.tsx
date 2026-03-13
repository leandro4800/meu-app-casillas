
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
      title: t.drawing_analysis_title || "Análise de Desenho",
      desc: t.drawing_analysis_desc || "Interprete projetos offshore e sugestão de processos",
      icon: 'architecture',
      color: 'border-orange-500/30 text-orange-400 bg-orange-500/5'
    },
    {
      id: 'voice_consultant',
      title: t.voice_consultant_title || "Consultor por Voz",
      desc: t.voice_consultant_desc || "Suporte técnico hands-free em tempo real",
      icon: 'mic',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/5'
    },
    {
      id: 'media_lab',
      title: t.media_lab_title || "Laboratório Visual",
      desc: t.media_lab_desc || "Crie imagens e vídeos técnicos das suas ideias",
      icon: 'photo_camera',
      color: 'border-[#eab308]/30 text-[#eab308] bg-[#eab308]/5'
    },
    {
      id: 'consultant',
      title: t.consultant_title || "Engenheiro Casillas",
      desc: t.consultant_desc || "Consultoria sênior em usinagem e caldeiraria",
      icon: 'engineering',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
    }
  ];

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-500 h-full overflow-y-auto custom-scrollbar">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-[#eab308] italic uppercase tracking-tighter leading-none">Casillas Hub</h2>
        <div className="flex items-center gap-3">
           <div className="h-1 w-8 bg-[#eab308]/30"></div>
           <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">{t.active_industrial_intelligence || 'Inteligência Industrial Ativa'}</p>
        </div>
      </div>

      <div className="grid gap-6">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => navigate(tool.id as Screen)}
            className={`w-full p-6 rounded-[3rem] border-2 flex items-center gap-6 transition-all active:scale-95 shadow-2xl relative overflow-hidden group ${tool.color}`}
          >
            <div className="size-20 rounded-[2rem] bg-black/40 flex items-center justify-center shrink-0 border border-white/10 shadow-inner overflow-hidden">
               <span className="material-symbols-outlined text-5xl block leading-none">
                 {tool.icon}
               </span>
            </div>
            
            <div className="flex-1 text-left min-w-0">
               <h3 className="font-black text-2xl tracking-tight uppercase italic leading-none text-white group-hover:text-[#eab308] transition-colors truncate">
                 {tool.title}
               </h3>
               <p className="text-xs font-bold opacity-80 leading-tight uppercase tracking-widest mt-3 block">
                 {tool.desc}
               </p>
            </div>

            <div className="size-12 rounded-full bg-black/20 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
               <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-[#1c1e22] p-6 rounded-[40px] border border-white/10 mt-4">
         <div className="flex items-center gap-5">
            <div className="size-14 rounded-2xl bg-black/40 flex items-center justify-center text-[#eab308] shrink-0">
               <span className="material-symbols-outlined text-3xl">security</span>
            </div>
            <p className="text-xs font-black text-gray-400 leading-tight uppercase tracking-[0.15em]">
              {t.secure_processing_desc || 'Processamento seguro via Google AI. Seus dados técnicos estão protegidos.'}
            </p>
         </div>
      </div>
    </div>
  );
};

export default AISuite;
