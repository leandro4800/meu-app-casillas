
import React, { useState, useEffect } from 'react';
import { APP_LOGO_URL } from '../constants';

interface LoginProps {
  onLogin: (user: any) => void;
  onDevAccess: () => void;
  t: any;
}

const Login: React.FC<LoginProps> = ({ onLogin, onDevAccess, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('casillas_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (rememberEmail) {
      localStorage.setItem('casillas_remembered_email', email);
    } else {
      localStorage.removeItem('casillas_remembered_email');
    }

    setTimeout(() => {
      if (email === '48mineiro@gmail.com' && password === 'delabela48') {
        onLogin({
          id: 'admin_1',
          name: '48 Mineiro',
          email: '48mineiro@gmail.com',
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mineiro',
          plan: 'annual',
          isDev: true,
          company: 'Casillas Tech',
          role: 'Administrador Industrial',
          sector: 'Gestão Geral',
          phone: '(31) 99999-9999'
        });
      } else if (email && password.length >= 6) {
        onLogin({
          id: Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0].toUpperCase(),
          email: email,
          photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          plan: 'free',
          isDev: false,
          company: '',
          role: 'Técnico Operador',
          sector: '',
          phone: ''
        });
      } else {
        setError('Dados incorretos. Verifique as credenciais técnicas.');
        setLoading(false);
      }
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'google_' + Math.random().toString(36).substr(2, 5),
        name: 'USUÁRIO GOOGLE',
        email: 'usuario@gmail.com',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
        plan: 'free',
        isDev: false,
        company: 'Unidade Google',
        role: 'Consultor Externo',
        phone: ''
      });
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-[#161412] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale" alt="" />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-10 animate-in fade-in zoom-in duration-700">
        <div className="space-y-4">
           <div className="size-28 bg-[#221e1b] rounded-[2.5rem] border-2 border-[#eab308] mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.25)] overflow-hidden">
              <img src={APP_LOGO_URL} alt="Logo Casillas" className="w-[80%] h-[80%] object-contain" />
           </div>
           <h1 className="text-[#eab308] text-5xl font-black uppercase italic tracking-tighter">CASILLAS</h1>
           <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Acesso ao Formulário Técnico</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
           <div className="space-y-1 text-left">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">ID de Usuário / Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: tecnico@empresa.com"
                className="w-full bg-[#221e1b] border border-white/5 rounded-2xl h-14 px-6 text-white placeholder:text-gray-700 focus:border-[#eab308]/50 outline-none transition-all shadow-inner"
                required
              />
           </div>

           <div className="space-y-1 text-left">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">Senha de Acesso</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#221e1b] border border-white/5 rounded-2xl h-14 px-6 text-white placeholder:text-gray-700 focus:border-[#eab308]/50 outline-none transition-all shadow-inner"
                required
              />
           </div>

           <div className="flex items-center justify-between px-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                 <div 
                   onClick={() => setRememberEmail(!rememberEmail)}
                   className={`size-5 rounded-md border-2 transition-all flex items-center justify-center ${rememberEmail ? 'bg-[#eab308] border-[#eab308]' : 'border-white/10 bg-[#221e1b]'}`}
                 >
                    {rememberEmail && <span className="material-symbols-outlined text-black text-xs font-black">check</span>}
                 </div>
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-300">Manter conectado</span>
              </label>
              <button type="button" className="text-[9px] font-black text-[#eab308]/60 uppercase tracking-widest hover:text-[#eab308]">Esqueci a Senha</button>
           </div>

           {error && (
             <div className="bg-red-500/10 border border-red-500/20 py-3 rounded-xl animate-shake">
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
             </div>
           )}

           <div className="space-y-3 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#eab308] text-black font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(234,179,8,0.2)] flex items-center justify-center gap-3 active:scale-95 transition-all uppercase tracking-widest text-sm"
              >
                 {loading ? (
                   <div className="size-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                 ) : (
                   <>EFETUAR LOGIN</>
                 )}
              </button>

              <div className="flex items-center gap-3 px-8">
                 <div className="h-px flex-1 bg-white/5"></div>
                 <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">OU</span>
                 <div className="h-px flex-1 bg-white/5"></div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all uppercase tracking-widest text-[11px] border border-gray-200"
              >
                 <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="size-5" alt="Google" />
                 {t.login_google || 'Entrar com Google'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
