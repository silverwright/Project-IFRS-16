import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Home } from './pages/Home';
import { ContractInitiation } from './pages/ContractInitiation';
import { LeaseCalculations } from './pages/LeaseCalculations';
import { DisclosureJournals } from './pages/DisclosureJournals';
import { Methodology } from './pages/Methodology';
import { Education } from './pages/Education';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { LeaseProvider } from './context/LeaseContext';

function App() {
  return (
    <LeaseProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
          <Header />
          <main className="w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contract" element={<ContractInitiation />} />
              <Route path="/calculations" element={<LeaseCalculations />} />
              <Route path="/disclosure-journals" element={<DisclosureJournals />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/education" element={<Education />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LeaseProvider>
  );
}

export default App;