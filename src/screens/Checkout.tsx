import React from 'react';
import { motion } from 'motion/react';

interface CheckoutProps {
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack }) => {
  const stripeAnnualLink = "https://buy.stripe.com/eVq8wIew8bv8d904jP3Ru0c";

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button onClick={onBack} className="size-10 flex items-center justify-center text-[#eab308]">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-white font-black text-sm uppercase tracking-widest">Upgrade Premium</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="size-24 rounded-3xl bg-[#eab308] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.3)]"
          >
            <span className="material-symbols-outlined text-black text-4xl">workspace_premium</span>
          </motion.div>
          <h2 className="text-3xl font-black italic text-white mb-2">Acesso Ilimitado</h2>
          <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Libere todas as ferramentas e tabelas</p>
        </div>

        <div className="space-y-4 mb-12">
          {[
            "Todas as Tabelas de Roscas",
            "Verificador ISO Completo",
            "Consultor IA Especialista",
            "Cálculos de Engrenagens",
            "Análise de Desenhos Técnicos",
            "Suporte Prioritário"
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-[#eab308] text-sm">check_circle</span>
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{feature}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#1c1e22] rounded-3xl border border-[#eab308]/20 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#eab308]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <p className="text-[10px] uppercase tracking-widest text-[#eab308] font-black mb-2">Plano Anual</p>
          <div className="flex items-baseline justify-center gap-1 mb-8">
            <span className="text-white text-4xl font-black italic">R$ 299,00</span>
            <span className="text-gray-500 text-xs font-bold uppercase">/ano</span>
          </div>

          <a 
            href={stripeAnnualLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-[#eab308] text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-[0_10px_20px_rgba(234,179,8,0.2)]"
          >
            Pagar com Stripe
          </a>
          
          <p className="mt-6 text-[8px] text-gray-500 uppercase tracking-widest font-bold leading-relaxed">
            Pagamento seguro via Stripe. Cancele a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
