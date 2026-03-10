
import React, { useState } from 'react';
import { ToolInsert } from '../types';

interface ToolLibraryProps {
  tools: ToolInsert[];
  isAdmin: boolean;
  onSelectTool: (tool: ToolInsert) => void;
  onAddTool: () => void;
  t: any;
}

const ToolLibrary: React.FC<ToolLibraryProps> = ({ tools, isAdmin, onSelectTool, onAddTool, t }) => {
  const [selectedOperation, setSelectedOperation] = useState<ToolInsert['category'] | null>(null);
  const [search, setSearch] = useState('');
  const [activeIso, setActiveIso] = useState<string | null>(null);

  const isoFilters = [
    { label: 'ISO P', color: 'bg-blue-600', code: 'P' },
    { label: 'ISO M', color: 'bg-yellow-500', code: 'M' },
    { label: 'ISO K', color: 'bg-red-600', code: 'K' },
    { label: 'ISO S', color: 'bg-orange-500', code: 'S' },
    { label: 'ISO N', color: 'bg-green-600', code: 'N' },
    { label: 'ISO H', color: 'bg-gray-600', code: 'H' }
  ];

  const operations = [
    { 
      id: 'Fresamento', 
      icon: 'refresh', 
      label: 'FRESAMENTO', 
      desc: 'MF80, CoroMill 390/490, 210, 495, Plura WhisperKut™', 
      color: 'from-[#eab308] to-[#facc15]' 
    },
    { 
      id: 'Torneamento', 
      icon: 'settings_backup_restore', 
      label: 'TORNEAMENTO', 
      desc: 'Interno, Externo, Suportes e Silent Tools™', 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      id: 'Furação', 
      icon: 'vibration', 
      label: 'FURAÇÃO & MACHOS', 
      desc: 'CoroDrill 860/870/880 e Machos CoroTap 300', 
      color: 'from-emerald-500 to-emerald-600' 
    },
    { 
      id: 'Cortes/Roscas', 
      icon: 'content_cut', 
      label: 'CORTES & ROSCAS', 
      desc: 'Bedame CoroCut 2 e Roscas CoroThread 266', 
      color: 'from-red-500 to-red-600' 
    }
  ];

  const filteredTools = tools.filter(tool => 
    (!selectedOperation || tool.category === selectedOperation) && 
    (search === '' || tool.code.toLowerCase().includes(search.toLowerCase())) &&
    (!activeIso || tool.isoCategories.includes(activeIso))
  );

  // TELA 1: HUB DE SELEÇÃO DE OPERAÇÃO
  if (!selectedOperation) {
    return (
      <div className="flex flex-col min-h-full bg-[#1c1e22] p-6 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
           <h2 className="text-[#eab308] text-3xl font-black uppercase italic tracking-tight leading-none">BIBLIOTECA TÉCNICA</h2>
           <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-8 h-px bg-gray-800"></span>
              ESCOLHA A OPERAÇÃO
           </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
           {operations.map(op => (
             <button
               key={op.id}
               onClick={() => setSelectedOperation(op.id as any)}
               className="bg-[#252930] rounded-[32px] p-6 border border-white/5 flex items-center gap-6 text-left hover:border-[#eab308]/30 transition-all shadow-xl group active:scale-[0.98] relative overflow-hidden"
             >
                <div className={`absolute top-0 right-0 w-32 h-full bg-gradient-to-l ${op.color} opacity-[0.03]`}></div>
                <div className="size-16 rounded-2xl bg-[#121214] flex items-center justify-center text-[#eab308] group-hover:bg-[#eab308] group-hover:text-black transition-all shadow-inner border border-white/5">
                   <span className="material-symbols-outlined text-3xl">{op.icon}</span>
                </div>
                <div className="flex-1 relative z-10">
                   <h3 className="text-white font-black text-lg tracking-tight uppercase group-hover:text-[#eab308] transition-colors">{op.label}</h3>
                   <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1.5 leading-relaxed">{op.desc}</p>
                </div>
                <span className="material-symbols-outlined text-gray-700 group-hover:text-[#eab308] transition-all">chevron_right</span>
             </button>
           ))}
        </div>

        <div className="pt-10 flex flex-col items-center">
           <div className="flex items-center gap-4 opacity-10">
              <span className="material-symbols-outlined text-5xl">precision_manufacturing</span>
              <span className="material-symbols-outlined text-5xl">engineering</span>
           </div>
           <p className="text-[8px] font-black text-gray-800 uppercase tracking-[0.4em] mt-6">CASILLAS INDUSTRIAL SYSTEMS</p>
        </div>
      </div>
    );
  }

  // TELA 2: LISTAGEM DETALHADA POR OPERAÇÃO
  return (
    <div className="flex flex-col min-h-full bg-[#1c1e22] relative animate-in slide-in-from-right duration-500">
      {/* Header Fixo da Categoria */}
      <div className="p-4 space-y-6 sticky top-0 bg-[#1c1e22]/95 backdrop-blur-xl z-30 border-b border-white/5 pb-6">
        <div className="flex justify-between items-center">
           <button 
             onClick={() => setSelectedOperation(null)}
             className="flex items-center gap-2 text-gray-500 hover:text-[#eab308] transition-colors bg-white/5 px-4 py-2 rounded-full"
           >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="text-[9px] font-black uppercase tracking-widest">VOLTAR</span>
           </button>
           <span className="text-[#eab308] text-[10px] font-black uppercase tracking-widest bg-[#eab308]/10 px-3 py-1.5 rounded-full border border-[#eab308]/20 shadow-lg shadow-[#eab308]/5">{selectedOperation}</span>
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
          <input 
            type="text" 
            placeholder={`Buscar em ${selectedOperation}...`} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121214] border border-white/5 rounded-2xl h-14 pl-12 pr-12 text-sm text-white focus:ring-1 focus:ring-[#eab308] outline-none shadow-inner transition-all focus:border-[#eab308]/50" 
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
           {isoFilters.map(iso => (
             <button 
               key={iso.code}
               onClick={() => setActiveIso(activeIso === iso.code ? null : iso.code)}
               className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                 activeIso === iso.code ? 'bg-[#252930] text-white border-[#eab308] shadow-lg shadow-black/20' : 'bg-[#121214] text-gray-500 border-white/5 hover:border-white/10'
               }`}
             >
                <div className={`size-2 rounded-full ${iso.color} shadow-sm`}></div>
                {iso.label}
             </button>
           ))}
        </div>
      </div>

      {/* Lista Contínua Integrada ao Scroll da Tela */}
      <div className="px-4 space-y-4 py-6 pb-40">
         <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-4 bg-[#eab308] rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
               <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">CATÁLOGO DE {selectedOperation}</h3>
            </div>
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{filteredTools.length} ITENS</span>
         </div>

         {filteredTools.length > 0 ? (
           filteredTools.map(tool => (
             <button 
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="w-full bg-[#252930] rounded-[32px] p-5 border border-white/5 flex items-center gap-5 hover:border-[#eab308]/30 transition-all text-left shadow-xl group relative overflow-hidden active:scale-95"
             >
                <div className="size-20 bg-[#121214] rounded-2xl flex items-center justify-center shrink-0 border border-white/5 overflow-hidden shadow-inner group-hover:border-[#eab308]/20 transition-all">
                   <img src={tool.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-110" alt="" />
                </div>
                <div className="flex-1 space-y-2 relative z-10 overflow-hidden">
                   <h4 className="text-white font-black text-sm tracking-tight leading-tight group-hover:text-[#eab308] transition-colors uppercase italic line-clamp-2">{tool.code}</h4>
                   <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex flex-wrap items-center gap-2">
                     <span className="text-[#eab308]">{tool.grade}</span> 
                     <span className="opacity-30">•</span> 
                     <span className="opacity-60">{tool.geometry.split(' ')[0]}</span>
                   </p>
                   <div className="flex gap-1.5 mt-1">
                      {tool.isoCategories.map(cat => {
                        const iso = isoFilters.find(f => f.code === cat);
                        return (
                          <span key={cat} className={`text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm text-white ${iso?.color || 'bg-gray-700'}`}>
                            {cat}
                          </span>
                        );
                      })}
                   </div>
                </div>
                <span className="material-symbols-outlined text-gray-700 group-hover:text-[#eab308] transition-all group-hover:translate-x-1">chevron_right</span>
             </button>
           ))
         ) : (
           <div className="text-center py-20 space-y-4">
              <span className="material-symbols-outlined text-gray-800 text-5xl opacity-20">inventory_2</span>
              <p className="text-gray-500 font-black uppercase text-xs tracking-widest">NENHUMA FERRAMENTA ENCONTRADA</p>
           </div>
         )}
      </div>

      {isAdmin && (
        <button 
          onClick={onAddTool}
          className="fixed bottom-28 right-6 size-16 bg-[#eab308] text-black rounded-full flex items-center justify-center shadow-2xl shadow-[#eab308]/40 hover:scale-110 active:scale-90 transition-all z-40 border-4 border-[#1c1e22]"
        >
          <span className="material-symbols-outlined text-4xl font-bold">add</span>
        </button>
      )}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ToolLibrary;
