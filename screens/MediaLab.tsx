
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Screen } from '../types';

interface MediaLabProps {
  navigate: (s: Screen) => void;
  t: any;
}

const MediaLab: React.FC<MediaLabProps> = ({ navigate, t }) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'video'>('generate');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(true); // Assume true por padrão para fluidez

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    if ((window as any).aistudio?.hasSelectedApiKey) {
      const status = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(status);
    }
  };

  const handleSelectKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResultUrl(null);
    try {
      const getApiKey = () => {
        const manualKey = localStorage.getItem('manual_gemini_key');
        if (manualKey && manualKey.length > 10) return manualKey.trim();
        return (
          process.env.GEMINI_API_KEY || 
          process.env.API_KEY || 
          (window as any).process?.env?.API_KEY || 
          (import.meta as any).env?.VITE_GEMINI_API_KEY ||
          ""
        ).trim();
      };
      const ai = new GoogleGenAI({ apiKey: getApiKey() });
      // Usando Flash Image para geração "normal" e rápida
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: { parts: [{ text: `Imagem técnica industrial profissional: ${prompt}. Estilo: Fotografia de engenharia, alta definição, iluminação de fábrica.` }] },
        config: { 
          imageConfig: { aspectRatio: '1:1' } 
        },
      });
      
      const imagePart = response.candidates[0].content.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        setResultUrl(`data:image/png;base64,${imagePart.inlineData.data}`);
      }
    } catch (e: any) {
      console.error(e);
      alert(t.image_gen_error || "Erro na geração da imagem. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleVideo = async () => {
    if (!prompt) return;
    setLoading(true);
    setResultUrl(null);
    try {
      // Para Veo, a seleção de chave é obrigatória por regra do SDK
      if (!hasKey) {
        await handleSelectKey();
      }

      const getApiKey = () => {
        const manualKey = localStorage.getItem('manual_gemini_key');
        if (manualKey && manualKey.length > 10) return manualKey.trim();
        return (
          process.env.GEMINI_API_KEY || 
          process.env.API_KEY || 
          (window as any).process?.env?.API_KEY || 
          (import.meta as any).env?.VITE_GEMINI_API_KEY ||
          ""
        ).trim();
      };
      const ai = new GoogleGenAI({ apiKey: getApiKey() });
      let op = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Cena industrial offshore: ${prompt}. Estilo cinematográfico, alta qualidade técnica.`,
        config: { 
          numberOfVideos: 1, 
          resolution: '720p', 
          aspectRatio: '16:9' 
        }
      });

      while (!op.done) {
        await new Promise(r => setTimeout(r, 10000));
        op = await ai.operations.getVideosOperation({ operation: op });
      }

      const downloadLink = op.response?.generatedVideos?.[0]?.video?.uri;
      setResultUrl(`${downloadLink}&key=${getApiKey()}`);
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("entity was not found")) {
        setHasKey(false);
        alert(t.veo_key_error || "Para gerar vídeos, é necessário vincular uma chave API de um projeto com faturamento.");
      } else {
        alert(t.video_gen_error || "Erro ao processar vídeo. Tente um prompt mais curto.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#0a0908] h-full overflow-y-auto custom-scrollbar pb-32">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#eab308] text-2xl font-black uppercase italic tracking-tighter">{t.lab || 'Laboratório'}</h2>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mt-1">{t.lab_desc || 'Imagens e Vídeos Industriais'}</p>
        </div>
        <button 
          onClick={() => navigate('ai_suite')} 
          className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="flex bg-[#1c1e22] p-1 rounded-2xl border border-white/5 shadow-inner">
        <button 
          onClick={() => { setActiveTab('generate'); setResultUrl(null); }} 
          className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${activeTab === 'generate' ? 'bg-[#eab308] text-black shadow-lg' : 'text-gray-500'}`}
        >
          {t.generate_image || 'GERAR IMAGEM'}
        </button>
        <button 
          onClick={() => { setActiveTab('video'); setResultUrl(null); }} 
          className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${activeTab === 'video' ? 'bg-[#eab308] text-black shadow-lg' : 'text-gray-500'}`}
        >
          {t.generate_video || 'GERAR VÍDEO'}
        </button>
      </div>

      <div className="bg-[#1c1816] p-6 rounded-[32px] border border-white/5 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 size-32 bg-[#eab308]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <textarea 
          value={prompt} 
          onChange={e => setPrompt(e.target.value)} 
          placeholder={activeTab === 'generate' ? (t.image_prompt_placeholder || "Ex: Uma flange API 6A com anel BX em corte 3D...") : (t.video_prompt_placeholder || "Ex: Broca CoroDrill perfurando bloco de aço Super Duplex...")} 
          className="w-full bg-[#0a0908] border border-white/5 rounded-2xl p-5 text-sm text-white h-32 outline-none focus:border-[#eab308]/50 transition-colors resize-none font-medium" 
        />
        
        <button 
          onClick={activeTab === 'generate' ? handleGenerate : handleVideo} 
          disabled={loading || !prompt} 
          className="w-full bg-[#eab308] text-black font-black py-5 rounded-2xl uppercase text-xs tracking-[0.2em] shadow-xl active:scale-95 disabled:opacity-20 transition-all flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
               <div className="size-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
               {t.processing || 'PROCESSANDO...'}
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">bolt</span>
              {t.create_now || 'CRIAR AGORA'}
            </>
          )}
        </button>
      </div>

      {resultUrl && (
        <div className="bg-black p-2 rounded-[32px] border border-[#eab308]/30 shadow-2xl animate-in zoom-in duration-500 overflow-hidden">
          {activeTab === 'video' ? (
            <video src={resultUrl} controls className="w-full rounded-2xl" autoPlay loop />
          ) : (
            <img src={resultUrl} className="w-full rounded-2xl" alt="IA Industrial" />
          )}
          <div className="p-4 flex justify-between items-center bg-[#1c1816]">
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{t.asset_generated_success || 'Ativo Gerado com Sucesso'}</span>
             <a href={resultUrl} download={`casillas_${activeTab}.png`} className="text-[#eab308] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                Download <span className="material-symbols-outlined text-sm">download</span>
             </a>
          </div>
        </div>
      )}

      {activeTab === 'video' && !hasKey && (
        <div className="bg-blue-500/10 p-5 rounded-3xl border border-blue-500/20">
           <p className="text-[9px] text-blue-400 font-bold leading-relaxed uppercase tracking-widest">
             {t.video_key_note || 'Nota: Geração de vídeo requer chave de faturamento do Google Cloud.'}
           </p>
           <button onClick={handleSelectKey} className="text-[#eab308] text-[9px] font-black mt-2 underline uppercase">{t.configure_key || 'Configurar Chave'}</button>
        </div>
      )}
    </div>
  );
};

export default MediaLab;
