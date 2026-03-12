
import React, { useState, useEffect, useMemo } from 'react';
import { Screen, User, Language } from './types';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import { translations } from './i18n';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, getDocFromServer } from 'firebase/firestore';

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
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Test connection to Firestore
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Listen to user document in Firestore
        const unsubscribeDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            setUser(userData);
            localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(userData));
          }
        });
        setIsAuthReady(true);
        return () => unsubscribeDoc();
      } else {
        setUser(null);
        localStorage.removeItem(PERSISTENCE_KEY);
        setIsAuthReady(true);
      }
    });

    return () => unsubscribeAuth();
  }, []);

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

      // Carregar Sessão (Fallback if Firebase is slow)
      const savedSession = localStorage.getItem(PERSISTENCE_KEY);
      if (savedSession && !user) {
        try {
          const currentUser = JSON.parse(savedSession) as User;
          setUser(currentUser);
        } catch (e) {
          localStorage.removeItem(PERSISTENCE_KEY);
        }
      }

      if (paymentStatus === 'success' && sessionId) {
        const verifyPayment = async () => {
          try {
            // Use different endpoint depending on environment
            const isProduction = window.location.hostname !== 'localhost';
            const endpoint = isProduction 
              ? `/api/get-session?sessionId=${sessionId}`
              : `/api/checkout-session/${sessionId}`;
              
            const res = await fetch(endpoint);
            const sessionData = await res.json();
            
            if (sessionData.payment_status === 'paid' && auth.currentUser) {
              const plan = sessionData.metadata.plan as 'monthly' | 'annual';
              const expiryDate = new Date();
              if (plan === 'annual') {
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
              } else {
                expiryDate.setMonth(expiryDate.getMonth() + 1);
              }
              
              await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                plan: plan,
                expiryDate: expiryDate.toISOString()
              });
              
              alert('Assinatura Pro ativada com sucesso!');
            }
          } catch (error) {
            console.error("Erro ao verificar pagamento:", error);
          } finally {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        };
        verifyPayment();
      } else if (paymentStatus === 'cancel') {
        alert('Pagamento cancelado.');
        window.history.replaceState({}, document.title, window.location.pathname);
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem(PERSISTENCE_KEY);
      setCurrentScreen('login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    if (!auth.currentUser) return;
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        displayName: updatedUser.displayName,
        photoURL: updatedUser.photoURL,
        company: updatedUser.company,
        role: updatedUser.role,
        phone: updatedUser.phone,
        plan: updatedUser.plan,
        expiryDate: updatedUser.expiryDate
      });
      setUser(updatedUser);
      localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const renderScreen = () => {
    if (!isAuthReady) return null;

    if (!user && !['login', 'welcome', 'checkout'].includes(currentScreen)) {
      return <Welcome onStart={() => navigate('login')} />;
    }

    // Paywall Logic: Only 48mineiro@gmail.com or paid plans have access to the full app
    const isVip = user?.email === '48mineiro@gmail.com' || user?.isDev;
    const hasPaid = user?.plan && user.plan !== 'free';
    const isPublicScreen = ['login', 'welcome', 'checkout'].includes(currentScreen);

    if (user && !isVip && !hasPaid && !isPublicScreen) {
      return (
        <Checkout 
          user={user} 
          t={t} 
          onLogout={handleLogout}
          onComplete={(p) => { 
            if(user) {
              const expiry = p === 'annual' 
                ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
              handleUpdateUser({...user, plan: p, expiryDate: expiry});
            }
            navigate('home'); 
          }} 
        />
      );
    }

    switch (currentScreen) {
      case 'welcome': return <Welcome onStart={() => navigate('login')} />;
      case 'login': return <Login onLogin={(u) => {setUser(u); setCurrentScreen('home');}} onDevAccess={() => {}} t={t} />;
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
          onUpdateUser={handleUpdateUser} 
          onLogout={handleLogout} 
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

  const isVip = user?.email === '48mineiro@gmail.com' || user?.isDev;
  const hasPaid = user?.plan && user.plan !== 'free';
  const canNavigate = !!user && (isVip || hasPaid);

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
