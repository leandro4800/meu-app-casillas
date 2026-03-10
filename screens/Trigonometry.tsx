
import React, { useState, useMemo } from 'react';

type SubModule = 'triangle' | 'circle' | 'polygons';

const Trigonometry: React.FC = () => {
  const [subModule, setSubModule] = useState<SubModule>('triangle');
  const [showToast, setShowToast] = useState(false);

  // Triangle States
  const [angle, setAngle] = useState('45');
  const [hypo, setHypo] = useState('100');

  // Circle States
  const [radius, setRadius] = useState('50');
  const [centralAngle, setCentralAngle] = useState('90');

  // Polygon States
  const [polySides, setPolySides] = useState<5 | 6>(6);
  const [polyDim, setPolyDim] = useState('24');

  const triangleResults = useMemo(() => {
    const a = parseFloat(angle);
    const h = parseFloat(hypo);
    if (isNaN(a) || isNaN(h)) return { sin: 0, cos: 0, tan: 0, beta: 0, perimeter: 0, h: 0, o: 0, adj: 0 };

    const rad = (a * Math.PI) / 180;
    const o = h * Math.sin(rad);
    const adj = h * Math.cos(rad);
    
    return {
      o,
      adj,
      h,
      sin: Math.sin(rad),
      cos: Math.cos(rad),
      tan: Math.tan(rad),
      beta: 90 - a,
      perimeter: h + o + adj
    };
  }, [angle, hypo]);

  const circleResults = useMemo(() => {
    const r = parseFloat(radius) || 0;
    const ang = parseFloat(centralAngle) || 0;
    const rad = (ang * Math.PI) / 180;

    return {
      chord: 2 * r * Math.sin(rad / 2),
      arc: r * rad,
      flecha: r * (1 - Math.cos(rad / 2))
    };
  }, [radius, centralAngle]);

  const polyResults = useMemo(() => {
    const d = parseFloat(polyDim) || 0;
    if (polySides === 6) {
      return {
        vertice: d / Math.cos((30 * Math.PI) / 180),
        side: d * Math.tan((30 * Math.PI) / 180)
      };
    } else {
      return {
        vertice: d / Math.cos((36 * Math.PI) / 180),
        side: d * Math.tan((36 * Math.PI) / 180)
      };
    }
  }, [polySides, polyDim]);

  const formatReport = () => {
    let text = `*CASILLAS - TRIGONOMETRIA*\n\n`;
    if (subModule === 'triangle') {
      text += `*Triângulo Retângulo*\nAng: ${angle}° | Hyp: ${hypo}mm\nCat. Oposto: ${triangleResults.o.toFixed(2)}mm\nCat. Adj: ${triangleResults.adj.toFixed(2)}mm`;
    } else if (subModule === 'circle') {
      text += `*Segmentos Circulares*\nRaio: ${radius}mm | Ang: ${centralAngle}°\nCorda: ${circleResults.chord.toFixed(2)}mm\nArco: ${circleResults.arc.toFixed(2)}mm`;
    } else {
      text += `*Polígonos (${polySides} faces)*\nFace: ${polyDim}mm\nØ Vértice: ${polyResults.vertice.toFixed(2)}mm`;
    }
    return text + `\n\n_Gerado via Casillas Digital_`;
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(formatReport())}`, '_blank');
  const shareEmail = () => window.location.href = `mailto:?subject=Cálculo Trigonométrico&body=${encodeURIComponent(formatReport())}`;
  
  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem('casillas_history') || '[]');
    history.unshift({ date: new Date().toISOString(), type: 'Trigonometria', report: formatReport() });
    localStorage.setItem('casillas_history', JSON.stringify(history.slice(0, 50)));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#161412] text-white relative">
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#eab308] text-black px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-2xl animate-bounce">
           Salvo com Sucesso!
        </div>
      )}

      {/* Selector Sub-Módulo */}
      <div className="p-4 bg-[#221e1b] border-b border-white/5 shrink-0">
        <div className="flex bg-[#161412] p-1 rounded-2xl border border-white/5">
          {[
            { id: 'triangle', icon: 'architecture', label: 'Triângulo' },
            { id: 'circle', icon: 'radio_button_unchecked', label: 'Círculo' },
            { id: 'polygons', icon: 'hexagon', label: 'Polígonos' }
          ].map(m => (
            <button 
              key={m.id}
              onClick={() => setSubModule(m.id as SubModule)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${subModule === m.id ? 'bg-[#eab308] text-black shadow-lg' : 'text-gray-500'}`}
            >
              <span className="material-symbols-outlined text-xl">{m.icon}</span>
              <span className="text-[9px] font-black uppercase tracking-tighter">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-32">
        {/* Diagram Area: Redesenhada para Estilo Técnico */}
        <div className="bg-[#12100e] rounded-3xl h-64 border border-white/5 relative overflow-hidden flex items-center justify-center shadow-inner">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="trig-grid-new" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#eab308" strokeWidth="0.5"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#trig-grid-new)" />
              </svg>
            </div>
            
            <div className="relative w-full h-full flex items-center justify-center">
              {subModule === 'triangle' && (
                <svg viewBox="0 0 200 150" className="w-48 h-48 drop-shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                  {/* Triângulo Principal */}
                  <path d="M 40 110 L 160 110 L 40 30 Z" fill="none" stroke="#eab308" strokeWidth="3" strokeLinejoin="round" />
                  {/* Linhas de Cota Cateto Adj */}
                  <line x1="40" y1="120" x2="160" y2="120" stroke="#eab308" strokeWidth="0.5" opacity="0.4" />
                  <path d="M 40 118 L 40 122 M 160 118 L 160 122" stroke="#eab308" strokeWidth="1" />
                  <text x="100" y="135" fill="#eab308" fontSize="10" textAnchor="middle" fontWeight="900" opacity="0.6">ADJ</text>
                  {/* Linhas de Cota Cateto Op */}
                  <line x1="30" y1="110" x2="30" y2="30" stroke="#eab308" strokeWidth="0.5" opacity="0.4" />
                  <text x="15" y="75" fill="#eab308" fontSize="10" textAnchor="middle" fontWeight="900" opacity="0.6" transform="rotate(-90, 15, 75)">OP</text>
                  {/* Ângulo Alfa */}
                  <path d="M 140 110 A 20 20 0 0 0 148 102" fill="none" stroke="#eab308" strokeWidth="1.5" />
                  <text x="135" y="105" fill="#eab308" fontSize="12" fontWeight="bold">α</text>
                </svg>
              )}
              {subModule === 'circle' && (
                <svg viewBox="0 0 200 200" className="w-48 h-48">
                  {/* Círculo Base */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(234,179,8,0.1)" strokeWidth="1" strokeDasharray="4 2" />
                  {/* Eixos de Centro */}
                  <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(234,179,8,0.2)" strokeWidth="0.5" strokeDasharray="10 2 2 2" />
                  <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(234,179,8,0.2)" strokeWidth="0.5" strokeDasharray="10 2 2 2" />
                  {/* Arco e Corda */}
                  <path d="M 50 50 A 70 70 0 0 1 150 50" fill="none" stroke="#eab308" strokeWidth="3" />
                  <line x1="50" y1="50" x2="150" y2="50" stroke="#eab308" strokeWidth="1.5" strokeDasharray="2" opacity="0.6" />
                  {/* Labels Técnicos */}
                  <text x="100" y="40" fill="#eab308" fontSize="10" textAnchor="middle" fontWeight="900">ARCO (l)</text>
                  <text x="100" y="65" fill="#eab308" fontSize="9" textAnchor="middle" fontWeight="bold" opacity="0.5">CORDA (c)</text>
                  {/* Linha de Raio */}
                  <line x1="100" y1="100" x2="150" y2="50" stroke="#eab308" strokeWidth="1" opacity="0.4" />
                  <text x="135" y="85" fill="#eab308" fontSize="10" fontWeight="900">R</text>
                </svg>
              )}
              {subModule === 'polygons' && (
                <svg viewBox="0 0 200 200" className="w-48 h-48">
                  {/* Círculo Circunscrito (Vértices) */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(234,179,8,0.05)" strokeWidth="1" />
                  {/* Polígono */}
                  <path 
                    d={polySides === 6 
                      ? "M 100 30 L 160.6 65 L 160.6 135 L 100 170 L 39.4 135 L 39.4 65 Z" 
                      : "M 100 30 L 166.6 78.4 L 141.2 156.6 L 58.8 156.6 L 33.4 78.4 Z"} 
                    fill="none" stroke="#eab308" strokeWidth="3" strokeLinejoin="round" 
                  />
                  {/* Linha de Cota Face-a-Face */}
                  <line x1="39.4" y1="185" x2="160.6" y2="185" stroke="#eab308" strokeWidth="0.5" opacity="0.4" />
                  <path d="M 39.4 182 L 39.4 188 M 160.6 182 L 160.6 188" stroke="#eab308" strokeWidth="1" opacity="0.6" />
                  <text x="100" y="195" fill="#eab308" fontSize="9" textAnchor="middle" fontWeight="900">MEDIDA ENTRE FACES</text>
                  {/* Indicação de Vértice */}
                  <line x1="100" y1="100" x2="160.6" y2="135" stroke="#eab308" strokeWidth="1" strokeDasharray="2" opacity="0.3" />
                  <text x="130" y="125" fill="#eab308" fontSize="8" fontWeight="bold" opacity="0.5">Ø VÉRTICE</text>
                </svg>
              )}
            </div>
            <p className="absolute bottom-3 right-4 text-[8px] font-black text-gray-800 uppercase tracking-widest">DETALHE TÉCNICO V1.2</p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          {subModule === 'triangle' && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Ângulo (α)</label>
                <div className="relative">
                  <input type="number" value={angle} onChange={e => setAngle(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-16 px-5 text-white font-mono text-xl outline-none focus:border-[#eab308]/50" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#eab308] font-black text-lg">°</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Hipotenusa (H)</label>
                <div className="relative">
                  <input type="number" value={hypo} onChange={e => setHypo(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-16 px-5 text-white font-mono text-xl outline-none focus:border-[#eab308]/50" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-black text-xs">MM</span>
                </div>
              </div>
            </>
          )}
          {subModule === 'circle' && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Raio (R)</label>
                <input type="number" value={radius} onChange={e => setRadius(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-16 px-5 text-white font-mono text-xl outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Ângulo (°)</label>
                <input type="number" value={centralAngle} onChange={e => setCentralAngle(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-16 px-5 text-white font-mono text-xl outline-none" />
              </div>
            </>
          )}
          {subModule === 'polygons' && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Lados</label>
                <select value={polySides} onChange={e => setPolySides(Number(e.target.value) as 5 | 6)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-16 px-4 text-[#eab308] font-black outline-none appearance-none">
                   <option value={6}>Sextavado (6)</option>
                   <option value={5}>Pentágono (5)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Entre Faces</label>
                <input type="number" value={polyDim} onChange={e => setPolyDim(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-16 px-5 text-white font-mono text-xl outline-none" />
              </div>
            </>
          )}
        </div>

        {/* Results Cards */}
        <div className="space-y-4">
           {subModule === 'triangle' && (
             <>
               <div className="bg-[#221e1b] rounded-3xl p-6 border-l-4 border-[#eab308] shadow-xl">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Cateto Oposto (Altura)</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-5xl font-black text-white tabular-nums">{triangleResults.o.toFixed(2)}</span>
                    <span className="text-xl font-bold text-gray-600">mm</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#221e1b] p-4 rounded-2xl border border-white/5">
                     <p className="text-[9px] font-black text-gray-500 uppercase">Cat. Adjacente</p>
                     <p className="text-xl font-black text-white mt-1">{triangleResults.adj.toFixed(2)} mm</p>
                  </div>
                  <div className="bg-[#221e1b] p-4 rounded-2xl border border-white/5">
                     <p className="text-[9px] font-black text-gray-500 uppercase">Ângulo Complementar</p>
                     <p className="text-xl font-black text-[#eab308] mt-1">{triangleResults.beta.toFixed(2)}°</p>
                  </div>
               </div>
             </>
           )}

           {subModule === 'circle' && (
             <div className="bg-[#221e1b] rounded-3xl p-6 border-l-4 border-[#eab308] shadow-xl space-y-6">
                <div>
                   <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Comprimento da Corda (C)</p>
                   <p className="text-4xl font-black text-white mt-1">{circleResults.chord.toFixed(3)} mm</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                   <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase">Arco (l)</p>
                      <p className="text-lg font-black text-white">{circleResults.arc.toFixed(2)} mm</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase">Flecha (f)</p>
                      <p className="text-lg font-black text-white">{circleResults.flecha.toFixed(2)} mm</p>
                   </div>
                </div>
             </div>
           )}

           {subModule === 'polygons' && (
             <div className="bg-[#221e1b] rounded-3xl p-6 border-l-4 border-[#eab308] shadow-xl">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Diâmetro nos Vértices (Ø Máx)</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black text-white tabular-nums">{polyResults.vertice.toFixed(3)}</span>
                  <span className="text-xl font-bold text-gray-600">mm</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                   <p className="text-[9px] font-black text-gray-500 uppercase">Lado do Polígono</p>
                   <p className="text-2xl font-black text-[#eab308]">{polyResults.side.toFixed(3)} mm</p>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-40 bg-[#161412]/80 backdrop-blur-md p-2 rounded-2xl border border-white/5 shadow-2xl">
         <button onClick={shareWhatsApp} className="size-12 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-xl active:scale-95 transition-all shrink-0">
            <span className="material-symbols-outlined text-xl">chat</span>
         </button>
         <button onClick={shareEmail} className="size-12 bg-white/10 text-gray-300 rounded-xl border border-white/5 flex items-center justify-center shadow-xl active:scale-95 transition-all shrink-0">
            <span className="material-symbols-outlined text-xl">mail</span>
         </button>
         <button onClick={handleSave} className="flex-1 bg-[#eab308] text-black font-black py-3 rounded-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-[11px] tracking-widest">
            <span className="material-symbols-outlined text-lg">save</span> SALVAR
         </button>
      </div>
    </div>
  );
};

export default Trigonometry;
