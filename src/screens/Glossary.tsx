import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Search, Book } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';

interface GlossaryProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const glossaryData = [
  { term: "Bedame", definition: "Ferramenta de corte estreita utilizada para abrir canais ou cortar peças no torno." },
  { term: "Castanha", definition: "Peça móvel da placa do torno que prende a peça a ser usinada." },
  { term: "Escarear", definition: "Operação de alargar a entrada de um furo em forma cônica para embutir a cabeça de um parafuso." },
  { term: "Mandril", definition: "Acessório utilizado para fixar brocas ou outras ferramentas de haste cilíndrica." },
  { term: "Moletear", definition: "Operação de criar ranhuras na superfície de uma peça para facilitar a aderência manual." },
  { term: "Placa", definition: "Dispositivo de fixação montado no eixo principal do torno." },
  { term: "Recartilhar", definition: "O mesmo que moletear." },
  { term: "Torneamento", definition: "Processo de usinagem que consiste em dar forma a uma peça que gira em torno de seu próprio eixo." },
];

const Glossary: React.FC<GlossaryProps> = ({ onBack, navigate, currentScreen }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = glossaryData.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Glossário Técnico</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="BUSCAR TERMO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold focus:border-[#eab308]/50 outline-none transition-all placeholder:text-gray-700 uppercase tracking-widest"
          />
        </div>

        <div className="space-y-4">
          {filtered.map((item, idx) => (
            <motion.div 
              key={item.term}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#141414] rounded-3xl border border-white/5 p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <Book size={14} className="text-[#eab308]" />
                <h3 className="text-white font-black italic text-sm uppercase tracking-tight">{item.term}</h3>
              </div>
              <p className="text-gray-500 text-[10px] font-bold leading-relaxed uppercase tracking-wider">
                {item.definition}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default Glossary;
