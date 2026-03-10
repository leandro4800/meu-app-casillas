
import React, { useState } from 'react';
import { User } from '../types';

interface CheckoutProps {
  user: User | null;
  onComplete: (plan: 'monthly' | 'annual') => void;
  t: any;
}

const Checkout: React.FC<CheckoutProps> = ({ user, onComplete, t }) => {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading] = useState(false);

  const monthlyPrice = 29.90;
  const annualPrice = 299.00;

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          email: user?.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Erro ao criar sessão de checkout');
      }
    } catch (error: any) {
      console.error('Erro no pagamento:', error);
      alert('Erro ao processar pagamento. Verifique se as chaves do Stripe estão configuradas corretamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#161412] text-white overflow-y-auto custom-scrollbar pb-32">
      <div className="p-8 text-center space-y-4 pt-12">
        <div className="size-20 bg-[#eab308]/10 rounded-3xl mx-auto flex items-center justify-center border border-[#eab308]/20 shadow-2xl relative">
           <span className="material-symbols-outlined text-[#eab308] text-4xl">lock_open</span>
           <div className="absolute -bottom-2 -right-2 size-8 bg-green-500 rounded-full border-4 border-[#161412] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xs font-black">verified_user</span>
           </div>
        </div>
        <h2 className="text-[#eab308] text-4xl font-black uppercase italic tracking-tighter leading-none">LIBERAR ACESSO</h2>
        <div className="flex items-center justify-center gap-2 bg-green-500/10 py-1 px-3 rounded-full border border-green-500/20 w-fit mx-auto">
           <span className="material-symbols-outlined text-[10px] text-green-500">lock</span>
           <p className="text-green-500 text-[8px] font-black uppercase tracking-widest">Conexão HTTPS Segura (SSL)</p>
        </div>
      </div>

      <div className="px-6 space-y-4">
        <button 
          onClick={() => setPlan('annual')}
          className={`w-full p-6 rounded-[32px] border-2 transition-all relative flex items-center gap-6 ${plan === 'annual' ? 'bg-[#eab308] border-[#eab308] text-black shadow-2xl' : 'bg-[#221e1b] border-white/5 text-gray-500'}`}
        >
          <div className="absolute -top-3 right-8 bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full shadow-lg">ECONOMIA DE 16%</div>
          <div className="size-12 rounded-2xl bg-black/10 flex items-center justify-center">
             <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <div className="text-left">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Plano Anual Profissional</p>
             <p className="text-2xl font-black">R$ {annualPrice.toFixed(2)}<span className="text-xs opacity-60 ml-1">/ano</span></p>
          </div>
        </button>

        <button 
          onClick={() => setPlan('monthly')}
          className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center gap-6 ${plan === 'monthly' ? 'bg-[#eab308] border-[#eab308] text-black shadow-2xl' : 'bg-[#221e1b] border-white/5 text-gray-500'}`}
        >
          <div className="size-12 rounded-2xl bg-black/10 flex items-center justify-center">
             <span className="material-symbols-outlined text-2xl">calendar_month</span>
          </div>
          <div className="text-left">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Plano Mensal Flexível</p>
             <p className="text-2xl font-black">R$ {monthlyPrice.toFixed(2)}<span className="text-xs opacity-60 ml-1">/mês</span></p>
          </div>
        </button>
      </div>

      <div className="p-6 mt-8 space-y-8">
        <div className="bg-[#221e1b] rounded-3xl p-6 border border-white/5 space-y-4">
           <h4 className="text-white font-black text-[10px] uppercase tracking-widest border-b border-white/5 pb-3">Incluso no seu acesso:</h4>
           {[
             'Consultor IA com Gemini 3 Pro',
             'Tabelas ISO de Tolerância e Roscas',
             'Cálculos de RPM, Avanço e Engrenagens',
             // 'Biblioteca Hailtools e Materiais',
             'Simulador de Micrômetro'
           ].map(item => (
             <div key={item} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#eab308] text-sm">check_circle</span>
                <span className="text-[11px] font-bold text-gray-400">{item}</span>
             </div>
           ))}
        </div>

        <div className="space-y-4">
           <button 
             onClick={handleStripePayment}
             disabled={loading}
             className="w-full bg-[#635bff] text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase text-sm tracking-widest active:scale-95 transition-all disabled:opacity-50"
           >
              {loading ? (
                <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined">payments</span>
                  Pagar com Stripe
                </>
              )}
           </button>
           <div className="flex flex-col items-center gap-4 mt-6">
              <div className="flex items-center gap-4 opacity-30">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4 grayscale invert" alt="Stripe" />
                 <div className="h-4 w-px bg-white/20"></div>
                 <span className="text-[8px] font-black uppercase tracking-widest">SSL 256-bit AES</span>
              </div>
              <p className="text-gray-600 text-[8px] uppercase font-bold text-center">
                 Ambiente de pagamento certificado PCI-DSS. Suas informações de faturamento nunca são armazenadas em nossos servidores.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
