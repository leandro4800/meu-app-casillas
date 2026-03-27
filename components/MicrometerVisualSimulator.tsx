import React, { useState, useEffect } from 'react';
// Removidas dependências externas para compatibilidade

interface MicrometerVisualSimulatorProps {
  onClose: () => void;
}

const MicrometerVisualSimulator: React.FC<MicrometerVisualSimulatorProps> = ({ onClose }) => {
  const [value, setValue] = useState(0); // Valor em mm (0 a 25)
  const [isDragging, setIsDragging] = useState(false);

  // Cálculos das escalas
  const mainScale = Math.floor(value); // Traços de 1mm
  const halfScale = value % 1 >= 0.5; // Traço de 0.5mm
  const thimbleValue = Math.round((value % 0.5) * 100); // Centésimos (0 a 50)

  const handleRotate = (amount: number) => {
    setValue(prev => {
      const newValue = prev + amount;
      return Math.max(0, Math.min(25, newValue));
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
    >
      {/* Botão Fechar */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 size-12 bg-[#1c1e22] rounded-full flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      {/* Título */}
      <div className="text-center mb-12">
        <h2 className="text-[#eab308] text-2xl font-black uppercase italic tracking-tighter">Simulador de Precisão</h2>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Micrômetro Milesimal 0-25mm</p>
      </div>

      {/* Display Digital de Apoio */}
      <div className="bg-[#141414] border border-[#eab308]/20 rounded-3xl p-8 mb-12 shadow-2xl shadow-[#eab308]/5">
        <div className="text-center">
          <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em] mb-2">Leitura Real</p>
          <h1 className="text-[#eab308] text-6xl font-black italic tracking-tighter tabular-nums">
            {value.toFixed(3)}<span className="text-2xl ml-1">mm</span>
          </h1>
        </div>
      </div>

      {/* Representação Visual do Micrômetro */}
      <div className="relative w-full max-w-md h-48 flex items-center justify-center mb-16">
        {/* Bainha (Sleeve) */}
        <div className="w-48 h-16 bg-[#1c1e22] border-y border-white/10 relative flex items-center">
          {/* Linha de Referência */}
          <div className="absolute w-full h-[2px] bg-[#eab308]/40 top-1/2 -translate-y-1/2" />
          
          {/* Marcas da Escala Principal (Superior 1mm) */}
          <div className="absolute inset-0 flex items-start pt-2 px-4 justify-between">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-[2px] h-4 bg-gray-500" />
                <span className="text-[8px] text-gray-600 font-black mt-1">{mainScale + i}</span>
              </div>
            ))}
          </div>

          {/* Marcas da Escala de 0.5mm (Inferior) */}
          <div className="absolute inset-0 flex items-end pb-2 px-8 justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-[2px] h-3 bg-gray-700" />
            ))}
          </div>
        </div>

        {/* Tambor (Thimble) */}
        <div 
          className="w-32 h-24 bg-gradient-to-b from-[#252930] via-[#1c1e22] to-[#252930] border-l-4 border-[#eab308] rounded-r-xl relative overflow-hidden cursor-ns-resize"
        >
          {/* Recartilhado Visual */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />
          
          {/* Escala do Tambor */}
          <div className="absolute inset-0 flex flex-col items-end pr-4 justify-center gap-4">
            <span className="text-[10px] font-black text-gray-600">{thimbleValue + 5}</span>
            <div className="w-6 h-[2px] bg-[#eab308]" />
            <span className="text-xs font-black text-[#eab308]">{thimbleValue}</span>
            <div className="w-4 h-[1px] bg-gray-700" />
            <span className="text-[10px] font-black text-gray-600">{thimbleValue - 5}</span>
          </div>
        </div>
      </div>

      {/* Controles de Ajuste Fino */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="flex flex-col gap-2">
          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest text-center">Ajuste Grosso</p>
          <div className="flex gap-2">
            <button onClick={() => handleRotate(-0.5)} className="flex-1 bg-[#1c1e22] border border-white/5 py-4 rounded-2xl text-white font-black active:bg-[#eab308] active:text-black transition-all">-0.5</button>
            <button onClick={() => handleRotate(0.5)} className="flex-1 bg-[#1c1e22] border border-white/5 py-4 rounded-2xl text-white font-black active:bg-[#eab308] active:text-black transition-all">+0.5</button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest text-center">Ajuste Fino</p>
          <div className="flex gap-2">
            <button onClick={() => handleRotate(-0.01)} className="flex-1 bg-[#1c1e22] border border-white/5 py-4 rounded-2xl text-white font-black active:bg-[#eab308] active:text-black transition-all">-0.01</button>
            <button onClick={() => handleRotate(0.01)} className="flex-1 bg-[#1c1e22] border border-white/5 py-4 rounded-2xl text-white font-black active:bg-[#eab308] active:text-black transition-all">+0.01</button>
          </div>
        </div>
      </div>

      {/* Botão Reset */}
      <button 
        onClick={() => setValue(0)}
        className="mt-12 flex items-center gap-2 text-gray-600 hover:text-[#eab308] transition-colors"
      >
        <span className="material-symbols-outlined">restart_alt</span>
        <span className="text-[10px] font-black uppercase tracking-widest">Zerar Instrumento</span>
      </button>

      {/* Dica Técnica */}
      <div className="mt-auto mb-8 p-4 bg-[#eab308]/5 border border-[#eab308]/10 rounded-2xl flex items-center gap-3 max-w-xs">
        <span className="material-symbols-outlined text-[#eab308] text-base">info</span>
        <p className="text-[8px] text-gray-500 font-bold uppercase leading-relaxed">
          Lembre-se: No micrômetro real, cada volta completa do tambor equivale a 0,5mm na escala da bainha.
        </p>
      </div>
    </div>
  );
};

export default MicrometerVisualSimulator;
