
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Screen } from '../types';
import { HAILTOOLS_CATALOG, CASILLAS_CONSULTANT_IMAGE } from '../constants';

interface ChatMessage {
  role: 'user' | 'casillas';
  text: string;
  isStreaming?: boolean;
}

interface DrawingAnalysisProps {
  navigate: (s: Screen) => void;
  t: any;
}

const DrawingAnalysis: React.FC<DrawingAnalysisProps> = ({ navigate, t }) => {
  const [image, setImage] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setMessages([]); 
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          setAudioBase64(base64);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      alert(t.mic_error || "Erro ao acessar microfone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const runInitialAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    
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
      const apiKey = getApiKey();
      if (!apiKey || apiKey.length < 10) {
        alert(t.api_key_error || "Erro: Chave API não encontrada ou inválida.");
        setLoading(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const imageBase64 = image.split(',')[1];

      const parts: any[] = [
        { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }
      ];

      if (audioBase64) {
        parts.push({ inlineData: { data: audioBase64, mimeType: 'audio/webm' } });
      }

      parts.push({
        text: `Você é o Engenheiro Casillas, especialista em Offshore (Usinagem e Caldeiraria).
        
        TAREFA: Analise o desenho técnico e as instruções por voz do operador.
        
        FOCO DA ANÁLISE:
        1. USINAGEM: Identifique tolerâncias (H7, g6), rugosidade (Ra) e requisitos API.
        2. CALDEIRARIA: Identifique símbolos de solda, chanfros (biséis), tipos de juntas e normas (AWS/ASME).
        3. OFFSHORE: Observe requisitos de ensaios não destrutivos (LP, PM, UT) citados ou sugeridos.
        
        RELATÓRIO TÉCNICO:
        - RESUMO DO PROJETO (Normas aplicáveis).
        - PREPARAÇÃO DE CALDEIRARIA (Corte e Chanfro).
        - SEQUÊNCIA DE USINAGEM (Ferramentas e Parâmetros).
        - CONTROLE DE QUALIDADE (Tolerâncias críticas).`
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts }
      });

      setMessages([{ role: 'casillas', text: response.text }]);
      setAudioBase64(null);
    } catch (e) {
      alert(t.multimodal_analysis_error || 'Erro na análise técnica multimodal.');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async () => {
    if (!input.trim() || !image || loading) return;
    const userText = input;
    setInput('');
    setLoading(true);
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
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
      const apiKey = getApiKey();
      if (!apiKey || apiKey.length < 10) {
        setMessages([...newMessages, { role: 'casillas', text: t.api_key_error || "Erro: Chave API não encontrada ou inválida." }]);
        setLoading(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const imageBase64 = image.split(',')[1];
      const contents = [
        {
          parts: [
            { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
            { text: "Continue a consultoria técnica focando em caldeiraria pesada e usinagem de precisão offshore." }
          ]
        },
        ...newMessages.map(m => ({
          role: m.role === 'casillas' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }))
      ];
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents as any,
        config: { systemInstruction: "Responda como Eng. Casillas, especialista offshore." }
      });
      setMessages([...newMessages, { role: 'casillas', text: response.text }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'casillas', text: t.technical_comm_error || "Erro na comunicação técnica." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0908] relative overflow-hidden">
      <div className="p-6 border-b border-[#eab308]/10 shrink-0 bg-[#0a0908]/95 z-20 backdrop-blur-md shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-[#eab308] text-2xl font-black italic uppercase tracking-tighter leading-none">{t.industrial_vision || 'Visão Industrial'}</h2>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mt-1">{t.industrial_vision_desc || 'Usinagem • Caldeiraria • Solda'}</p>
        </div>
        <div className="size-10 rounded-xl bg-[#eab308]/10 flex items-center justify-center border border-[#eab308]/20">
           <span className="material-symbols-outlined text-[#eab308]">architecture</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar pb-32">
        <div className="bg-[#1c1816]/60 backdrop-blur-sm p-4 rounded-[32px] border border-white/5 space-y-4 shadow-2xl relative">
           {!image ? (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-[#eab308]/20 rounded-3xl flex flex-col items-center justify-center gap-3 bg-black/20"
              >
                 <span className="material-symbols-outlined text-4xl text-[#eab308]">file_upload</span>
                 <p className="text-white font-black text-[10px] uppercase tracking-widest">{t.send_technical_drawing || 'Enviar Desenho Técnico'}</p>
              </button>
           ) : (
              <div className="space-y-4">
                 <div className="relative group">
                    <img src={image} className="w-full h-48 object-contain bg-black/60 rounded-2xl border border-white/10" alt="Projeto" />
                    <button onClick={() => {setImage(null); setMessages([]);}} className="absolute top-2 right-2 size-10 bg-black/80 rounded-full text-white flex items-center justify-center border border-white/10 active:scale-90 shadow-xl">
                        <span className="material-symbols-outlined text-base">close</span>
                    </button>
                 </div>

                 {messages.length === 0 && (
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onMouseDown={startRecording}
                        onMouseUp={stopRecording}
                        onTouchStart={startRecording}
                        onTouchEnd={stopRecording}
                        className={`py-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${isRecording ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-black/40 border-white/10 text-white'}`}
                      >
                         <span className="material-symbols-outlined">{isRecording ? 'mic' : 'mic_none'}</span>
                         <span className="text-[8px] font-black uppercase tracking-widest">{isRecording ? (t.listening || 'Ouvindo...') : audioBase64 ? (t.audio_recorded || 'Áudio Gravado') : (t.voice_instruction || 'Instrução de Voz')}</span>
                      </button>

                      <button 
                        onClick={runInitialAnalysis}
                        disabled={loading}
                        className="bg-[#eab308] text-black font-black rounded-2xl flex flex-col items-center justify-center gap-1 shadow-xl active:scale-95 disabled:opacity-20"
                      >
                         <span className="material-symbols-outlined">{loading ? 'sync' : 'bolt'}</span>
                         <span className="text-[8px] font-black uppercase tracking-widest">{loading ? (t.analyzing || 'Analisando...') : (t.process_vision || 'Processar Visão')}</span>
                      </button>
                   </div>
                 )}
              </div>
           )}
        </div>

        <div className="space-y-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
               {msg.role === 'casillas' && (
                  <div className="size-12 rounded-2xl border-2 border-[#eab308]/40 overflow-hidden shrink-0 bg-[#121214] shadow-lg">
                     <img src={CASILLAS_CONSULTANT_IMAGE} className="w-full h-full object-cover" alt="Casillas" />
                  </div>
               )}
               <div className={`p-8 rounded-[32px] shadow-2xl border relative ${
                 msg.role === 'casillas' 
                   ? 'bg-[#1c1816] text-gray-200 border-white/5 rounded-tl-none' 
                   : 'bg-[#eab308] text-black font-black rounded-tr-none border-[#eab308]'
               }`}>
                  {msg.role === 'casillas' && (
                    <div className="absolute -top-3 left-8 flex gap-2">
                       <div className="bg-[#eab308] text-black text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{t.offshore_protocol_active || 'Protocolo Offshore Ativo'}</div>
                    </div>
                  )}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap tracking-tight font-medium">
                    {msg.text}
                  </div>
               </div>
            </div>
          ))}
          {loading && messages.length > 0 && (
             <div className="flex gap-2 p-6 justify-center">
                <div className="size-2 bg-[#eab308] rounded-full animate-bounce"></div>
                <div className="size-2 bg-[#eab308] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="size-2 bg-[#eab308] rounded-full animate-bounce [animation-delay:0.4s]"></div>
             </div>
          )}
        </div>
      </div>

      {messages.length > 0 && (
        <div className="absolute bottom-6 left-6 right-6 flex gap-3 bg-[#1c1816]/95 backdrop-blur-2xl p-3 rounded-full border border-[#eab308]/20 z-30 shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleFollowUp()} 
            className="flex-1 bg-transparent px-6 text-white outline-none text-xs placeholder:text-gray-600 font-bold" 
            placeholder={t.drawing_analysis_placeholder || "Dúvida técnica sobre este projeto?"} 
          />
          <button 
            onClick={handleFollowUp} 
            disabled={loading || !input.trim()} 
            className="size-12 rounded-full bg-[#eab308] text-black flex items-center justify-center active:scale-95 disabled:opacity-20 shadow-xl transition-transform"
          >
            <span className="material-symbols-outlined text-2xl font-black">send</span>
          </button>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  );
};

export default DrawingAnalysis;
