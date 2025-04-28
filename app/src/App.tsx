import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import FindingsPage from './pages/FindingsPage';
import MapPage from './pages/MapPage';
import ImportancePage from './pages/ImportancePage';
import ReferencesPage from './pages/ReferencesPage';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/findings" element={<FindingsPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/importance" element={<ImportancePage />} />
              <Route path="/references" element={<ReferencesPage />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
