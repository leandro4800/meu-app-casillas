
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

interface AgentLog {
  id: string;
  type: 'action' | 'info';
  message: string;
  data?: any;
}

interface AIAgentProps {
  t: any;
}

const AIAgent: React.FC<AIAgentProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'leads'>('tasks');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs, response]);

  // Declaração de Funções que o Agente pode chamar
  const registrarFerramentaFunc: FunctionDeclaration = {
    name: 'registrar_ferramenta',
    parameters: {
      type: Type.OBJECT,
      description: 'Cria uma nova entrada técnica no catálogo de ferramentas do usuário.',
      properties: {
        codigo: { type: Type.STRING, description: 'Código ISO da ferramenta.' },
        classe: { type: Type.STRING, description: 'Classe de dureza (ex: GC4325).' },
        geometria: { type: Type.STRING, description: 'Tipo de quebra-cavaco ou geometria.' },
        vc: { type: Type.NUMBER, description: 'Velocidade de corte recomendada.' },
        fz: { type: Type.NUMBER, description: 'Avanço por dente recomendado.' }
      },
      required: ['codigo', 'classe', 'vc', 'fz']
    }
  };

  const gerarRelatorioFunc: FunctionDeclaration = {
    name: 'gerar_relatorio_producao',
    parameters: {
      type: Type.OBJECT,
      description: 'Gera um cronograma ou relatório de produção industrial formatado.',
      properties: {
        titulo: { type: Type.STRING },
        prioridades: { type: Type.ARRAY, items: { type: Type.STRING } },
        lead_time_estimado: { type: Type.STRING }
      }
    }
  };

  const runAgent = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse(null);
    
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
      setResponse("Erro: Chave API não encontrada ou inválida. Verifique as configurações do projeto.");
      setLoading(false);
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = activeTab === 'tasks' 
      ? `Você é o "Mestre de PCP Casillas", capaz de agir sobre o inventário técnico.
         Sua missão: Organizar a produção. Se o usuário mencionar novas ferramentas ou processos, use as ferramentas disponíveis para registrá-las ou documentá-las.`
      : `Você é o "Estrategista de Negócios Casillas". Use sua inteligência para converter demandas em propostas comerciais e relatórios de viabilidade.`;

    try {
      const result = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: { 
          systemInstruction: systemInstruction,
          temperature: 0.1,
          tools: [{ functionDeclarations: [registrarFerramentaFunc, gerarRelatorioFunc] }]
        }
      });

      // Processar Chamadas de Função
      if (result.functionCalls) {
        for (const fc of result.functionCalls) {
          const newLog: AgentLog = {
            id: Math.random().toString(),
            type: 'action',
            message: `Agente executando: ${fc.name === 'registrar_ferramenta' ? 'Registro de Ferramental' : 'Geração de Relatório'}`,
            data: fc.args
          };
          setLogs(prev => [...prev, newLog]);
          
          // Simulação de resposta de ferramenta para o modelo
          // Em um app completo, aqui você atualizaria o localStorage ou banco de dados
        }
      }

      setResponse(result.text || "Operação executada com sucesso. Verifique os logs de atividade.");
    } catch (e: any) {
      console.error("Erro Agente:", e);
      setResponse(`Erro no link de dados estratégicos: ${e.message || 'Verifique sua chave API.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0908] text-white p-6 overflow-hidden pb-32">
      <div className="shrink-0 space-y-2 mb-6">
        <div className="flex items-center gap-3">
           <div className="size-10 rounded-xl bg-[#eab308]/10 flex items-center justify-center border border-[#eab308]/20">
              <span className="material-symbols-outlined text-[#eab308]">business_center</span>
           </div>
           <div>
              <h2 className="text-[#eab308] text-2xl font-black uppercase italic tracking-tight leading-none">{t.active_management || 'Gestão Ativa'}</h2>
              <p className="text-gray-600 text-[8px] font-black uppercase tracking-[0.4em] mt-1">Industrial Intelligence Agent</p>
           </div>
        </div>
      </div>

      <div className="shrink-0 flex bg-[#1c1e22] p-1.5 rounded-[24px] border border-white/5 mb-6">
         <button 
           onClick={() => setActiveTab('tasks')}
           className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'tasks' ? 'bg-[#eab308] text-black shadow-xl' : 'text-gray-500'}`}
         >
           {t.active_planner || 'Planejador Ativo'}
         </button>
         <button 
           onClick={() => setActiveTab('leads')}
           className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-[#eab308] text-black shadow-xl' : 'text-gray-500'}`}
         >
           {t.strategy || 'Estratégia'}
         </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-1">
        <div className="bg-[#1c1816] rounded-[32px] p-6 border border-white/5 space-y-4 shadow-2xl relative">
           <textarea 
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             placeholder={activeTab === 'tasks' 
               ? (t.agent_tasks_placeholder || "Ex: Registre uma nova fresa CoroMill 390, classe 4340, Vc 180...") 
               : (t.agent_strategy_placeholder || "Ex: Gere um cronograma de produção para 20 flanges API 6A...")}
             className="w-full bg-[#0a0908] border border-white/5 rounded-2xl p-5 text-sm text-gray-300 focus:ring-1 focus:ring-[#eab308] outline-none h-32 resize-none"
           />

           <button 
             onClick={runAgent}
             disabled={loading || !prompt}
             className="w-full bg-[#eab308] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-20 shadow-xl"
           >
              {loading ? (
                <div className="size-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-[11px] uppercase tracking-[0.2em]">{t.execute_task || 'Executar Tarefa'}</span>
                  <span className="material-symbols-outlined text-xl">bolt</span>
                </>
              )}
           </button>
        </div>

        {logs.length > 0 && (
          <div className="space-y-3">
            <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest ml-2">{t.recent_agent_activities || 'Atividades Recentes do Agente'}</p>
            {logs.map(log => (
              <div key={log.id} className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex gap-4 animate-in slide-in-from-left duration-300">
                 <span className="material-symbols-outlined text-blue-400">task_alt</span>
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{log.message}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                       {log.data && Object.entries(log.data).map(([k, v]: any) => (
                         <div key={k} className="bg-black/20 p-2 rounded-lg border border-white/5">
                            <span className="text-[7px] text-gray-600 font-bold uppercase block">{k}</span>
                            <span className="text-[10px] text-white font-mono">{v}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {response && (
          <div className="bg-[#1c1816]/80 rounded-[32px] p-8 border-l-4 border-[#eab308] shadow-2xl relative">
             <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-medium italic">
                {response}
             </div>
             <button 
                onClick={() => navigator.clipboard.writeText(response)}
                className="mt-6 flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white"
              >
                 <span className="material-symbols-outlined text-sm">content_copy</span>
                 {t.copy_report || 'Copiar Relatório'}
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgent;
