import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CheckoutProps {
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading] = useState(false);
  
  const priceIds = {
    monthly: "price_1T9WFt5cCGgymbBEdUtZVIdV",
    annual: "price_1T9vBN5cCGgymbBEd8pD8GPT"
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: billingCycle === 'monthly' ? priceIds.monthly : priceIds.annual 
        }),
      });
      
      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Todas as Tabelas de Roscas",
    "Tabelas de Tolerância ISO",
    "Consultor IA Ilimitado",
    "Cálculos de Engrenagens",
    "Análise de Desenho por IA",
    "Simulador de Micrômetro"
  ];

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Assinatura PRO</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#eab308] to-transparent" />
          
          <h2 className="text-[#eab308] text-2xl font-black uppercase italic mb-2 tracking-tight">Desbloqueie o Poder Total</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-8">Escolha o plano ideal para sua produção</p>

          <div className="flex bg-black/40 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-[#eab308] text-black' : 'text-gray-500'}`}
            >
              Mensal
            </button>
            <button 
              onClick={() => setBillingCycle('annual')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'annual' ? 'bg-[#eab308] text-black' : 'text-gray-500'}`}
            >
              Anual
            </button>
          </div>

          <div className="flex items-baseline justify-center gap-1 mb-8">
            <span className="text-white text-5xl font-black italic tracking-tighter">
              {billingCycle === 'monthly' ? 'R$ 19,90' : 'R$ 197,00'}
            </span>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              {billingCycle === 'monthly' ? '/mês' : '/ano'}
            </span>
          </div>

          {billingCycle === 'annual' && (
            <p className="text-[#eab308] text-[10px] font-black uppercase tracking-widest mb-6 italic">
              Economize mais de 15% ao ano
            </p>
          )}

          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="block w-full py-5 bg-[#eab308] text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(234,179,8,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : `Assinar ${billingCycle === 'monthly' ? 'Mensal' : 'Anual'}`}
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
            <ShieldCheck size={12} />
            <span className="text-[8px] font-black uppercase tracking-widest">Pagamento Seguro via Stripe</span>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] ml-4 mb-4 italic">O que você recebe:</h3>
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
              <CheckCircle2 size={16} className="text-[#eab308]" />
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
