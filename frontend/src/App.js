import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { DataSourceProvider } from './context/DataSourceContext';

// Layout components
import Layout from './components/Layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import WalletDrainers from './pages/WalletDrainers';
import WalletDrainerDetails from './pages/WalletDrainerDetails';
import AnalyzeContract from './pages/AnalyzeContract';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import SecurityScanner from './pages/SecurityScanner';
import NotificationSettings from './pages/NotificationSettings';
import TokenApprovals from './pages/TokenApprovals';

function App() {
  return (
    <DataSourceProvider>
      <Box minH="100vh" bg="gray.900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="wallet-drainers" element={<WalletDrainers />} />
            <Route path="wallet-drainers/:address" element={<WalletDrainerDetails />} />
            <Route path="analyze" element={<AnalyzeContract />} />
            <Route path="security-scanner" element={<SecurityScanner />} />
            <Route path="notification-settings" element={<NotificationSettings />} />
            <Route path="token-approvals" element={<TokenApprovals />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Box>
    </DataSourceProvider>
  );
}

export default App; 