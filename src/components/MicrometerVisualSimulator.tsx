import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { RotateCw, RotateCcw, Info } from 'lucide-react';

interface MicrometerVisualSimulatorProps {
  onClose: () => void;
}

const MicrometerVisualSimulator: React.FC<MicrometerVisualSimulatorProps> = ({ onClose }) => {
  const [value, setValue] = useState(0); // value in mm
  
  // 1 full rotation of thimble = 0.5mm
  // Thimble has 50 divisions (0.01mm each)
  
  const rotation = useMotionValue(0);
  const springRotation = useSpring(rotation, { stiffness: 300, damping: 30 });

  // Update value based on rotation
  useEffect(() => {
    const unsubscribe = rotation.on("change", (latest) => {
      // 360 degrees = 0.5mm
      const newValue = Math.max(0, (latest / 360) * 0.5);
      setValue(newValue);
    });
    return () => unsubscribe();
  }, [rotation]);

  const handleRotate = (delta: number) => {
    rotation.set(rotation.get() + delta);
  };

  const formatValue = (val: number) => {
    return val.toFixed(3);
  };

  // Calculate positions for scales
  const thimbleValue = (value % 0.5) * 100; // 0 to 50

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0908] flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-6 right-6">
        <button 
          onClick={onClose}
          className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full transition-all"
        >
          Fechar
        </button>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center gap-12">
        {/* Display */}
        <div className="text-center">
          <p className="text-[10px] font-black text-[#eab308] uppercase tracking-[0.4em] mb-4 italic">Medição em Tempo Real</p>
          <div className="bg-[#141414] border border-white/5 px-12 py-8 rounded-[3rem] shadow-2xl shadow-black/50">
            <h2 className="text-white text-7xl font-black italic tracking-tighter tabular-nums">
              {formatValue(value)}<span className="text-[#eab308] text-2xl ml-2">mm</span>
            </h2>
          </div>
        </div>

        {/* Micrometer Visual */}
        <div className="relative w-full h-64 flex items-center justify-center">
          {/* Sleeve (Fixed part) */}
          <div className="relative w-64 h-24 bg-gradient-to-b from-gray-400 to-gray-600 rounded-l-lg border-y border-l border-white/20 shadow-xl flex items-center justify-end pr-0 overflow-hidden">
            {/* Main Scale Lines */}
            <div className="absolute inset-0 flex items-center justify-end pr-2 overflow-hidden">
              <div 
                className="flex items-center gap-0 transition-transform duration-75"
                style={{ transform: `translateX(${-value * 80}px)` }}
              >
                {Array.from({ length: 51 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center w-[40px] shrink-0">
                    <div className="h-8 w-0.5 bg-black/40" />
                    <span className="text-[8px] font-black text-black/60 mt-1">{i/2}</span>
                    {i % 2 === 0 && (
                       <div className="h-4 w-0.5 bg-black/20 absolute top-1/2 mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Reference Line */}
            <div className="absolute right-0 w-full h-0.5 bg-[#eab308] z-10" />
          </div>

          {/* Thimble (Rotating part) */}
          <motion.div 
            className="relative w-40 h-32 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 rounded-lg border border-white/30 shadow-2xl z-20 cursor-grab active:cursor-grabbing flex items-center overflow-hidden"
            style={{ rotateX: springRotation }}
            drag="y"
            onDrag={(e, info) => {
              handleRotate(-info.delta.y * 2);
            }}
          >
            {/* Thimble Scale Lines */}
            <div className="absolute inset-0 flex flex-col justify-center">
              {Array.from({ length: 50 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-full flex items-center px-2"
                  style={{ 
                    transform: `translateY(${(i - (thimbleValue % 50)) * 4}px)`,
                    opacity: Math.max(0, 1 - Math.abs(i - (thimbleValue % 50)) / 10)
                  }}
                >
                  <div className="h-0.5 w-4 bg-black/40" />
                  <span className="text-[8px] font-black text-black/60 ml-2">{i}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Ratchet (Catraca) */}
          <div className="relative w-24 h-20 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-r-2xl border-y border-r border-white/10 shadow-xl flex items-center justify-center">
             <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <button 
                  onMouseDown={() => {
                    const interval = setInterval(() => handleRotate(1), 10);
                    const up = () => { clearInterval(interval); window.removeEventListener('mouseup', up); };
                    window.addEventListener('mouseup', up);
                  }}
                  className="size-12 rounded-full bg-white/5 hover:bg-[#eab308] hover:text-black text-[#eab308] flex items-center justify-center transition-all active:scale-90"
                >
                  <RotateCw size={20} />
                </button>
                <button 
                  onMouseDown={() => {
                    const interval = setInterval(() => handleRotate(-1), 10);
                    const up = () => { clearInterval(interval); window.removeEventListener('mouseup', up); };
                    window.addEventListener('mouseup', up);
                  }}
                  className="size-12 rounded-full bg-white/5 hover:bg-[#eab308] hover:text-black text-[#eab308] flex items-center justify-center transition-all active:scale-90"
                >
                  <RotateCcw size={20} />
                </button>
             </div>
             <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-12 bg-[#eab308] rounded-r-lg opacity-50 blur-sm" />
          </div>
        </div>

        {/* Controls & Info */}
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={() => rotation.set(0)}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Zerar
            </button>
            <div className="flex-1 bg-[#eab308]/10 border border-[#eab308]/20 py-4 rounded-2xl text-[#eab308] text-center">
               <p className="text-[8px] font-black uppercase tracking-widest mb-1">Passo</p>
               <p className="text-xs font-black italic">0.5mm / volta</p>
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex gap-4">
            <Info size={20} className="text-[#eab308] shrink-0" />
            <p className="text-gray-400 text-[9px] font-bold leading-relaxed uppercase tracking-wider">
              Arraste o tambor para cima ou para baixo para girar, ou use os botões da catraca para um ajuste fino. Cada volta completa no tambor desloca 0.5mm na escala principal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicrometerVisualSimulator;
