import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Bot, User } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Screen } from '../types';

const AIAgent: React.FC<{ onBack: () => void, navigate: (screen: Screen) => void }> = ({ onBack, navigate }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          systemInstruction: "Você é o Consultor Técnico Casillas, um especialista em usinagem, mecânica industrial e engenharia. Você tem acesso a todo o conhecimento do Formulário Técnico Casillas. Forneça respostas precisas, técnicas e práticas em português do Brasil. Use tabelas, listas e fórmulas quando apropriado. Seja direto e profissional."
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from API');
      }

      const data = await response.json();
      const text = data.text;
      setMessages(prev => [...prev, { role: 'model', content: text || "Sem resposta." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "Desculpe, ocorreu um erro ao processar sua solicitação. Verifique sua conexão ou chave de API." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-white font-black text-sm uppercase tracking-widest italic">Consultor IA</h1>
          <p className="text-[#eab308] text-[8px] font-black uppercase tracking-[0.2em]">Especialista em Usinagem</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-32">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-8">
            <Bot size={64} className="mb-4 text-[#eab308]" />
            <p className="text-white text-xs font-black uppercase tracking-widest leading-relaxed">
              Olá! Eu sou o assistente técnico Casillas. Como posso ajudar na sua produção hoje?
            </p>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col gap-2 max-w-[90%]">
                <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`size-6 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-[#eab308]' : 'bg-white/10'}`}>
                    {msg.role === 'user' ? <User size={12} className="text-black" /> : <Bot size={12} className="text-[#eab308]" />}
                  </div>
                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
                    {msg.role === 'user' ? 'Você' : 'Casillas IA'}
                  </span>
                </div>
                <div className={`p-5 rounded-3xl ${
                  msg.role === 'user' 
                    ? 'bg-[#eab308] text-black rounded-tr-none font-bold' 
                    : 'bg-[#1c1e22] text-white rounded-tl-none border border-white/5 shadow-xl'
                }`}>
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-[#eab308] prose-headings:font-black prose-headings:italic prose-strong:text-[#eab308] prose-p:text-inherit">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1c1e22] p-4 rounded-3xl rounded-tl-none border border-white/5">
              <div className="flex gap-1.5">
                <div className="size-2 bg-[#eab308] rounded-full animate-bounce"></div>
                <div className="size-2 bg-[#eab308] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="size-2 bg-[#eab308] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-20 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0908] via-[#0a0908] to-transparent z-10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tire suas dúvidas técnicas..."
            className="w-full bg-[#1c1e22] border border-white/10 rounded-full py-5 pl-6 pr-16 text-sm text-white focus:outline-none focus:border-[#eab308]/50 transition-all shadow-2xl"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 size-12 bg-[#eab308] rounded-full flex items-center justify-center text-black active:scale-90 transition-all disabled:opacity-50 shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <BottomNav currentScreen="ai_agent" navigate={navigate} />
    </div>
  );
};

export default AIAgent;
