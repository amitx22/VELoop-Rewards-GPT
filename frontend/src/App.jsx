import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { Navbar } from './components/Navbar/Navbar.jsx';
import { Footer } from './components/Footer/Footer.jsx';
import { DemoStateSwitcher } from './components/DemoStateSwitcher/DemoStateSwitcher.jsx';
import { GiveawayHome } from './pages/GiveawayHome/GiveawayHome.jsx';
import { GiveawayDetail } from './pages/GiveawayDetail/GiveawayDetail.jsx';
import { WinnersPage } from './pages/WinnersPage/WinnersPage.jsx';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Global Header */}
          <Navbar />

          {/* Main Views */}
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<GiveawayHome />} />
              <Route path="/giveaway/:slug" element={<GiveawayDetail />} />
              <Route path="/winners" element={<WinnersPage />} />
              {/* Fallback */}
              <Route path="*" element={<GiveawayHome />} />
            </Routes>
          </div>

          {/* Global Footer */}
          <Footer />

          {/* Interactive State & Evaluation Toolbar */}
          <DemoStateSwitcher />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
