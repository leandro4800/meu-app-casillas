import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, Table as TableIcon } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';
import { metricThreads, metricFineThreads, uncThreads } from '../data/threads';

interface ThreadTablesProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const ThreadTables: React.FC<ThreadTablesProps> = ({ onBack, navigate, currentScreen }) => {
  const [activeTab, setActiveTab] = useState<'metric' | 'metric_fine' | 'unc'>('metric');
  const [searchTerm, setSearchTerm] = useState('');

  const getThreads = () => {
    switch (activeTab) {
      case 'metric': return metricThreads;
      case 'metric_fine': return metricFineThreads;
      case 'unc': return uncThreads;
      default: return [];
    }
  };

  const filteredThreads = getThreads().filter(t => 
    t.nominal.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Tabelas de Roscas</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'metric', label: 'Métrica Grossa' },
            { id: 'metric_fine', label: 'Métrica Fina' },
            { id: 'unc', label: 'UNC (Polegada)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'metric' | 'metric_fine' | 'unc')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                activeTab === tab.id 
                  ? 'bg-[#eab308] text-black border-[#eab308]' 
                  : 'bg-white/5 text-gray-500 border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="BUSCAR ROSCA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold focus:border-[#eab308]/50 outline-none transition-all placeholder:text-gray-700 uppercase tracking-widest"
          />
        </div>

        <div className="bg-[#141414] rounded-[2rem] border border-white/5 overflow-hidden">
          <div className="grid grid-cols-4 p-4 border-b border-white/5 bg-white/[0.02]">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Nominal</span>
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest text-center">Passo/TPI</span>
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest text-center">Furo</span>
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest text-right">D. Maior</span>
          </div>
          
          <div className="divide-y divide-white/5">
            {filteredThreads.map((thread, idx) => (
              <motion.div 
                key={thread.nominal}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="grid grid-cols-4 p-4 items-center hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-xs font-black text-white italic">{thread.nominal}</span>
                <span className="text-[10px] font-bold text-gray-400 text-center">
                  {'pitch' in thread ? thread.pitch : thread.tpi}
                </span>
                <span className="text-[10px] font-black text-[#eab308] text-center">
                  {'tapDrill' in thread ? thread.tapDrill : ''}
                </span>
                <span className="text-[10px] font-bold text-gray-400 text-right">
                  {thread.majorDia.toFixed(2)}mm
                </span>
              </motion.div>
            ))}
            {filteredThreads.length === 0 && (
              <div className="p-12 text-center">
                <TableIcon size={32} className="mx-auto text-gray-700 mb-4 opacity-20" />
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Nenhuma rosca encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default ThreadTables;
