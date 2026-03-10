
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

import { HAILTOOLS_CATALOG, APP_LOGO_URL } from './constants';
import { ToolInsert } from './types';
import { GoogleGenAI } from "@google/genai";

const PERSISTENCE_KEY = 'casillas_v1_auth_session';
const LOGO_PERSISTENCE_KEY = 'casillas_custom_logo';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [language, setLanguage] = useState<Language>('pt_BR');
  const [appLogo, setAppLogo] = useState<string>(APP_LOGO_URL);
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
      // Carregar Sessão
      const savedSession = localStorage.getItem(PERSISTENCE_KEY);
      if (savedSession) {
        try {
          const parsedUser = JSON.parse(savedSession) as User;
          setUser(parsedUser);
          setCurrentScreen('home');
        } catch (e) {
          localStorage.removeItem(PERSISTENCE_KEY);
        }
      }
      
      // Carregar Logo Customizada
      const savedLogo = localStorage.getItem(LOGO_PERSISTENCE_KEY);
      if (savedLogo) {
        setAppLogo(savedLogo);
      }
      
      setIsReady(true);
    };
    initApp();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const t = useMemo(() => translations[language], [language]);

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

  const handleUpdateLogo = (newLogo: string) => {
    setAppLogo(newLogo);
    localStorage.setItem(LOGO_PERSISTENCE_KEY, newLogo);
  };

  const renderScreen = () => {
    if (!user && currentScreen !== 'login') return <Login onLogin={(u) => {setUser(u); setCurrentScreen('home');}} onDevAccess={() => {}} t={t} />;

    switch (currentScreen) {
      case 'login': return <Login onLogin={(u) => {setUser(u); setCurrentScreen('home'); localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(u));}} onDevAccess={() => {}} t={t} />;
      case 'home': return <Home user={user} navigate={navigate} t={t} language={language} setLanguage={setLanguage} appLogo={appLogo} />;
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
          appLogo={appLogo}
          onUpdateLogo={handleUpdateLogo}
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
        return selectedTool ? <ToolDetail tool={selectedTool} isAdmin={user?.isDev || false} onBack={() => navigate('tool_library')} onCalculate={() => navigate('machining_params')} onEdit={() => { setCurrentScreen('tool_editor' as any); }} /> : <Home user={user} navigate={navigate} t={t} language={language} setLanguage={setLanguage} appLogo={appLogo} />;
      case 'tool_editor' as any:
        return <ToolEditor tool={selectedTool} onBack={() => navigate('tool_library')} onSave={(tool) => { 
          const idx = catalog.findIndex(t => t.id === tool.id);
          if (idx > -1) { const newCat = [...catalog]; newCat[idx] = tool; setCatalog(newCat); }
          else { setCatalog([...catalog, tool]); }
          navigate('tool_library');
        }} onDelete={(id) => { setCatalog(catalog.filter(t => t.id !== id)); navigate('tool_library'); }} />;
      default: return <Home user={user} navigate={navigate} t={t} language={language} setLanguage={setLanguage} appLogo={appLogo} />;
    }
  };

  if (!isReady) return null;

  return (
    <div className="flex h-full w-full flex-col bg-[#0a0908] text-white">
      <div className="mx-auto flex h-full w-full max-w-md flex-col bg-rust-dark shadow-2xl relative overflow-hidden">
        {user && currentScreen !== 'login' && (
          <Header onMenuClick={() => setIsSidebarOpen(true)} onBack={() => navigate('home')} currentScreen={currentScreen} t={t} />
        )}
        <main className="flex-1 relative overflow-y-auto custom-scrollbar">
          {renderScreen()}
        </main>
        {user && currentScreen !== 'login' && (
          <BottomNav currentScreen={currentScreen} navigate={navigate} t={t} />
        )}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} navigate={navigate} user={user} t={t} appLogo={appLogo} />
      </div>
    </div>
  );
}
