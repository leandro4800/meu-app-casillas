
import React, { useState, useEffect, useMemo } from 'react';
import { Screen, User, Language } from './types';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import { translations } from './i18n';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, getDocFromServer } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: string;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

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
import Shackles from './screens/Shackles';
import ArcCalc from './screens/ArcCalc';
import DividerCalc from './screens/DividerCalc';
import GearCalc from './screens/GearCalc';
import WeightCalc from './screens/WeightCalc';
import Conversion from './screens/Conversion';
import Glossary from './screens/Glossary';
import MaterialComparison from './screens/MaterialComparison';
import ToolLibrary from './screens/ToolLibrary';
import Materials from './screens/Materials';
import Micrometer from './screens/Micrometer';
import ToleranceVerifier from './screens/ToleranceVerifier';
import Checkout from './screens/Checkout';
import ToolDetail from './screens/ToolDetail';
import ToolEditor from './screens/ToolEditor';
import AISuite from './screens/AISuite';
import VoiceConsultant from './screens/VoiceConsultant';
import MediaLab from './screens/MediaLab';
import DrawingAnalysis from './screens/DrawingAnalysis';
import Welcome from './screens/Welcome';
import HailtoolsVoice from './screens/HailtoolsVoice';
import MachiningOptimizer from './screens/MachiningOptimizer';
import ComingSoon from './screens/ComingSoon';

import { HAILTOOLS_CATALOG } from './constants';
import { ToolInsert } from './types';
import { GoogleGenAI } from "@google/genai";

const PERSISTENCE_KEY = 'casillas_v1_auth_session';

export default function App() {
  console.log("App rendering...");
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [language, setLanguage] = useState<Language>('pt_BR');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const [catalog, setCatalog] = useState<ToolInsert[]>(HAILTOOLS_CATALOG);
  const [selectedTool, setSelectedTool] = useState<ToolInsert | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const handleFirestoreError = (error: unknown, operationType: string, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  };

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

    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.email || "No user");
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (firebaseUser) {
        // Listen to user document in Firestore
        unsubscribeDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            setUser(userData);
            if (userData.language) setLanguage(userData.language);
            localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(userData));
            
            // Se estiver na tela de boas-vindas ou login, vai para home
            setCurrentScreen(prev => (prev === 'welcome' || prev === 'login') ? 'home' : prev);
          }
        }, (error) => {
          handleFirestoreError(error, 'get', `users/${firebaseUser.uid}`);
        });
        setIsAuthReady(true);
      } else {
        setUser(null);
        localStorage.removeItem(PERSISTENCE_KEY);
        setIsAuthReady(true);
        // Se a sessão for perdida e não estivermos em telas públicas, volta para welcome
        setCurrentScreen(prev => (!['welcome', 'login', 'checkout'].includes(prev)) ? 'welcome' : prev);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const initApp = () => {
      console.log("Initializing app...");
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
          setCurrentScreen('home');
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
      console.log("App ready.");
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
      
      // Only update fields that have actually changed to avoid unnecessary writes and permission issues
      const updateData: any = {};
      const fields: (keyof User)[] = ['displayName', 'photoURL', 'company', 'role', 'phone', 'plan', 'expiryDate', 'sector', 'isDev', 'language'];
      
      fields.forEach(field => {
        if (updatedUser[field] !== undefined && updatedUser[field] !== user?.[field]) {
          updateData[field] = updatedUser[field];
        }
      });

      if (Object.keys(updateData).length === 0) {
        console.log("No fields changed, skipping update.");
        return;
      }

      await updateDoc(userDocRef, updateData);
      
      // Update local state by merging to preserve any fields not in updateData
      setUser(prev => prev ? { ...prev, ...updateData } : updatedUser);
      
      // Update persistence
      const currentSaved = localStorage.getItem(PERSISTENCE_KEY);
      let currentObj = {};
      try {
        currentObj = currentSaved ? JSON.parse(currentSaved) : {};
      } catch (e) {
        console.error("Error parsing persistence:", e);
      }
      localStorage.setItem(PERSISTENCE_KEY, JSON.stringify({ ...currentObj, ...updateData }));
      
    } catch (err) {
      handleFirestoreError(err, 'update', `users/${auth.currentUser.uid}`);
      throw err;
    }
  };

  const renderScreen = () => {
    if (!isAuthReady) return null;

    if (!user) {
      if (currentScreen === 'login') return <Login onLogin={(u) => {setUser(u); setCurrentScreen('home');}} onDevAccess={() => {}} t={t} />;
      return <Welcome onStart={() => navigate('login')} />;
    }

    // Paywall Logic: Only 48mineiro@gmail.com or paid plans have access to the full app
    const isVip = user.email === '48mineiro@gmail.com' || user.isDev;
    const hasPaid = user.plan && user.plan !== 'free';
    const isPublicScreen = ['login', 'welcome', 'checkout'].includes(currentScreen);

    if (!isVip && !hasPaid && !isPublicScreen) {
      return (
        <Checkout 
          user={user} 
          t={t} 
          onLogout={handleLogout}
          onComplete={(p) => { 
            const expiry = p === 'annual' 
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            handleUpdateUser({...user, plan: p, expiryDate: expiry});
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
      case 'voice_consultant': return <VoiceConsultant navigate={navigate} t={t} />;
      case 'media_lab': return <MediaLab navigate={navigate} t={t} />;
      case 'drawing_analysis': return <DrawingAnalysis navigate={navigate} t={t} />;
      case 'hailtools_voice': return <HailtoolsVoice navigate={navigate} t={t} user={user} />;
      case 'machining_optimizer': return <MachiningOptimizer onBack={() => navigate('ai_suite')} t={t} />;
      case 'consultant': return <Consultant navigate={navigate} t={t} user={user} />;
      case 'ai_agent': return <AIAgent t={t} />;
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
      case 'machining_params': return <MachiningParams onBack={() => navigate('home')} navigate={navigate} initialData={selectedTool} t={t} />;
      case 'trigonometry': return <Trigonometry onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'table_threads': 
      case 'thread_tables': return <ThreadTables onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'table_tolerances':
      case 'tolerance_tables': return <ToleranceTables onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'table_shackles':
      case 'shackles': return <Shackles onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'table_arc':
      case 'arc_calc': return <ArcCalc onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'calc_divider':
      case 'divider_calc': return <DividerCalc onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'calc_gears':
      case 'gear_calc': return <GearCalc onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'calc_weight':
      case 'weight_calc': return <WeightCalc onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'table_conversion':
      case 'conversion': return <Conversion onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'glossary': return <Glossary onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'materials': return <Materials onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'material_comparison': return <MaterialComparison t={t} />;
      case 'verifier':
      case 'tolerance_verifier': return <ToleranceVerifier onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'micrometer': return <Micrometer onBack={() => navigate('home')} navigate={navigate} t={t} />;
      case 'coming_soon': return <ComingSoon screen={currentScreen} onBack={() => navigate('home')} />;
      case 'checkout': return <Checkout user={user} t={t} onLogout={handleLogout} onComplete={(p) => { if(user) setUser({...user, plan: p}); navigate('home'); }} />;
      case 'tool_library': return <ToolLibrary tools={catalog} isAdmin={user?.isDev || false} onSelectTool={(tool) => { setSelectedTool(tool); setCurrentScreen('tool_detail' as any); }} onAddTool={() => { setSelectedTool(null); setCurrentScreen('tool_editor' as any); }} t={t} />;
      case 'tool_detail' as any: 
        return selectedTool ? <ToolDetail tool={selectedTool} isAdmin={user?.isDev || false} onBack={() => navigate('tool_library')} onCalculate={() => navigate('machining_params')} onEdit={() => { setCurrentScreen('tool_editor' as any); }} t={t} /> : <Home user={user} navigate={navigate} t={t} language={language} setLanguage={setLanguage} />;
      case 'tool_editor' as any:
        return <ToolEditor tool={selectedTool} onBack={() => navigate('tool_library')} onSave={(tool) => { 
          const idx = catalog.findIndex(t => t.id === tool.id);
          if (idx > -1) { const newCat = [...catalog]; newCat[idx] = tool; setCatalog(newCat); }
          else { setCatalog([...catalog, tool]); }
          navigate('tool_library');
        }} onDelete={(id) => { setCatalog(catalog.filter(t => t.id !== id)); navigate('tool_library'); }} t={t} />;
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
