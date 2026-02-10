import { useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { ChatInterface } from './components/ChatInterface';

function App() {
  const { currentView } = useApp();

  return (
    <>
      {currentView === 'landing' ? <LandingPage /> : <ChatInterface />}
    </>
  );
}

export default App;
