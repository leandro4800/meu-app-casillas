import React, { useState } from 'react';
import Home from '../screens/Home';
import Welcome from '../screens/Welcome';
import AIAgent from '../screens/AIAgent';
import MachiningParams from '../screens/MachiningParams';
import ToleranceTables from '../screens/ToleranceTables';
import ToleranceVerifier from '../screens/ToleranceVerifier';
import ComingSoon from '../screens/ComingSoon';
import { Screen, User } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [user] = useState<User | null>(null);

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
        return <AIAgent onBack={() => navigate('home')} />;
      case 'machining_params':
        return <MachiningParams onBack={() => navigate('home')} />;
      case 'tolerance_tables':
        return <ToleranceTables onBack={() => navigate('home')} />;
      case 'verifier':
        return <ToleranceVerifier onBack={() => navigate('home')} />;
      default:
        // Fallback for all other screens
        return <ComingSoon screen={currentScreen} onBack={() => navigate('home')} />;
    }
  };

  return (
    <div className="h-full w-full bg-[#0a0908] text-white overflow-hidden">
      {renderScreen()}
    </div>
  );
};

export default App;
