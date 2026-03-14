
import React, { useState, useEffect, useRef } from 'react';
import { AVATAR_URL } from '../constants';
import { User, Language } from '../types';

interface ProfileProps {
  user: User | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  isAdmin: boolean;
  onToggleAdmin: (val: boolean) => void;
  canInstall?: boolean;
  onInstallApp?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, language, setLanguage, t, onUpdateUser, onLogout, isAdmin, onToggleAdmin, canInstall, onInstallApp }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<User>>({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
    company: user?.company || '',
    role: user?.role || '',
    phone: user?.phone || ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName,
        photoURL: user.photoURL,
        company: user.company || '',
        role: user.role || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    const updatedUser: User = {
      ...user,
      displayName: formData.displayName || user.displayName,
      photoURL: formData.photoURL || user.photoURL || AVATAR_URL,
      company: formData.company || '',
      role: formData.role || '',
      phone: formData.phone || ''
    };

    try {
      await onUpdateUser(updatedUser);
      setIsEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      if (navigator.vibrate) navigator.vibrate(50);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Erro ao salvar perfil. Tente novamente.");
    }
  };

  const handleChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, photoURL: base64String }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Vitalício';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex flex-col h-full bg-rust-dark text-white overflow-y-auto custom-scrollbar pb-32">
      <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e)} accept="image/*" className="hidden" />

      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#eab308] text-black px-8 py-4 rounded-[20px] font-black text-xs uppercase shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-10 duration-500">
           <span className="material-symbols-outlined text-lg">verified</span>
           {t.profile_updated || 'Perfil Técnico Atualizado'}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0908]/90 backdrop-blur-xl p-4 flex justify-between items-center border-b border-white/5">
         <div className="flex flex-col">
            <h2 className="text-[#eab308] font-black text-[10px] uppercase tracking-[0.2em]">{t.settings || 'Configurações'}</h2>
            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{t.professional_session || 'Sessão Profissional'}</p>
         </div>
         <button 
           onClick={() => isEditing ? handleSave() : setIsEditing(true)}
           className={`px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${isEditing ? 'bg-[#eab308] text-black' : 'bg-white/5 text-[#eab308] border border-[#eab308]/20'}`}
         >
           {isEditing ? (t.confirm || 'Confirmar') : (t.change_data || 'Alterar Dados')}
         </button>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center py-10">
        <div className="relative group">
           <button 
             onClick={() => isEditing && fileInputRef.current?.click()}
             className={`size-28 rounded-full border-[4px] border-[#eab308] p-1 bg-[#1c1816] shadow-2xl overflow-hidden transition-all ${isEditing ? 'active:scale-95' : ''}`}
           >
              <img src={formData.photoURL || AVATAR_URL} className="w-full h-full rounded-full object-cover bg-[#0a0908]" alt={t.photo || 'Foto'} />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="material-symbols-outlined text-white">add_a_photo</span>
                </div>
              )}
           </button>
        </div>
        {!isEditing && (
          <h3 className="text-[#eab308] text-2xl font-black tracking-tight uppercase italic mt-4">{formData.displayName || (t.operator || 'OPERADOR')}</h3>
        )}
      </div>

      <div className="px-6 space-y-8">
        {/* User Data */}
        <section className="space-y-4">
           <p className="text-gray-800 text-[9px] font-black uppercase tracking-[0.4em] ml-2">{t.technical_identification || 'Identificação Técnica'}</p>
           <div className="bg-[#1c1816]/60 rounded-[32px] border border-white/5 divide-y divide-white/5 overflow-hidden shadow-xl">
              <ProfileItem label={t.full_name || 'Nome Completo'} value={formData.displayName || ''} icon="person" isEditing={isEditing} onChange={(v: string) => handleChange('displayName', v)} />
              <ProfileItem label={t.company || 'Empresa'} value={formData.company || ''} icon="apartment" isEditing={isEditing} onChange={(v: string) => handleChange('company', v)} />
              <ProfileItem label={t.role || 'Cargo'} value={formData.role || ''} icon="engineering" isEditing={isEditing} onChange={(v: string) => handleChange('role', v)} />
              <ProfileItem label={t.contact || 'Contato'} value={formData.phone || ''} icon="call" isEditing={isEditing} onChange={(v: string) => handleChange('phone', v)} />
           </div>
        </section>

        {/* Subscription Status */}
        <section className="bg-gradient-to-br from-[#eab308]/10 to-transparent rounded-[32px] p-6 border border-[#eab308]/20 flex items-center justify-between shadow-lg">
           <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-[#eab308] flex items-center justify-center text-black shadow-xl">
                 <span className="material-symbols-outlined font-black">verified</span>
              </div>
              <div>
                 <p className="text-white font-black text-sm uppercase tracking-tight">{t.plan || 'Plano'} {user?.plan === 'annual' ? (t.annual_pro || 'Anual Pro') : user?.plan === 'monthly' ? (t.monthly_pro || 'Mensal Pro') : (t.free || 'Free')}</p>
                 <p className="text-[9px] text-[#eab308] font-black uppercase tracking-widest">{t.valid_until || 'Válido até'}: {formatDate(user?.expiryDate)}</p>
              </div>
           </div>
           {user?.plan === 'free' && (
             <button onClick={() => window.location.href = '/checkout'} className="bg-white text-black text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest hover:bg-[#eab308] transition-colors">{t.upgrade || 'Upgrade'}</button>
           )}
        </section>

        {user?.email === '48mineiro@gmail.com' && (
          <section className="bg-[#1c1816] rounded-[32px] p-6 border border-white/5 space-y-4 shadow-xl">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`size-3 rounded-full ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status da API Gemini</p>
                </div>
                <p className="text-[10px] font-black uppercase text-white">{process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10 ? 'Conectado' : 'Desconectado'}</p>
             </div>
             
             <div className="pt-4 border-t border-white/5 space-y-3">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-tight">
                  Se a IA não estiver funcionando, você pode inserir uma chave manualmente abaixo:
                </p>
                <div className="flex gap-2">
                   <input 
                     type="password" 
                     placeholder="Inserir Chave Manual (opcional)" 
                     className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white outline-none focus:border-[#eab308]/50"
                     value={localStorage.getItem('manual_gemini_key') || ''}
                     onChange={(e) => {
                       localStorage.setItem('manual_gemini_key', e.target.value);
                       // Forçar re-render se necessário ou apenas salvar
                     }}
                   />
                   <button 
                     onClick={() => {
                       localStorage.removeItem('manual_gemini_key');
                       window.location.reload();
                     }}
                     className="bg-red-500/10 text-red-500 text-[8px] font-black px-3 py-2 rounded-xl border border-red-500/20 uppercase"
                   >
                     Limpar
                   </button>
                </div>
             </div>
          </section>
        )}

        {canInstall && (
          <button 
            onClick={onInstallApp}
            className="w-full bg-[#eab308] text-black font-black py-5 rounded-[28px] flex items-center justify-center gap-3 shadow-xl active:scale-95 uppercase text-[10px] tracking-widest animate-pulse"
          >
            <span className="material-symbols-outlined">install_mobile</span>
            {t.install_app || 'Instalar Aplicativo (PWA)'}
          </button>
        )}

        <button onClick={onLogout} className="w-full bg-[#1c1816] text-red-500 font-black py-5 rounded-[28px] flex items-center justify-center gap-3 shadow-xl active:scale-95 uppercase text-[10px] tracking-widest">
           <span className="material-symbols-outlined">power_settings_new</span>
           {t.logout || 'Encerrar Sessão'}
        </button>
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value, icon, isEditing, onChange }: any) => (
  <div className="p-5 flex items-center gap-5">
    <div className="size-10 rounded-xl bg-[#0a0908] flex items-center justify-center text-gray-700 border border-white/5">
      <span className="material-symbols-outlined text-lg">{icon}</span>
    </div>
    <div className="flex-1">
      <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest leading-none mb-1">{label}</p>
      {isEditing ? (
        <input type="text" value={value} onChange={(e) => onChange?.(e.target.value)} className="bg-transparent border-none p-0 text-white font-black text-sm focus:ring-0 w-full outline-none" />
      ) : (
        <p className="font-black text-sm tracking-tight text-white uppercase italic">{value || '---'}</p>
      )}
    </div>
  </div>
);

export default Profile;
