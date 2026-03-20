import React from 'react';
import { motion } from 'motion/react';
import { Screen } from '../types';
import { ChevronLeft, Construction } from 'lucide-react';

interface ComingSoonProps {
  screen: Screen;
  onBack: () => void;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ screen, onBack }) => {
  const screenNames: Record<string, string> = {
    materials: 'Materiais',
    glossary: 'Glossário',
    conversion: 'Conversão',
    weight_calc: 'Cálculo de Peso',
    thread_tables: 'Tabelas de Roscas',
    tolerance_tables: 'Tabelas de Tolerância',
    micrometer: 'Simulador de Micrômetro',
    trigonometry: 'Trigonometria',
    gear_calc: 'Cálculo de Engrenagens',
    divider_calc: 'Cálculo de Divisor',
    arc_calc: 'Cálculo de Arcos',
    shackles: 'Manilhas e Cabos',
    drawing_analysis: 'Análise de Desenho',
    media_lab: 'Laboratório de Mídia',
    profile: 'Perfil do Usuário',
    checkout: 'Assinatura PRO',
    verifier: 'Verificador'
  };

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">
          {screenNames[screen] || 'Em breve'}
        </h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="size-32 rounded-[2.5rem] bg-[#141414] border border-[#eab308]/20 flex items-center justify-center mb-8 shadow-2xl"
        >
          <Construction size={56} className="text-[#eab308] opacity-40" />
        </motion.div>
        <h2 className="text-[#eab308] text-2xl font-black uppercase italic mb-4 tracking-tight">Módulo em Desenvolvimento</h2>
        <p className="text-gray-500 text-[11px] uppercase tracking-widest font-bold max-w-[260px] leading-relaxed">
          Estamos trabalhando para trazer esta funcionalidade na próxima atualização do Casillas Oficial.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
