import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

const AIAgent: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: userMessage,
        config: {
          systemInstruction: "Você é o Consultor Técnico Casillas, um especialista em usinagem, mecânica industrial e engenharia. Forneça respostas precisas, técnicas e práticas. Use tabelas e listas quando apropriado."
        }
      });
      const text = response.text;
      setMessages(prev => [...prev, { role: 'model', content: text || "Sem resposta." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "Desculpe, ocorreu um erro ao processar sua solicitação." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-[#eab308]">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col">
          <h1 className="text-white font-black text-sm uppercase tracking-widest">Consultor IA</h1>
          <p className="text-[#eab308] text-[8px] font-black uppercase tracking-[0.2em]">Especialista em Usinagem</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-32">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-3xl ${msg.role === 'user' ? 'bg-[#eab308] text-black rounded-tr-none' : 'bg-[#1c1e22] text-white rounded-tl-none border border-white/5'}`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1c1e22] p-4 rounded-3xl rounded-tl-none border border-white/5">
              <div className="flex gap-1">
                <div className="size-1.5 bg-[#eab308] rounded-full animate-bounce"></div>
                <div className="size-1.5 bg-[#eab308] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="size-1.5 bg-[#eab308] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0908] via-[#0a0908] to-transparent">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre ferramentas, materiais..."
            className="w-full bg-[#1c1e22] border border-white/10 rounded-full py-4 pl-6 pr-16 text-sm focus:outline-none focus:border-[#eab308]/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 size-12 bg-[#eab308] rounded-full flex items-center justify-center text-black active:scale-90 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined font-black">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
