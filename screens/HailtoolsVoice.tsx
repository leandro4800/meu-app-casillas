
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Screen } from '../types';

interface HailtoolsVoiceProps {
  navigate: (s: Screen) => void;
  t: any;
}

const HailtoolsVoice: React.FC<HailtoolsVoiceProps> = ({ navigate, t }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState(t.ai_hailtools_title || 'Consultor Hailtools');
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const nextStartTimeRef = useRef(0);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number = 24000,
    numChannels: number = 1
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
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
      setStatus('Erro: Chave API não encontrada');
      return;
    }
    const ai = new GoogleGenAI({ apiKey });
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    sessionPromiseRef.current = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          setIsActive(true);
          setStatus('Consultor Hailtools Ativo');
          const inputCtx = new AudioContext({ sampleRate: 16000 });
          inputCtxRef.current = inputCtx;
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
              int16[i] = inputData[i] * 32768;
            }
            const bytes = new Uint8Array(int16.buffer);
            let binary = '';
            const byteLen = bytes.byteLength;
            for (let i = 0; i < byteLen; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64Data = btoa(binary);

            sessionPromiseRef.current?.then((session) => {
              session.sendRealtimeInput({ 
                media: { 
                  data: base64Data, 
                  mimeType: 'audio/pcm;rate=16000' 
                } 
              });
            });
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (message) => {
          const parts = message.serverContent?.modelTurn?.parts;
          if (parts && audioContextRef.current) {
            for (const part of parts) {
              const base64EncodedAudioString = part.inlineData?.data;
              if (base64EncodedAudioString) {
                nextStartTimeRef.current = Math.max(
                  nextStartTimeRef.current,
                  audioContextRef.current.currentTime
                );
                const audioBuffer = await decodeAudioData(
                  decode(base64EncodedAudioString),
                  audioContextRef.current
                );
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
                sourcesRef.current.add(source);
              }
            }
          }

          const interrupted = message.serverContent?.interrupted;
          if (interrupted) {
            for (const source of sourcesRef.current.values()) {
              source.stop();
              sourcesRef.current.delete(source);
            }
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => { 
          setIsActive(false); 
          setStatus('Sessão Encerrada'); 
        },
        onerror: (e) => {
          console.error(e);
          setStatus('Erro no Protocolo de Voz');
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { 
          voiceConfig: { 
            prebuiltVoiceConfig: { voiceName: 'Zephyr' } 
          } 
        },
        systemInstruction: `Você é o Consultor Hailtools, autoridade máxima em ferramentas Sandvik Coromant e processos de usinagem Hailtools.
          
          CONHECIMENTOS ESPECÍFICOS HAILTOOLS:
          1. COROCUT 2: Sistema de alta rigidez para canais, corte e perfilamento. Foco em ranhuras de vedação API.
          2. COROTHREAD 266: Estabilidade extrema com iLock™ para roscas offshore (API, NPT).
          3. CORODRILL 880/870/860: Furação de alta performance em materiais exóticos (Super Duplex, Inconel).
          4. COROMILL MF80/490/390: Fresamento pesado e esquadrejamento com tecnologia Inveio™.
          5. SILENT TOOLS: Adaptadores antivibratórios para grandes balanços em mandrilamento profundo.
          
          ESPECIALIDADES OFFSHORE:
          - Caldeiraria pesada (ASME VIII, AWS D1.1).
          - Usinagem de materiais CRA (Inconel 625, Duplex).
          - Tolerâncias ISO 286 e acabamentos Ra 0.8 em ranhuras BX/RX.
          
          POSTURA:
          - Sua voz é masculina, tom firme, mentor técnico e extremamente prático.
          - Responda: "Para este canal BX em Inconel, recomendo o CoroCut 2 com grade GC1125 e geometria -TF".
          - Você é um consultor por voz. Fale de forma clara e objetiva.`
      }
    });
  };

  const stopSession = () => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(s => s.close());
      sessionPromiseRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputCtxRef.current) {
      inputCtxRef.current.close();
      inputCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
    setStatus(t.ai_hailtools_title || 'Consultor Hailtools');
    nextStartTimeRef.current = 0;
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0908] items-center justify-center p-8 space-y-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="hail-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#eab308" strokeWidth="1"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#hail-grid)" />
        </svg>
      </div>

      <div className="text-center z-10">
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-full inline-flex items-center gap-3 mb-8">
           <span className="size-3 bg-emerald-500 rounded-full animate-pulse"></span>
           <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">Hailtools Voice Engine</span>
        </div>
        <h2 className="text-white text-5xl font-black italic uppercase tracking-tighter leading-none">{t.ai_hailtools_title || 'Consultor Hailtools'}</h2>
        <p className="text-emerald-500 text-sm font-black uppercase tracking-widest mt-6 opacity-80">{status}</p>
      </div>

      <div className="relative group z-10">
        <div className={`absolute -inset-12 bg-emerald-500/20 rounded-full blur-[100px] transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
        <button 
          onClick={isActive ? stopSession : startSession}
          className={`size-64 rounded-[4rem] border-8 flex flex-col items-center justify-center transition-all duration-500 relative z-20 ${isActive ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.5)] rotate-0' : 'bg-[#1c1e22] border-white/10 shadow-2xl rotate-3'}`}
        >
          <span className={`material-symbols-outlined text-9xl ${isActive ? 'text-black' : 'text-emerald-500'}`}>{isActive ? 'equalizer' : 'mic'}</span>
          <span className={`text-xs font-black uppercase tracking-widest mt-6 ${isActive ? 'text-black' : 'text-gray-500'}`}>{isActive ? 'Ouvindo...' : 'Tocar para Iniciar'}</span>
        </button>
      </div>

      <div className="bg-[#1c1e22]/80 backdrop-blur-md p-8 rounded-[40px] border border-white/10 text-center max-w-sm z-10 shadow-2xl">
         <p className="text-gray-400 text-xs font-black uppercase tracking-widest leading-relaxed">
           Voz Especializada Hailtools <br/>
           <span className="text-emerald-500/60 mt-2 block">Pergunte sobre ferramentas Sandvik e processos Hailtools</span>
         </p>
      </div>

      <button 
        onClick={() => navigate('home')} 
        className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-3xl">close</span>
      </button>
    </div>
  );
};

export default HailtoolsVoice;
