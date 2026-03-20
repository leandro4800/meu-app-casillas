import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
