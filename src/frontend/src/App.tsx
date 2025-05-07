import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import FindingsPage from './pages/FindingsPage';
import MapPage from './pages/MapPage';
import ImportancePage from './pages/ImportancePage';
import ReferencesPage from './pages/ReferencesPage';
import AccessibilityPage from './pages/AccessibilityPage';
import { DataProvider } from './context/DataContext';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { useEffect } from 'react';

// Component to handle global accessibility classes
const AccessibilityClassManager: React.FC = () => {
  const { isHighContrastMode, isColorBlindMode } = useAccessibility();

  useEffect(() => {
    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [isHighContrastMode]);

  useEffect(() => {
    if (isColorBlindMode) {
      document.documentElement.classList.add('color-blind-mode');
    } else {
      document.documentElement.classList.remove('color-blind-mode');
    }
  }, [isColorBlindMode]);

  // Optional: Clean up classes on component unmount, though for App it's less critical
  // This cleanup is slightly more complex now with two independent effects.
  // A single effect listening to both might be cleaner if cleanup is critical.
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('high-contrast-mode');
      document.documentElement.classList.remove('color-blind-mode');
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  return null; // This component does not render anything
};

function App() {
  return (
    <DataProvider>
      <AccessibilityProvider>
        <AccessibilityClassManager />
        <BrowserRouter>
          <Layout>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/findings" element={<FindingsPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/importance" element={<ImportancePage />} />
                <Route path="/references" element={<ReferencesPage />} />
                <Route path="/accessibility" element={<AccessibilityPage />} />
              </Routes>
            </AnimatePresence>
          </Layout>
        </BrowserRouter>
      </AccessibilityProvider>
    </DataProvider>
  );
}

export default App;
