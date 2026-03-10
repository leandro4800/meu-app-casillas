
import React, { useState, useMemo } from 'react';
import { GLOSSARY_TERMS } from '../constants';
import { Screen } from '../types';

interface GlossaryProps {
  navigate: (screen: Screen) => void;
}

interface Term {
  term: string;
  def: string;
  details?: string;
  cat: string;
  icon: string;
  color?: string;
  specs?: Record<string, string>;
}

const Glossary: React.FC<GlossaryProps> = ({ navigate }) => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [activeLetter, setActiveLetter] = useState('A');
  const [search, setSearch] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const categories = [
    { label: 'Todos', icon: 'apps' },
    { label: 'Processos', icon: 'settings' },
    { label: 'Ferramentas', icon: 'build' },
    { label: 'Metrologia', icon: 'architecture' }
  ];

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(item => {
      const matchesSearch = search === '' || 
        item.term.toLowerCase().includes(search.toLowerCase()) || 
        item.def.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = activeFilter === 'Todos' || item.cat === activeFilter;
      
      const normalizedTerm = item.term.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const matchesLetter = normalizedTerm.startsWith(activeLetter);

      if (search !== '') return matchesSearch && matchesCategory;
      return matchesLetter && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeFilter, activeLetter]);

  const hasTermsForLetter = (letter: string) => {
    return GLOSSARY_TERMS.some(t => {
      const norm = t.term.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return norm.startsWith(letter) && (activeFilter === 'Todos' || t.cat === activeFilter);
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#161412] overflow-hidden">
      {/* HEADER FIXO */}
      <div className="bg-[#1c1e22] border-b border-white/5 shadow-2xl z-20">
        <div className="p-4 flex items-center justify-between">
           <button 
             onClick={() => navigate('home')}
             className="size-10 rounded-full bg-[#121214] flex items-center justify-center text-[#eab308] border border-white/5 active:scale-90 transition-all"
           >
              <span className="material-symbols-outlined">arrow_back</span>
           </button>
           <h1 className="text-white font-black text-xs uppercase tracking-[0.2em] italic">Manual Técnico • Casillas</h1>
           <div className="size-10"></div> {/* Spacer */}
        </div>

        <div className="px-5 pb-4 space-y-4">
           <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#eab308] text-xl">search</span>
              <input 
                type="text" 
                placeholder="O que deseja executar ou consultar?" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#121214] border border-white/10 rounded-2xl h-14 pl-12 pr-12 text-sm text-white focus:ring-1 focus:ring-[#eab308] outline-none shadow-inner" 
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                   <span className="material-symbols-outlined">close</span>
                </button>
              )}
           </div>

           <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map(cat => (
                <button 
                  key={cat.label}
                  onClick={() => { setActiveFilter(cat.label); if(search) setSearch(''); }}
                  className={`flex items-center gap-2 whitespace-nowrap px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === cat.label ? 'bg-[#eab308] text-black border-[#eab308] shadow-lg shadow-[#eab308]/10' : 'bg-[#121214] text-gray-500 border-white/5'}`}
                >
                  <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO COM NAVEGAÇÃO LATERAL FIXA */}
      <div className="flex-1 flex overflow-hidden">
        {/* Alphabet Picker (Fixo na Esquerda) */}
        {!search && (
          <div className="w-14 bg-[#121214] border-r border-white/5 flex flex-col items-center py-4 overflow-y-auto no-scrollbar shrink-0">
            {alphabet.map(letter => {
              const active = hasTermsForLetter(letter);
              return (
                <button 
                  key={letter}
                  disabled={!active}
                  onClick={() => setActiveLetter(letter)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-[11px] font-black mb-1.5 transition-all ${
                    activeLetter === letter ? 'bg-[#eab308] text-black scale-110 shadow-lg' : 
                    active ? 'text-gray-400 hover:text-white' : 'text-gray-800 opacity-20'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        )}

        {/* Listagem (Rola independente) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-[#121214]/30">
           <div className="space-y-4 pb-40">
              <div className="flex items-center justify-between mb-2 px-1">
                 <h2 className="text-[#eab308] text-2xl font-black italic uppercase tracking-tighter">
                   {search ? 'Resultados Globais' : `Índice de Termos "${activeLetter}"`}
                 </h2>
                 <span className="text-[9px] font-black text-gray-600 bg-[#1c1e22] px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest">
                    {filteredTerms.length} Itens
                 </span>
              </div>

              {filteredTerms.length > 0 ? filteredTerms.map((t, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedTerm(t)}
                  className="w-full bg-[#1c1e22] rounded-[28px] p-5 border border-white/5 hover:border-[#eab308]/30 transition-all text-left shadow-xl group active:scale-[0.98] animate-in fade-in slide-in-from-bottom-2"
                >
                   <div className="flex items-center gap-5">
                      <div 
                        className="size-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner shrink-0 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${t.color}10`, color: t.color || '#eab308' }}
                      >
                         <span className="material-symbols-outlined text-2xl">{t.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between mb-1">
                            <h3 className="text-white font-black text-base tracking-tight uppercase italic group-hover:text-[#eab308] truncate">
                              {t.term}
                            </h3>
                            <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded border border-white/5 shrink-0">
                              {t.cat}
                            </span>
                         </div>
                         <p className="text-gray-500 text-[11px] font-bold leading-relaxed line-clamp-1 italic">
                            {t.def}
                         </p>
                      </div>
                   </div>
                </button>
              )) : (
                <div className="flex flex-col items-center justify-center py-24 opacity-20 text-center">
                   <span className="material-symbols-outlined text-8xl">inventory_2</span>
                   <p className="text-sm font-black uppercase tracking-[0.5em] mt-4">Nenhum termo técnico<br/>encontrado aqui</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* MODAL: FICHA TÉCNICA INDUSTRIAL */}
      {selectedTerm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedTerm(null)}></div>
           <div className="w-full max-w-sm bg-[#1c1e22] rounded-[40px] border border-[#eab308]/30 shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
              
              {/* Header do Modal */}
              <div 
                className="h-28 flex items-center justify-center relative shrink-0"
                style={{ backgroundColor: `${selectedTerm.color}20` }}
              >
                 <div 
                   className="size-16 rounded-[1.2rem] border-4 border-[#1c1e22] flex items-center justify-center shadow-2xl transition-transform hover:rotate-12"
                   style={{ backgroundColor: '#121214', color: selectedTerm.color || '#eab308' }}
                 >
                    <span className="material-symbols-outlined text-4xl">{selectedTerm.icon}</span>
                 </div>
                 <button 
                   onClick={() => setSelectedTerm(null)}
                   className="absolute top-4 right-4 size-10 rounded-full bg-black/40 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                 >
                    <span className="material-symbols-outlined text-xl">close</span>
                 </button>
              </div>

              {/* Corpo do Modal (Scrollable) */}
              <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                 <div className="text-center space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: selectedTerm.color }}>
                       Protocolo Casillas • {selectedTerm.cat}
                    </span>
                    <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter leading-none">
                       {selectedTerm.term}
                    </h2>
                 </div>

                 {/* Specs Rápidas */}
                 {selectedTerm.specs && (
                   <div className="grid grid-cols-2 gap-2">
                     {Object.entries(selectedTerm.specs).map(([key, val]) => (
                       <div key={key} className="bg-[#121214] border border-white/5 p-3 rounded-2xl flex flex-col items-center">
                         <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest mb-1">{key}</p>
                         <p className="text-[10px] text-white font-black uppercase truncate w-full text-center">{val}</p>
                       </div>
                     ))}
                   </div>
                 )}

                 <div className="space-y-4">
                    <div className="bg-[#121214] rounded-2xl p-5 border border-white/5 shadow-inner">
                       <h5 className="text-gray-600 text-[8px] font-black uppercase tracking-widest mb-2">Conceito Base</h5>
                       <p className="text-gray-300 text-sm font-bold leading-relaxed italic">
                          {selectedTerm.def}
                       </p>
                    </div>

                    {selectedTerm.details && (
                      <div className="bg-[#eab308]/5 rounded-3xl p-6 border border-[#eab308]/20 relative group">
                         <div className="absolute -top-3 left-6 bg-[#eab308] text-black px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                            Execução Ideal de Chão de Fábrica
                         </div>
                         <div className="pt-2 text-gray-200 text-xs font-bold italic leading-relaxed whitespace-pre-line">
                            {selectedTerm.details}
                         </div>
                      </div>
                    )}
                 </div>

                 {/* FUNÇÕES ÚTEIS ATIVAS */}
                 <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={() => { setSelectedTerm(null); navigate('machining_params'); }}
                      className="flex items-center justify-center gap-2 bg-[#121214] border border-white/10 text-white font-black py-4 rounded-2xl text-[9px] uppercase tracking-widest hover:bg-[#eab308] hover:text-black transition-all active:scale-95"
                    >
                       <span className="material-symbols-outlined text-base">calculate</span>
                       Calcular RPM
                    </button>
                    <button 
                      className="flex items-center justify-center gap-2 bg-[#121214] border border-white/10 text-white font-black py-4 rounded-2xl text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
                    >
                       <span className="material-symbols-outlined text-base text-[#eab308]">verified</span>
                       Specs ISO
                    </button>
                 </div>
              </div>

              {/* Rodapé do Modal */}
              <div className="p-6 bg-[#1c1e22] border-t border-white/5 shrink-0">
                 <button 
                   onClick={() => setSelectedTerm(null)}
                   className="w-full bg-[#eab308] text-black font-black py-5 rounded-[2rem] uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-[#eab308]/10 active:scale-95 transition-all"
                 >
                    Fechar Protocolo
                 </button>
              </div>
           </div>
        </div>
      )}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Glossary;
