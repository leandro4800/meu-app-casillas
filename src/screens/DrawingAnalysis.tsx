import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Upload, Search, FileText, AlertCircle } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';
import { GoogleGenAI } from "@google/genai";

interface DrawingAnalysisProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const DrawingAnalysis: React.FC<DrawingAnalysisProps> = ({ onBack, navigate, currentScreen }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeDrawing = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: "Analise este desenho técnico de usinagem. Identifique dimensões principais, tolerâncias, acabamentos superficiais e sugira um processo de fabricação (torneamento, fresagem, etc.). Responda em Português de forma técnica e concisa." },
              { inlineData: { mimeType: "image/jpeg", data: base64Data } }
            ]
          }
        ]
      });

      setAnalysis(response.text || "Não foi possível analisar o desenho.");
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o Agente IA. Verifique sua conexão ou chave de API.");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Análise de Desenho IA</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 p-8 mb-8 text-center">
          {!image ? (
            <label className="cursor-pointer group">
              <div className="size-24 rounded-[2rem] bg-white/[0.03] border-2 border-dashed border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:border-[#eab308]/50 transition-all">
                <Upload size={32} className="text-gray-600 group-hover:text-[#eab308] transition-all" />
              </div>
              <h3 className="text-white font-black text-xs uppercase tracking-widest mb-2">Upload de Desenho</h3>
              <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest">JPG, PNG ou PDF</p>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          ) : (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/40">
                <img src={image} alt="Drawing" className="w-full h-full object-contain" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 size-10 bg-black/60 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                >
                  <AlertCircle size={20} />
                </button>
              </div>
              
              <button
                onClick={analyzeDrawing}
                disabled={loading}
                className="w-full bg-[#eab308] text-black font-black text-xs uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {loading ? (
                  <div className="size-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Search size={18} />
                )}
                {loading ? 'ANALISANDO...' : 'INICIAR ANÁLISE IA'}
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-4 mb-8"
            >
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <p className="text-red-500 text-[10px] font-bold uppercase leading-relaxed">{error}</p>
            </motion.div>
          )}

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#141414] rounded-[2.5rem] border border-white/5 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FileText className="text-[#eab308]" size={20} />
                <h3 className="text-white font-black text-xs uppercase tracking-widest">Relatório de Análise</h3>
              </div>
              <div className="prose prose-invert prose-xs max-w-none">
                <p className="text-gray-400 text-[11px] leading-relaxed whitespace-pre-wrap font-medium">
                  {analysis}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default DrawingAnalysis;
