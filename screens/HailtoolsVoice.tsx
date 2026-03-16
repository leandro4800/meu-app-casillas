
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, Type, FunctionDeclaration } from '@google/genai';
import { Screen, User } from '../types';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { MATERIALS, HAILTOOLS_CATALOG } from '../constants';

interface HailtoolsVoiceProps {
  navigate: (s: Screen) => void;
  t: any;
  user: User | null;
}

const HailtoolsVoice: React.FC<HailtoolsVoiceProps> = ({ navigate, t, user }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState(t.ai_hailtools_title || 'Consultor Hailtools');
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sessionRef = useRef<any>(null);
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

    let userName = user?.displayName || "Usuário";
    let userEmail = user?.email || "";
    let sentDocs: string[] = (user as any)?.sentDocuments || [];

    if (!userEmail && auth.currentUser) {
      userEmail = auth.currentUser.email || "";
    }

    const ai = new GoogleGenAI({ apiKey });

    const catalogContext = HAILTOOLS_CATALOG.map(t => 
      `- ${t.code}: Grade ${t.grade}, Geometria ${t.geometry}. Foco em: ${t.applicationPrimary}.`
    ).join('\n');

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          sessionPromiseRef.current = sessionPromise;
          sessionPromise.then(s => { sessionRef.current = s; });
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

            if (sessionRef.current) {
              sessionRef.current.sendRealtimeInput({ 
                media: { 
                  data: base64Data, 
                  mimeType: 'audio/pcm;rate=16000' 
                } 
              });
            }
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (message) => {
          console.log("Live API Message:", message);
          // Handle tool calls
          if (message.toolCall) {
            console.log("Tool call received:", message.toolCall);
            for (const call of message.toolCall.functionCalls) {
              if (call.name === 'enviar_catalogo_email') {
                const { email } = call.args as any;
                console.log(`Executing tool 'enviar_catalogo_email' for: ${email}`);
                setStatus(`Enviando documentos para ${email}...`);
                
                try {
                  // Add a timeout to the fetch call
                  const controller = new AbortController();
                  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

                  const res = await fetch('/api/send-catalog', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                    signal: controller.signal
                  });
                  clearTimeout(timeoutId);

                  const data = await res.json();
                  console.log("API Response:", data);
                  
                  if (!res.ok) {
                    throw new Error(data.error || "Erro no servidor");
                  }

                  // Update Firestore (non-blocking)
                  if (auth.currentUser) {
                    updateDoc(doc(db, 'users', auth.currentUser.uid), {
                      sentDocuments: arrayUnion('catalog', 'eafu')
                    }).catch(err => console.error("Firestore update error:", err));
                  }

                  if (sessionRef.current) {
                    console.log("Sending tool response back to session...");
                    sessionRef.current.sendToolResponse({
                      functionResponses: [{
                        id: call.id,
                        response: { output: data.message || "Catálogo e Apostila EAFU enviados com sucesso." }
                      }]
                    });
                  }
                  setStatus(`Documentos enviados para: ${email}`);
                } catch (err: any) {
                  console.error("Erro ao enviar catálogo:", err);
                  const errorMessage = err.name === 'AbortError' ? "Tempo de resposta excedido" : err.message;
                  
                  if (sessionRef.current) {
                    sessionRef.current.sendToolResponse({
                      functionResponses: [{
                        id: call.id,
                        response: { output: `Erro ao enviar o catálogo: ${errorMessage}` }
                      }]
                    });
                  }
                  setStatus(`Erro no envio: ${errorMessage}`);
                }
              }
            }
          }

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
          
          CATÁLOGO TÉCNICO HAILTOOLS:
          ${catalogContext}
          
          CONHECIMENTOS ESPECÍFICOS HAILTOOLS:
          1. COROCUT 2: Sistema de alta rigidez para canais, corte e perfilamento. Foco em ranhuras de vedação API.
          2. COROTHREAD 266: Estabilidade extrema com iLock™ para roscas offshore (API, NPT).
          3. CORODRILL 880/870/860: Furação de alta performance em materiais exóticos (Super Duplex, Inconel).
          4. COROMILL MF80/490/390: Fresamento pesado e esquadrejamento com tecnologia Inveio™.
          5. SILENT TOOLS: Adaptadores antivibratórios para grandes balanços em mandrilamento profundo.
          
          CONHECIMENTO APOSTILA EAFU (Treinamento):
          - Processo de Escolha: 1. Suporte (geometria), 2. Pastilha (material/geometria), 3. Dados de Corte (ap, fn, Vc).
          - Fórmulas: n = (Vc * 318) / D; Vf = fz * n * Z.
          - Materiais ISO: P (Aços), M (Inoxidáveis), K (Ferros Fundidos), N (Metais não-ferrosos), S (Super ligas), H (Aços endurecidos).
          
          ESPECIALIDADES OFFSHORE:
          - Caldeiraria pesada (ASME VIII, AWS D1.1).
          - Usinagem de materiais CRA (Inconel 625, Duplex).
          - Tolerâncias ISO 286 e acabamentos Ra 0.8 em ranhuras BX/RX.
          
          CONTEXTO DO USUÁRIO:
          - Nome: ${userName}
          - E-mail vinculado: ${userEmail}
          - Documentos já enviados: ${sentDocs.join(', ') || 'Nenhum'}
          
          REGRAS DE INTERAÇÃO:
          - Sua voz é masculina, tom firme, mentor técnico e extremamente prático.
          - Responda: "Para este canal BX em Inconel, recomendo o CoroCut 2 com grade GC1125 e geometria -TF".
          - Você é um consultor por voz. Fale de forma clara e objetiva.
          - FOCO EM OTIMIZAÇÃO: Sugira ativamente otimizações de processo (redução de vibração, aumento de produtividade, economia de energia).
          - SUGESTÃO DE DOCUMENTOS: Ao final da conversa (quando o usuário estiver se despedindo ou o assunto estiver encerrado), se o usuário ainda NÃO recebeu os documentos ('catalog' ou 'eafu'), informe que você enviará o Catálogo de Ferramentas e a Apostila de Treinamento EAFU em formato PDF para o e-mail dele (${userEmail}).
          - NÃO peça o e-mail, pois você já tem acesso a ele. Apenas confirme que está enviando.
          - Se o usuário já recebeu, NÃO sugira novamente, a menos que ele pede explicitamente.
          - Use a ferramenta 'enviar_catalogo_email' passando o e-mail vinculado: ${userEmail}.`,
        tools: [
          {
            functionDeclarations: [
              {
                name: 'enviar_catalogo_email',
                description: 'Envia o catálogo técnico e a apostila EAFU da Hailtools em formato PDF para o e-mail vinculado do usuário.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    email: {
                      type: Type.STRING,
                      description: 'O endereço de e-mail vinculado do usuário.'
                    }
                  },
                  required: ['email']
                }
              }
            ]
          }
        ]
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
