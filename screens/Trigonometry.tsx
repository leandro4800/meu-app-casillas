
import React, { useState, useMemo } from 'react';

type SubModule = 'triangle' | 'circle' | 'polygons' | 'functions';
type TriangleMode = 'angle_hypo' | 'catheti' | 'cat_hypo';

const Trigonometry: React.FC = () => {
  const [subModule, setSubModule] = useState<SubModule>('triangle');
  const [triangleMode, setTriangleMode] = useState<TriangleMode>('angle_hypo');
  const [showToast, setShowToast] = useState(false);

  // Triangle States
  const [angle, setAngle] = useState('45');
  const [hypo, setHypo] = useState('100');
  const [catA, setCatA] = useState('70.71');
  const [catB, setCatB] = useState('70.71');

  // Circle States
  const [radius, setRadius] = useState('50');
  const [centralAngle, setCentralAngle] = useState('90');

  // Polygon States
  const [polySides, setPolySides] = useState<5 | 6>(6);
  const [polyDim, setPolyDim] = useState('24');

  // Function States
  const [funcType, setFuncType] = useState<'sin' | 'cos' | 'tan'>('sin');
  const [funcAngle, setFuncAngle] = useState('30');
  const [funcValue, setFuncValue] = useState('50');

  const triangleResults = useMemo(() => {
    let a = parseFloat(angle);
    let h = parseFloat(hypo);
    let o = 0;
    let adj = 0;

    if (triangleMode === 'angle_hypo') {
      if (isNaN(a) || isNaN(h)) return { sin: 0, cos: 0, tan: 0, beta: 0, perimeter: 0, h: 0, o: 0, adj: 0 };
      const rad = (a * Math.PI) / 180;
      o = h * Math.sin(rad);
      adj = h * Math.cos(rad);
    } else if (triangleMode === 'catheti') {
      const ca = parseFloat(catA);
      const cb = parseFloat(catB);
      if (isNaN(ca) || isNaN(cb)) return { sin: 0, cos: 0, tan: 0, beta: 0, perimeter: 0, h: 0, o: 0, adj: 0 };
      h = Math.sqrt(ca * ca + cb * cb);
      a = (Math.atan2(ca, cb) * 180) / Math.PI;
      o = ca;
      adj = cb;
    } else if (triangleMode === 'cat_hypo') {
      const ca = parseFloat(catA);
      if (isNaN(ca) || isNaN(h) || ca >= h) return { sin: 0, cos: 0, tan: 0, beta: 0, perimeter: 0, h: 0, o: 0, adj: 0 };
      adj = Math.sqrt(h * h - ca * ca);
      a = (Math.asin(ca / h) * 180) / Math.PI;
      o = ca;
    }

    const rad = (a * Math.PI) / 180;
    
    return {
      o,
      adj,
      h,
      sin: Math.sin(rad),
      cos: Math.cos(rad),
      tan: Math.tan(rad),
      beta: 90 - a,
      perimeter: h + o + adj,
      angle: a
    };
  }, [angle, hypo, catA, catB, triangleMode]);

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

  const funcResults = useMemo(() => {
    const a = parseFloat(funcAngle) || 0;
    const v = parseFloat(funcValue) || 0;
    const rad = (a * Math.PI) / 180;
    
    let res = 0;
    let factor = 0;
    if (funcType === 'sin') {
      factor = Math.sin(rad);
      res = factor * v;
    } else if (funcType === 'cos') {
      factor = Math.cos(rad);
      res = factor * v;
    } else {
      factor = Math.tan(rad);
      res = factor * v;
    }

    return { result: res, factor };
  }, [funcType, funcAngle, funcValue]);

  const formatReport = () => {
    let text = `*CASILLAS - TRIGONOMETRIA*\n\n`;
    if (subModule === 'triangle') {
      text += `*Triângulo Retângulo*\n`;
      if (triangleMode === 'angle_hypo') text += `Entrada: Ang ${angle}° | Hyp ${hypo}mm\n`;
      else if (triangleMode === 'catheti') text += `Entrada: Cat.O ${catA}mm | Cat.A ${catB}mm\n`;
      else text += `Entrada: Cat.O ${catA}mm | Hyp ${hypo}mm\n`;
      
      text += `Ang. Alfa: ${triangleResults.angle.toFixed(2)}°\n`;
      text += `Hipotenusa: ${triangleResults.h.toFixed(2)}mm\n`;
      text += `Cat. Oposto: ${triangleResults.o.toFixed(2)}mm\n`;
      text += `Cat. Adjacente: ${triangleResults.adj.toFixed(2)}mm`;
    } else if (subModule === 'circle') {
      text += `*Segmentos Circulares*\nRaio: ${radius}mm | Ang: ${centralAngle}°\nCorda: ${circleResults.chord.toFixed(2)}mm\nArco: ${circleResults.arc.toFixed(2)}mm`;
    } else if (subModule === 'polygons') {
      text += `*Polígonos (${polySides} faces)*\nFace: ${polyDim}mm\nØ Vértice: ${polyResults.vertice.toFixed(2)}mm`;
    } else {
      text += `*Funções Rápidas*\n${funcType.toUpperCase()}(${funcAngle}°) x ${funcValue} = ${funcResults.result.toFixed(4)}`;
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
            { id: 'polygons', icon: 'hexagon', label: 'Polígonos' },
            { id: 'functions', icon: 'calculate', label: 'Funções' }
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

      <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar pb-32">
        {/* Diagram Area: Redesenhada para Estilo Técnico */}
        <div className="bg-[#12100e] rounded-[2.5rem] h-80 border border-white/10 relative overflow-hidden flex items-center justify-center shadow-2xl">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="trig-grid-new" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#eab308" strokeWidth="0.5"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#trig-grid-new)" />
              </svg>
            </div>
            
            <div className="relative w-full h-full flex items-center justify-center scale-110">
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
              {subModule === 'functions' && (
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#eab308] text-black px-4 py-2 rounded-xl font-black text-xl uppercase italic">
                      {funcType}
                    </div>
                    <span className="text-white font-black text-2xl">({funcAngle}°)</span>
                    <span className="text-gray-600 font-black text-2xl">×</span>
                    <span className="text-white font-black text-2xl">{funcValue}</span>
                  </div>
                  <div className="h-px w-32 bg-white/10"></div>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Resultado Final</p>
                    <p className="text-[#eab308] text-4xl font-black tabular-nums">{funcResults.result.toFixed(4)}</p>
                  </div>
                </div>
              )}
            </div>
            <p className="absolute bottom-3 right-4 text-[8px] font-black text-gray-800 uppercase tracking-widest">DETALHE TÉCNICO V1.2</p>
        </div>

        {/* Inputs */}
        <div className="space-y-8">
          {subModule === 'triangle' && (
            <>
              <div className="flex bg-[#221e1b] p-1.5 rounded-2xl border border-white/10">
                {[
                  { id: 'angle_hypo', label: 'Ang + Hyp' },
                  { id: 'catheti', label: '2 Catetos' },
                  { id: 'cat_hypo', label: 'Cat + Hyp' }
                ].map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setTriangleMode(m.id as TriangleMode)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${triangleMode === m.id ? 'bg-[#eab308] text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {triangleMode === 'angle_hypo' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Ângulo (α)</label>
                      <div className="relative">
                        <input type="number" value={angle} onChange={e => setAngle(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-20 px-6 text-white font-mono text-3xl outline-none focus:border-[#eab308]/50" />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[#eab308] font-black text-2xl">°</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Hipotenusa (H)</label>
                      <div className="relative">
                        <input type="number" value={hypo} onChange={e => setHypo(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-20 px-6 text-white font-mono text-3xl outline-none focus:border-[#eab308]/50" />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 font-black text-sm">MM</span>
                      </div>
                    </div>
                  </>
                )}
                {triangleMode === 'catheti' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Cateto Oposto (OP)</label>
                      <div className="relative">
                        <input type="number" value={catA} onChange={e => setCatA(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-20 px-6 text-white font-mono text-3xl outline-none focus:border-[#eab308]/50" />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 font-black text-sm">MM</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Cateto Adjacente (ADJ)</label>
                      <div className="relative">
                        <input type="number" value={catB} onChange={e => setCatB(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-20 px-6 text-white font-mono text-3xl outline-none focus:border-[#eab308]/50" />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 font-black text-sm">MM</span>
                      </div>
                    </div>
                  </>
                )}

                {triangleMode === 'cat_hypo' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Cateto Oposto (OP)</label>
                      <div className="relative">
                        <input type="number" value={catA} onChange={e => setCatA(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-20 px-6 text-white font-mono text-3xl outline-none focus:border-[#eab308]/50" />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 font-black text-sm">MM</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Hipotenusa (H)</label>
                      <div className="relative">
                        <input type="number" value={hypo} onChange={e => setHypo(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-20 px-6 text-white font-mono text-3xl outline-none focus:border-[#eab308]/50" />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 font-black text-sm">MM</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          
          {subModule === 'circle' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Raio (R)</label>
                <input type="number" value={radius} onChange={e => setRadius(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-20 px-6 text-white font-mono text-3xl outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Ângulo (°)</label>
                <input type="number" value={centralAngle} onChange={e => setCentralAngle(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-20 px-6 text-white font-mono text-3xl outline-none" />
              </div>
            </div>
          )}
          {subModule === 'polygons' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Lados</label>
                <select value={polySides} onChange={e => setPolySides(Number(e.target.value) as 5 | 6)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-20 px-6 text-[#eab308] font-black outline-none appearance-none text-xl">
                   <option value={6}>Sextavado (6)</option>
                   <option value={5}>Pentágono (5)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Entre Faces</label>
                <input type="number" value={polyDim} onChange={e => setPolyDim(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-20 px-6 text-white font-mono text-3xl outline-none" />
              </div>
            </div>
          )}
          {subModule === 'functions' && (
            <div className="space-y-8">
              <div className="flex bg-[#221e1b] p-1.5 rounded-2xl border border-white/10">
                {[
                  { id: 'sin', label: 'Seno (SIN)' },
                  { id: 'cos', label: 'Coseno (COS)' },
                  { id: 'tan', label: 'Tangente (TAN)' }
                ].map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setFuncType(m.id as any)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${funcType === m.id ? 'bg-[#eab308] text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Ângulo (°)</label>
                  <div className="relative">
                    <input type="number" value={funcAngle} onChange={e => setFuncAngle(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-20 px-6 text-white font-mono text-3xl outline-none focus:border-[#eab308]/50" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[#eab308] font-black text-2xl">°</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Valor (Cota)</label>
                  <div className="relative">
                    <input type="number" value={funcValue} onChange={e => setFuncValue(e.target.value)} className="w-full bg-[#221e1b] border border-white/10 rounded-2xl h-20 px-6 text-white font-mono text-3xl outline-none focus:border-[#eab308]/50" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 font-black text-sm">MM</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Cards */}
        <div className="space-y-6">
           {subModule === 'triangle' && (
             <>
               <div className="bg-[#221e1b] rounded-[2rem] p-8 border-l-8 border-[#eab308] shadow-2xl">
                  <p className="text-gray-500 text-xs font-black uppercase tracking-widest">
                    {triangleMode === 'catheti' ? 'Hipotenusa (H)' : 'Cateto Oposto (Altura)'}
                  </p>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-6xl font-black text-white tabular-nums">
                      {triangleMode === 'catheti' ? triangleResults.h.toFixed(2) : triangleResults.o.toFixed(2)}
                    </span>
                    <span className="text-2xl font-black text-[#eab308]">MM</span>
                  </div>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  <div className="bg-[#221e1b] p-6 rounded-2xl border border-white/10">
                     <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                       {triangleMode === 'catheti' ? 'Ângulo Alfa (α)' : 'Cat. Adjacente'}
                     </p>
                     <p className="text-3xl font-black text-white mt-1">
                       {triangleMode === 'catheti' ? triangleResults.angle.toFixed(2) + '°' : triangleResults.adj.toFixed(2) + ' mm'}
                     </p>
                  </div>
                  <div className="bg-[#221e1b] p-6 rounded-2xl border border-white/10">
                     <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                       {triangleMode === 'catheti' ? 'Ângulo Beta (β)' : 'Ângulo Complementar'}
                     </p>
                     <p className="text-3xl font-black text-[#eab308] mt-1">{triangleResults.beta.toFixed(2)}°</p>
                  </div>
               </div>
               {triangleMode !== 'angle_hypo' && (
                 <div className="bg-[#221e1b] p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-gray-500 uppercase">
                      {triangleMode === 'catheti' ? 'Cateto Oposto / Adjacente' : 'Cateto Adjacente'}
                    </p>
                    <p className="text-sm font-black text-gray-400 mt-1">
                      {triangleMode === 'catheti' 
                        ? `OP: ${triangleResults.o.toFixed(2)}mm | ADJ: ${triangleResults.adj.toFixed(2)}mm`
                        : `ADJ: ${triangleResults.adj.toFixed(2)}mm | H: ${triangleResults.h.toFixed(2)}mm`}
                    </p>
                 </div>
               )}
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

           {subModule === 'functions' && (
             <div className="bg-[#221e1b] rounded-3xl p-6 border-l-4 border-[#eab308] shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                   <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Fator da Função</p>
                   <p className="text-white font-black text-sm">{funcResults.factor.toFixed(6)}</p>
                </div>
                <div className="h-px bg-white/5"></div>
                <div>
                   <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Resultado Final</p>
                   <div className="flex items-baseline gap-2 mt-2">
                     <span className="text-5xl font-black text-white tabular-nums">{funcResults.result.toFixed(4)}</span>
                     <span className="text-xl font-bold text-gray-600">mm</span>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="absolute bottom-6 left-6 right-6 flex gap-3 z-40 bg-[#161412]/90 backdrop-blur-xl p-3 rounded-[2rem] border border-white/10 shadow-2xl">
         <button onClick={shareWhatsApp} className="size-16 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-95 transition-all shrink-0">
            <span className="material-symbols-outlined text-3xl">chat</span>
         </button>
         <button onClick={shareEmail} className="size-16 bg-white/10 text-gray-300 rounded-2xl border border-white/10 flex items-center justify-center shadow-xl active:scale-95 transition-all shrink-0">
            <span className="material-symbols-outlined text-3xl">mail</span>
         </button>
         <button onClick={handleSave} className="flex-1 bg-[#eab308] text-black font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all uppercase text-lg tracking-widest">
            <span className="material-symbols-outlined text-3xl">save</span> SALVAR
         </button>
      </div>
    </div>
  );
};

export default Trigonometry;
