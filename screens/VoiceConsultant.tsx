
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Screen } from '../types';

const VoiceConsultant: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Iniciar Consultoria por Voz');
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const nextStartTimeRef = useRef(0);

  // Manual base64 decoding following guidelines
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Manual audio decoding for PCM streams
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
    // Guidelines: Always create GoogleGenAI instance right before making an API call
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
      setStatus('Erro: Chave API não encontrada ou inválida');
      return;
    }
    const ai = new GoogleGenAI({ apiKey });
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    sessionPromiseRef.current = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          setIsActive(true);
          setStatus('Eng. Casillas Ouvindo...');
          const inputCtx = new AudioContext({ sampleRate: 16000 });
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
              int16[i] = inputData[i] * 32768;
            }
            
            // Manual base64 encoding following guidelines
            const bytes = new Uint8Array(int16.buffer);
            let binary = '';
            const byteLen = bytes.byteLength;
            for (let i = 0; i < byteLen; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64Data = btoa(binary);

            // Solely rely on sessionPromise resolves
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
            // 'Puck' é uma voz masculina clara e autoritária para o Eng. Casillas
            prebuiltVoiceConfig: { voiceName: 'Puck' } 
          } 
        },
        systemInstruction: 'Você é o Eng. Casillas, um consultor técnico sênior experiente. Sua voz é firme, masculina e confiante. Você domina usinagem, normas API e materiais O&G. Responda de forma direta, técnica e prática, como se estivesse orientando um operador no pé da máquina.'
      }
    });
  };

  const stopSession = () => {
    sessionPromiseRef.current?.then(s => s.close());
    setIsActive(false);
    setStatus('Iniciar Consultoria por Voz');
  };

  return (
    <div className="flex flex-col h-full bg-[#161412] items-center justify-center p-8 space-y-12 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="voice-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#eab308" strokeWidth="1"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#voice-grid)" />
        </svg>
      </div>

      <div className="text-center z-10">
        <div className="bg-[#eab308]/10 border border-[#eab308]/20 px-6 py-2 rounded-full inline-flex items-center gap-3 mb-8">
           <span className="size-3 bg-[#eab308] rounded-full animate-pulse"></span>
           <span className="text-xs font-black text-[#eab308] uppercase tracking-[0.2em]">Live Audio Engine</span>
        </div>
        <h2 className="text-white text-5xl font-black italic uppercase tracking-tighter leading-none">Consultor de Voz</h2>
        <p className="text-[#eab308] text-sm font-black uppercase tracking-widest mt-6 opacity-80">{status}</p>
      </div>

      <div className="relative group z-10">
        <div className={`absolute -inset-12 bg-[#eab308]/20 rounded-full blur-[100px] transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
        <button 
          onClick={isActive ? stopSession : startSession}
          className={`size-64 rounded-[4rem] border-8 flex flex-col items-center justify-center transition-all duration-500 relative z-20 ${isActive ? 'bg-[#eab308] border-[#eab308] shadow-[0_0_100px_rgba(234,179,8,0.5)] rotate-0' : 'bg-[#221e1b] border-white/10 shadow-2xl rotate-3'}`}
        >
          <span className={`material-symbols-outlined text-9xl ${isActive ? 'text-black' : 'text-[#eab308]'}`}>{isActive ? 'equalizer' : 'mic'}</span>
          <span className={`text-xs font-black uppercase tracking-widest mt-6 ${isActive ? 'text-black' : 'text-gray-500'}`}>{isActive ? 'Ouvindo...' : 'Tocar para Iniciar'}</span>
        </button>
      </div>

      <div className="bg-[#1c1e22]/80 backdrop-blur-md p-8 rounded-[40px] border border-white/10 text-center max-w-sm z-10 shadow-2xl">
         <p className="text-gray-400 text-xs font-black uppercase tracking-widest leading-relaxed">
           Voz Masculina Ativada • Perfil Puck <br/>
           <span className="text-[#eab308]/60 mt-2 block">Fale naturalmente com o Eng. Casillas</span>
         </p>
      </div>

      <button 
        onClick={() => navigate('ai_suite')} 
        className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-3xl">close</span>
      </button>
    </div>
  );
};

export default VoiceConsultant;
