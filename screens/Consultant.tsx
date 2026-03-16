
import React, { useState, useEffect, useRef } from 'react';
import { CASILLAS_CONSULTANT_IMAGE, HAILTOOLS_CATALOG, MATERIALS } from '../constants';
import { Screen, User } from '../types';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

interface ChatMessage {
  role: 'user' | 'casillas';
  text: string;
  isStreaming?: boolean;
}

const Consultant: React.FC<{ navigate: (s: Screen) => void; t: any; user: User | null }> = ({ navigate, t, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'casillas', 
      text: t.consultant_welcome || 'Olá, sou o Engenheiro Casillas, especialista em usinagem e caldeiraria. Qual o desafio técnico na bancada hoje?' 
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userText = input;
    const currentHistory = [...messages];
    const newMessages: ChatMessage[] = [...currentHistory, { role: 'user', text: userText }];
    
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const getApiKey = () => {
      const manualKey = localStorage.getItem('manual_gemini_key');
      if (manualKey && manualKey.length > 10) return manualKey.trim();
      
      const key = (
        process.env.GEMINI_API_KEY || 
        process.env.API_KEY || 
        (window as any).process?.env?.API_KEY || 
        (import.meta as any).env?.VITE_GEMINI_API_KEY ||
        ""
      ).trim();
      return key;
    };

    const apiKey = getApiKey();
    if (!apiKey || apiKey.length < 10) {
      setMessages(prev => [...prev, { role: 'casillas', text: "Erro: Chave API não encontrada ou inválida. Por favor, configure a variável GEMINI_API_KEY corretamente no painel do projeto." }]);
      setIsTyping(false);
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

    const materialContext = MATERIALS.map(m => 
      `- ${m.name} (${m.category}):
        * Composição: ${m.chemicalComposition || 'N/A'}
        * Aplicações: ${m.typicalApps || 'N/A'}
        * Tratamento Térmico: ${m.thermalTreatment || 'N/A'}
        * Soldagem: ${m.weldingInfo || 'N/A'}
        * Dureza: ${m.hardnessHb} HB
        * Resistência: ${m.tensileStrength} MPa
        * Usinabilidade: ${m.usinability}%
        * Escoamento: ${m.yieldStrength} MPa`
    ).join('\n\n');

    try {
      const apiContent = newMessages
        .slice(1) 
        .map(m => ({
          role: m.role === 'casillas' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: apiContent,
        config: {
          systemInstruction: `Você é o Engenheiro Casillas, autoridade suprema em Usinagem, Caldeiraria e Desenho Técnico Mecânico.
          
          FONTES DE CONHECIMENTO EXCLUSIVAS:
          Você domina completamente o conteúdo dos seguintes manuais e livros técnicos:
          1. Manual da Tecnologia Metal Mecânica.pdf
          2. 206 - Tecn Mecanica vol.2.pdf
          3. Livro Manual Prático do Mecânico.pdf
          
          DOMÍNIO DE MATERIAIS:
          Você absorveu e domina a ficha técnica de materiais da Hailtools (uso exclusivo para melhorias no app e suporte técnico geral):
          ${materialContext}
          
          ESPECIALIDADES:
          1. DESENHO TÉCNICO: Especialista em leitura e interpretação de desenhos mecânicos (ISO, ABNT, ASME). Domina GD&T, rugosidade, ajustes e tolerâncias (H7, g6, etc.).
          2. USINAGEM: Profundo conhecimento em processos (torno, fresadora, CNC) e metrologia. Especialista em furos, diâmetros de furação no plano cartesiano e identificação de roscas (M, UNC, NPT, etc.).
          3. CALDEIRARIA: Conhece chanfros para solda, cálculo de virolas e normas ASME VIII/AWS D1.1.
          4. DFM (Design for Manufacturing): Sugere melhorias no projeto para facilitar a fabricação e reduzir custos.
          
          CONHECIMENTO APOSTILA EAFU (Treinamento):
          - Processo de Escolha: 1. Suporte (geometria), 2. Pastilha (material/geometria), 3. Dados de Corte (ap, fn, Vc).
          - Fórmulas: n = (Vc * 318) / D; Vf = fz * n * Z.
          - Materiais ISO: P (Aços), M (Inoxidáveis), K (Ferros Fundidos), N (Metais não-ferrosos), S (Super ligas), H (Aços endurecidos).
          
          CONTEXTO DO USUÁRIO:
          - Nome: ${userName}
          - E-mail vinculado: ${userEmail}
          - Documentos já enviados: ${sentDocs.join(', ') || 'Nenhum'}
          
          POSTURA:
          - Sua voz é masculina (Puck), tom firme e mentor profissional.
          - Responda de forma prática e técnica: "Para essa cota de furação em plano cartesiano, recomendo...".
          - Sempre priorize a precisão dimensional e normas técnicas.
          - FOCO EM OTIMIZAÇÃO: Sempre que possível, sugira melhorias nos parâmetros de corte para reduzir o tempo de ciclo, aumentar a vida útil da ferramenta ou melhorar o acabamento superficial.
          - SUGESTÃO DE DOCUMENTOS: Ao final da conversa (quando o usuário estiver se despedindo ou o assunto estiver encerrado), se o usuário ainda NÃO recebeu os documentos ('catalog' ou 'eafu'), informe que você enviará o Catálogo de Ferramentas e a Apostila de Treinamento EAFU em formato PDF para o e-mail dele (${userEmail}).
          - NÃO peça o e-mail, pois você já tem acesso a ele. Apenas confirme que está enviando.
          - Se o usuário já recebeu, NÃO sugira novamente, a menos que ele peça explicitamente.
          - Use a ferramenta 'enviar_catalogo_email' passando o e-mail vinculado: ${userEmail}.
          
          CATÁLOGO ATUAL:
          ${catalogContext}`,
          temperature: 0.1,
          tools: [{ functionDeclarations: [
            {
              name: 'enviar_catalogo_email',
              description: 'Envia o catálogo técnico e a apostila EAFU da Hailtools em formato PDF para o e-mail vinculado do usuário.',
              parameters: {
                type: Type.OBJECT,
                properties: {
                  email: { type: Type.STRING, description: 'O endereço de e-mail vinculado do usuário.' }
                },
                required: ['email']
              }
            }
          ] }]
        }
      });

      if (response.functionCalls) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'enviar_catalogo_email') {
            const { email } = fc.args as any;
              try {
                const res = await fetch('/api/send-catalog', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email })
                });
                const data = await res.json();

                if (!res.ok) {
                  throw new Error(data.error || "Erro desconhecido no servidor");
                }

                // Update Firestore
                if (auth.currentUser) {
                  await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    sentDocuments: arrayUnion('catalog', 'eafu')
                  });
                }

                setMessages(prev => [...prev, { role: 'casillas', text: `[SISTEMA]: ${data.message || "Catálogo e Apostila EAFU enviados com sucesso."}` }]);
              } catch (err: any) {
                console.error("Erro ao enviar catálogo:", err);
                setMessages(prev => [...prev, { role: 'casillas', text: `[ERRO]: Não foi possível enviar o e-mail. Detalhes: ${err.message}` }]);
              }
          }
        }
      }

      let currentResponse = response.text || "";
      setMessages(prev => [...prev, { role: 'casillas', text: currentResponse }]);

    } catch (error: any) {
      console.error("Erro Gemini:", error);
      setMessages(prev => [...prev, { role: 'casillas', text: `Erro na transmissão técnica: ${error.message || 'Verifique sua chave API.'}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0908] relative overflow-hidden">
      <div className="bg-[#0a0908]/95 backdrop-blur-md p-6 border-b border-[#eab308]/10 flex items-center gap-5 z-20 shadow-2xl relative">
         <div className="relative">
            <div className="size-16 rounded-2xl border-2 border-[#eab308] overflow-hidden bg-[#1c1e22] shadow-[0_0_20px_rgba(234,179,8,0.2)] flex items-center justify-center">
               <img src={CASILLAS_CONSULTANT_IMAGE} className="w-full h-full object-cover" alt="Consultor Casillas" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-4 bg-[#eab308] rounded-full border-4 border-[#0a0908] animate-pulse"></div>
         </div>
         <div className="flex-1">
            <h2 className="text-white text-xl font-black italic uppercase tracking-tighter leading-none">Eng. Casillas</h2>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-[8px] font-black text-[#eab308] uppercase tracking-[0.4em] bg-[#eab308]/10 px-2 py-0.5 rounded border border-[#eab308]/10">OFFSHORE & WELDING EXPERT</span>
               <span className="material-symbols-outlined text-[10px] text-[#eab308] filled">verified</span>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('voice_consultant')}
              className="size-10 rounded-xl bg-[#eab308]/10 border border-[#eab308]/20 text-[#eab308] flex items-center justify-center hover:bg-[#eab308]/20 transition-all active:scale-95"
              title="Consultor por Voz"
            >
              <span className="material-symbols-outlined">mic</span>
            </button>
            <button 
              onClick={() => navigate('home')} 
              className="size-10 rounded-xl bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
         </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pb-36 relative z-10">
        <div className="flex justify-center">
           <div className="bg-[#eab308]/5 border border-[#eab308]/10 px-4 py-2 rounded-full flex items-center gap-2">
              <span className="material-symbols-outlined text-xs text-[#eab308]">engineering</span>
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{t.active_base_api || 'Base API / ASME / AWS Ativa'}</span>
           </div>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            {msg.role === 'casillas' && (
              <div className="size-10 rounded-xl border border-[#eab308]/30 overflow-hidden shrink-0 bg-black flex items-center justify-center">
                <img src={CASILLAS_CONSULTANT_IMAGE} className="w-full h-full object-cover" alt="" />
              </div>
            )}
            <div className={`p-4 rounded-[24px] shadow-2xl border max-w-[90%] font-sans ${
              msg.role === 'casillas' 
                ? 'bg-[#1c1816] text-gray-100 border-white/5 rounded-tl-none font-medium' 
                : 'bg-[#eab308] text-black font-black rounded-tr-none border-[#eab308]'
            }`}>
              <div className="text-xs leading-[1.4] whitespace-pre-wrap">
                {msg.text}
              </div>
              {msg.isStreaming && (
                <div className="flex gap-1 mt-4">
                  <div className="size-1.5 bg-[#eab308] rounded-full animate-bounce"></div>
                  <div className="size-1.5 bg-[#eab308] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="size-1.5 bg-[#eab308] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-10 left-6 right-6 flex gap-3 bg-[#1c1816]/98 backdrop-blur-2xl p-4 rounded-full border border-white/20 z-30 shadow-[0_20px_80px_rgba(0,0,0,0.9)]">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && handleSend()} 
          className="flex-1 bg-transparent px-6 text-white outline-none text-lg font-medium placeholder:text-gray-600" 
          placeholder={t.consultant_placeholder || "Dúvida técnica (Norma, Chanfro, Tolerância)..."} 
        />
        <button 
          onClick={handleSend} 
          disabled={isTyping || !input.trim()} 
          className="size-16 rounded-full bg-[#eab308] text-black flex items-center justify-center active:scale-90 transition-all shadow-2xl disabled:opacity-20 shrink-0"
        >
          <span className="material-symbols-outlined text-4xl font-black">construction</span>
        </button>
      </div>
    </div>
  );
};

export default Consultant;
