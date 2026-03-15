
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { auth } from '../firebase';

interface MachiningOptimizerProps {
  onBack: () => void;
  t: any;
}

interface OptimizationResult {
  current: {
    vc: number;
    fz: number;
    ap: number;
    ae: number;
    mrr: number; // Material Removal Rate
    cycleTime: number;
  };
  optimized: {
    vc: number;
    fz: number;
    ap: number;
    ae: number;
    mrr: number;
    cycleTime: number;
    toolLifeImprovement: string;
    productivityGain: number;
  };
  reasoning: string;
  recommendations: string[];
}

const MachiningOptimizer: React.FC<MachiningOptimizerProps> = ({ onBack, t }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  
  const [inputs, setInputs] = useState({
    material: 'Aço P20',
    operation: 'Fresamento de Face',
    tool: 'Fresa de Metal Duro 12mm',
    vc: 120,
    fz: 0.1,
    ap: 2,
    ae: 8,
    length: 200,
    width: 50
  });

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY || "";
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Otimize o processo de usinagem com os seguintes dados:
        Material: ${inputs.material}
        Operação: ${inputs.operation}
        Ferramenta: ${inputs.tool}
        Parâmetros Atuais: Vc=${inputs.vc}m/min, fz=${inputs.fz}mm/z, ap=${inputs.ap}mm, ae=${inputs.ae}mm.
        Dimensões da Peça: Comprimento=${inputs.length}mm, Largura=${inputs.width}mm.
        
        Calcule a Taxa de Remoção de Material (MRR) atual e otimizada.
        Sugira parâmetros otimizados para máxima produtividade sem comprometer a vida útil da ferramenta.
        Retorne os dados em formato JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              current: {
                type: Type.OBJECT,
                properties: {
                  vc: { type: Type.NUMBER },
                  fz: { type: Type.NUMBER },
                  ap: { type: Type.NUMBER },
                  ae: { type: Type.NUMBER },
                  mrr: { type: Type.NUMBER },
                  cycleTime: { type: Type.NUMBER }
                },
                required: ["vc", "fz", "ap", "ae", "mrr", "cycleTime"]
              },
              optimized: {
                type: Type.OBJECT,
                properties: {
                  vc: { type: Type.NUMBER },
                  fz: { type: Type.NUMBER },
                  ap: { type: Type.NUMBER },
                  ae: { type: Type.NUMBER },
                  mrr: { type: Type.NUMBER },
                  cycleTime: { type: Type.NUMBER },
                  toolLifeImprovement: { type: Type.STRING },
                  productivityGain: { type: Type.NUMBER }
                },
                required: ["vc", "fz", "ap", "ae", "mrr", "cycleTime", "toolLifeImprovement", "productivityGain"]
              },
              reasoning: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["current", "optimized", "reasoning", "recommendations"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setResult(data);
    } catch (error) {
      console.error("Optimization error:", error);
      alert("Erro ao otimizar processo. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto custom-scrollbar bg-[#0a0908]">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-2xl font-black text-[#eab308] italic uppercase tracking-tighter">Otimizador de Processos</h2>
      </div>

      <div className="grid gap-4 bg-[#1c1e22] p-6 rounded-[30px] border border-white/10 shadow-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Material</label>
            <input 
              value={inputs.material} 
              onChange={e => setInputs({...inputs, material: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-bold text-white focus:border-[#eab308] outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Operação</label>
            <input 
              value={inputs.operation} 
              onChange={e => setInputs({...inputs, operation: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-bold text-white focus:border-[#eab308] outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ferramenta</label>
          <input 
            value={inputs.tool} 
            onChange={e => setInputs({...inputs, tool: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-bold text-white focus:border-[#eab308] outline-none"
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="space-y-1">
            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Vc (m/min)</label>
            <input 
              type="number"
              value={inputs.vc} 
              onChange={e => setInputs({...inputs, vc: Number(e.target.value)})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs font-bold text-white outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">fz (mm/z)</label>
            <input 
              type="number"
              step="0.01"
              value={inputs.fz} 
              onChange={e => setInputs({...inputs, fz: Number(e.target.value)})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs font-bold text-white outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">ap (mm)</label>
            <input 
              type="number"
              value={inputs.ap} 
              onChange={e => setInputs({...inputs, ap: Number(e.target.value)})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs font-bold text-white outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">ae (mm)</label>
            <input 
              type="number"
              value={inputs.ae} 
              onChange={e => setInputs({...inputs, ae: Number(e.target.value)})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs font-bold text-white outline-none"
            />
          </div>
        </div>

        <button 
          onClick={handleOptimize}
          disabled={loading}
          className="w-full bg-[#eab308] text-black font-black py-4 rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#facc15] transition-colors disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-spin material-symbols-outlined">sync</span>
          ) : (
            <span className="material-symbols-outlined">bolt</span>
          )}
          {loading ? 'Analisando...' : 'Otimizar Processo'}
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1c1e22] p-4 rounded-[25px] border border-white/5">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Atual</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">MRR:</span>
                  <span className="font-bold">{result.current.mrr} cm³/min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Tempo:</span>
                  <span className="font-bold">{result.current.cycleTime} min</span>
                </div>
              </div>
            </div>
            <div className="bg-emerald-500/10 p-4 rounded-[25px] border border-emerald-500/20">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Otimizado</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-500/60">MRR:</span>
                  <span className="font-bold text-emerald-400">{result.optimized.mrr} cm³/min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-500/60">Ganho:</span>
                  <span className="font-bold text-emerald-400">+{result.optimized.productivityGain}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1c1e22] p-6 rounded-[30px] border border-white/10 space-y-4">
            <h3 className="text-sm font-black text-[#eab308] uppercase tracking-widest">Análise Técnica</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{result.reasoning}</p>
            
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Recomendações</p>
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="size-1.5 rounded-full bg-[#eab308] mt-1.5 shrink-0"></span>
                  <p className="text-xs text-white font-medium">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachiningOptimizer;
