
import React, { useState, useEffect, useMemo } from 'react';
import { Screen, User, Language } from './types';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import { translations } from './i18n';

// Screens
import Login from './screens/Login';
import Home from './screens/Home';
import Consultant from './screens/Consultant';
import AIAgent from './screens/AIAgent';
import Profile from './screens/Profile';
import MachiningParams from './screens/MachiningParams';
import Trigonometry from './screens/Trigonometry';
import ThreadTables from './screens/ThreadTables';
import ToleranceTables from './screens/ToleranceTables';
import ShacklesTable from './screens/ShacklesTable';
import ArcCalc from './screens/ArcCalc';
import DividerCalc from './screens/DividerCalc';
import GearCalc from './screens/GearCalc';
import WeightCalc from './screens/WeightCalc';
import Conversion from './screens/Conversion';
import Glossary from './screens/Glossary';
import MaterialComparison from './screens/MaterialComparison';
import ToolLibrary from './screens/ToolLibrary';
import MaterialsScreen from './screens/MaterialsScreen';
import Micrometer from './screens/Micrometer';
import Verifier from './screens/Verifier';
import Checkout from './screens/Checkout';
import ToolDetail from './screens/ToolDetail';
import ToolEditor from './screens/ToolEditor';
import AISuite from './screens/AISuite';
import VoiceConsultant from './screens/VoiceConsultant';
import MediaLab from './screens/MediaLab';
import DrawingAnalysis from './screens/DrawingAnalysis';
import Welcome from './screens/Welcome';

import { HAILTOOLS_CATALOG } from './constants';
import { ToolInsert } from './types';
import { GoogleGenAI } from "@google/genai";

const PERSISTENCE_KEY = 'casillas_v1_auth_session';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [language, setLanguage] = useState<Language>('pt_BR');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const [catalog, setCatalog] = useState<ToolInsert[]>(HAILTOOLS_CATALOG);
  const [selectedTool, setSelectedTool] = useState<ToolInsert | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const initApp = () => {
      // Verificar retorno do Stripe
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      const sessionId = urlParams.get('session_id');

      // Carregar Sessão
      const savedSession = localStorage.getItem(PERSISTENCE_KEY);
      let currentUser: User | null = null;

      if (savedSession) {
        try {
          currentUser = JSON.parse(savedSession) as User;
          
          if (paymentStatus === 'success' && sessionId) {
            // Em um app real, verificaríamos o sessionId no backend
            currentUser.plan = 'annual'; // Ou 'monthly' dependendo da lógica
            currentUser.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
            localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(currentUser));
            alert('Assinatura Pro ativada com sucesso!');
            // Limpar URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else if (paymentStatus === 'cancel') {
            alert('Pagamento cancelado.');
            window.history.replaceState({}, document.title, window.location.pathname);
          }

          setUser(currentUser);
          setCurrentScreen('home');
        } catch (e) {
          localStorage.removeItem(PERSISTENCE_KEY);
        }
      }
      
      setIsReady(true);
    };
    initApp();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const t = useMemo(() => translations[language], [language]);

  useEffect(() => {
    const checkSession = async () => {
      if (user && (user as any).sessionId) {
        try {
          const res = await fetch('/api/session/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, sessionId: (user as any).sessionId })
          });
          const data = await res.json();
          if (data.valid === false) {
            setUser(null);
            localStorage.removeItem(PERSISTENCE_KEY);
            setCurrentScreen('login');
            alert("Esta conta foi conectada em outro dispositivo. Você foi desconectado.");
          }
        } catch (err) {
          console.error("Session check error:", err);
        }
      }
    };

    const interval = setInterval(checkSession, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [user]);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setIsSidebarOpen(false);
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const renderScreen = () => {
    if (!user && !['login', 'welcome'].includes(currentScreen)) {
      return <Welcome onStart={() => navigate('login')} />;
    }

    // Paywall Logic: Only 48mineiro@gmail.com or paid plans have access to the app
    const isVip = user?.email === '48mineiro@gmail.com' || user?.isDev;
    const hasPaid = user?.plan && user.plan !== 'free';
    const isPublicScreen = ['login', 'welcome', 'checkout'].includes(currentScreen);

    if (user && !isVip && !hasPaid && !isPublicScreen) {
      return (
        <Checkout 
          user={user} 
          t={t} 
          onLogout={() => {setUser(null); localStorage.removeItem(PERSISTENCE_KEY); setCurrentScreen('login');}}
          onComplete={(p) => { 
            if(user) {
              const updatedUser = {...user, plan: p};
              setUser(updatedUser);
              localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(updatedUser));
            }
            navigate('home'); 
          }} 
        />
      );
    }

    switch (currentScreen) {
      case 'welcome': return <Welcome onStart={() => navigate('login')} />;
      case 'login': return <Login onLogin={(u) => {setUser(u); setCurrentScreen('home'); localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(u));}} onDevAccess={() => {}} t={t} />;
      case 'home': return <Home user={user} navigate={navigate} t={t} language={language} setLanguage={setLanguage} />;
      case 'ai_suite': return <AISuite navigate={navigate} t={t} />;
      case 'voice_consultant': return <VoiceConsultant navigate={navigate} />;
      case 'media_lab': return <MediaLab navigate={navigate} />;
      case 'drawing_analysis': return <DrawingAnalysis navigate={navigate} />;
      case 'consultant': return <Consultant navigate={navigate} />;
      case 'ai_agent': return <AIAgent />;
      case 'profile': return (
        <Profile 
          user={user} 
          language={language} 
          setLanguage={setLanguage} 
          t={t} 
          onUpdateUser={(u) => {setUser(u); localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(u));}} 
          onLogout={() => {setUser(null); localStorage.removeItem(PERSISTENCE_KEY); setCurrentScreen('login');}} 
          isAdmin={user?.isDev || false} 
          onToggleAdmin={() => {}} 
          canInstall={!!deferredPrompt}
          onInstallApp={handleInstallApp}
        />
      );
      case 'machining_params': return <MachiningParams onBack={() => navigate('home')} initialData={selectedTool} t={t} />;
      case 'trigonometry': return <Trigonometry />;
      case 'table_threads': return <ThreadTables />;
      case 'table_tolerances': return <ToleranceTables />;
      case 'table_shackles': return <ShacklesTable />;
      case 'table_arc': return <ArcCalc t={t} />;
      case 'calc_divider': return <DividerCalc />;
      case 'calc_gears': return <GearCalc />;
      case 'calc_weight': return <WeightCalc t={t} />;
      case 'table_conversion': return <Conversion />;
      case 'glossary': return <Glossary navigate={navigate} />;
      case 'materials': return <MaterialsScreen />;
      case 'material_comparison': return <MaterialComparison />;
      case 'verifier': return <Verifier t={t} />;
      case 'micrometer': return <Micrometer t={t} />;
      case 'checkout': return <Checkout user={user} t={t} onComplete={(p) => { if(user) setUser({...user, plan: p}); navigate('home'); }} />;
      case 'tool_library': return <ToolLibrary tools={catalog} isAdmin={user?.isDev || false} onSelectTool={(tool) => { setSelectedTool(tool); setCurrentScreen('tool_detail' as any); }} onAddTool={() => { setSelectedTool(null); setCurrentScreen('tool_editor' as any); }} t={t} />;
      case 'tool_detail' as any: 
        return selectedTool ? <ToolDetail tool={selectedTool} isAdmin={user?.isDev || false} onBack={() => navigate('tool_library')} onCalculate={() => navigate('machining_params')} onEdit={() => { setCurrentScreen('tool_editor' as any); }} /> : <Home user={user} navigate={navigate} t={t} language={language} setLanguage={setLanguage} />;
      case 'tool_editor' as any:
        return <ToolEditor tool={selectedTool} onBack={() => navigate('tool_library')} onSave={(tool) => { 
          const idx = catalog.findIndex(t => t.id === tool.id);
          if (idx > -1) { const newCat = [...catalog]; newCat[idx] = tool; setCatalog(newCat); }
          else { setCatalog([...catalog, tool]); }
          navigate('tool_library');
        }} onDelete={(id) => { setCatalog(catalog.filter(t => t.id !== id)); navigate('tool_library'); }} />;
      default: return <Home user={user} navigate={navigate} t={t} language={language} setLanguage={setLanguage} />;
    }
  };

  if (!isReady) return null;

  const canNavigate = (user?.email === '48mineiro@gmail.com' || user?.isDev) || (user?.plan && user.plan !== 'free');

  return (
    <div className="flex h-full w-full flex-col bg-[#0a0908] text-white">
      <div className="mx-auto flex h-full w-full max-w-md flex-col bg-rust-dark shadow-2xl relative overflow-hidden">
        {user && canNavigate && !['login', 'welcome'].includes(currentScreen) && (
          <Header onMenuClick={() => setIsSidebarOpen(true)} onBack={() => navigate('home')} currentScreen={currentScreen} t={t} />
        )}
        <main className="flex-1 relative overflow-y-auto custom-scrollbar">
          {renderScreen()}
        </main>
        {user && canNavigate && !['login', 'welcome'].includes(currentScreen) && (
          <BottomNav currentScreen={currentScreen} navigate={navigate} t={t} />
        )}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} navigate={navigate} user={user} t={t} />
      </div>
    </div>
  );
}
