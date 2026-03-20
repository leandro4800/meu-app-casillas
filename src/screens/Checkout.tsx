import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Crown, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CheckoutProps {
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack }) => {
  const stripeAnnualLink = "https://buy.stripe.com/eVq8wIew8bv8d904jP3Ru0c";

  const features = [
    "Todas as Tabelas de Roscas",
    "Verificador ISO Completo",
    "Consultor IA Especialista",
    "Cálculos de Engrenagens",
    "Análise de Desenhos Técnicos",
    "Suporte Prioritário"
  ];

  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[30%] bg-[#eab308]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Upgrade Premium</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="size-20 rounded-[2rem] bg-gradient-to-br from-[#eab308] to-[#ca8a04] flex items-center justify-center mx-auto mb-6 shadow-[0_20px_40px_rgba(234,179,8,0.3)]"
          >
            <Crown size={40} className="text-black" />
          </motion.div>
          <h2 className="text-3xl font-black italic text-white mb-2 tracking-tight">Acesso Ilimitado</h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-bold">Libere todas as ferramentas e tabelas</p>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-10">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/5"
            >
              <div className="size-6 rounded-full bg-[#eab308]/10 flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} className="text-[#eab308]" />
              </div>
              <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">{feature}</span>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#141414] rounded-[2.5rem] border border-[#eab308]/30 p-8 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#eab308]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <div className="inline-block px-3 py-1 rounded-full bg-[#eab308]/10 border border-[#eab308]/20 mb-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#eab308] font-black">Plano Anual</p>
          </div>

          <div className="flex items-baseline justify-center gap-1 mb-8">
            <span className="text-white text-5xl font-black italic tracking-tighter">R$ 299,00</span>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">/ano</span>
          </div>

          <a 
            href={stripeAnnualLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-5 bg-[#eab308] text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(234,179,8,0.25)]"
          >
            Assinar Agora
          </a>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
            <ShieldCheck size={12} />
            <p className="text-[8px] uppercase tracking-widest font-bold">
              Pagamento seguro via Stripe
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
