import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen, User } from './types';

// Importação das Telas
import Welcome from './screens/Welcome';
import Home from './screens/Home';
import AIAgent from './screens/AIAgent';
import MachiningParams from './screens/MachiningParams';
import ToleranceTables from './screens/ToleranceTables';
import ToleranceVerifier from './screens/ToleranceVerifier';
import Checkout from './screens/Checkout';
import Profile from './screens/Profile';
import Materials from './screens/Materials';
import ThreadTables from './screens/ThreadTables';
import Glossary from './screens/Glossary';
import Conversion from './screens/Conversion';
import WeightCalc from './screens/WeightCalc';
import Micrometer from './screens/Micrometer';
import Trigonometry from './screens/Trigonometry';
import GearCalc from './screens/GearCalc';
import DividerCalc from './screens/DividerCalc';
import ArcCalc from './screens/ArcCalc';
import Shackles from './screens/Shackles';
import DrawingAnalysis from './screens/DrawingAnalysis';
import MediaLab from './screens/MediaLab';
import ComingSoon from './screens/ComingSoon';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [user] = useState<User | null>({
    id: '1',
    name: 'Operador Casillas',
    email: '48mineiro@gmail.com',
    isPremium: true,
    photoUrl: 'https://picsum.photos/seed/mechanic/200/200'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <Welcome onStart={() => navigate('home')} />;
      case 'home':
        return <Home user={user} navigate={navigate} />;
      case 'ai_agent':
        return <AIAgent onBack={() => navigate('home')} navigate={navigate} />;
      case 'machining_params':
        return <MachiningParams onBack={() => navigate('home')} navigate={navigate} />;
      case 'tolerance_tables':
        return <ToleranceTables onBack={() => navigate('home')} navigate={navigate} />;
      case 'verifier':
        return <ToleranceVerifier onBack={() => navigate('home')} navigate={navigate} />;
      case 'materials':
        return <Materials onBack={() => navigate('home')} navigate={navigate} currentScreen="materials" />;
      case 'thread_tables':
        return <ThreadTables onBack={() => navigate('home')} navigate={navigate} currentScreen="thread_tables" />;
      case 'glossary':
        return <Glossary onBack={() => navigate('home')} navigate={navigate} currentScreen="glossary" />;
      case 'conversion':
        return <Conversion onBack={() => navigate('home')} navigate={navigate} currentScreen="conversion" />;
      case 'weight_calc':
        return <WeightCalc onBack={() => navigate('home')} navigate={navigate} currentScreen="weight_calc" />;
      case 'micrometer':
        return <Micrometer onBack={() => navigate('home')} navigate={navigate} currentScreen="micrometer" />;
      case 'trigonometry':
        return <Trigonometry onBack={() => navigate('home')} navigate={navigate} currentScreen="trigonometry" />;
      case 'gear_calc':
        return <GearCalc onBack={() => navigate('home')} navigate={navigate} currentScreen="gear_calc" />;
      case 'divider_calc':
        return <DividerCalc onBack={() => navigate('home')} navigate={navigate} currentScreen="divider_calc" />;
      case 'arc_calc':
        return <ArcCalc onBack={() => navigate('home')} navigate={navigate} currentScreen="arc_calc" />;
      case 'shackles':
        return <Shackles onBack={() => navigate('home')} navigate={navigate} currentScreen="shackles" />;
      case 'drawing_analysis':
        return <DrawingAnalysis onBack={() => navigate('home')} navigate={navigate} currentScreen="drawing_analysis" />;
      case 'media_lab':
        return <MediaLab onBack={() => navigate('home')} navigate={navigate} currentScreen="media_lab" />;
      case 'checkout':
        return <Checkout onBack={() => navigate('home')} />;
      case 'profile':
        return (
          <Profile 
            user={user} 
            onBack={() => navigate('home')} 
            onUpgrade={() => navigate('checkout')} 
            navigate={navigate}
            currentScreen="profile"
          />
        );
      default:
        return <ComingSoon screen={currentScreen} onBack={() => navigate('home')} />;
    }
  };

  return (
    <div className="h-full w-full bg-[#0a0908] text-white overflow-hidden selection:bg-[#eab308]/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
