import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { WalletProvider } from './context/WalletContext';
import { DataSourceProvider } from './context/DataSourceContext';

// Define custom theme
const theme = extendTheme({
  colors: {
    sonic: {
      50: '#e6f0ff',
      100: '#cce0ff',
      200: '#99c2ff',
      300: '#66a3ff',
      400: '#3385ff',
      500: '#0066ff', // Sonic blue
      600: '#0052cc',
      700: '#003d99',
      800: '#002966',
      900: '#001433',
    },
    alert: {
      low: '#38A169',     // Green
      medium: '#DD6B20',  // Orange
      high: '#E53E3E',    // Red
      critical: '#822727' // Dark red
    }
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

// Check for data source in URL parameters
const urlParams = new URLSearchParams(window.location.search);
const dataSourceParam = urlParams.get('dataSource');

if (dataSourceParam) {
  localStorage.setItem('sonic_watchdog_data_source', dataSourceParam);
}

// Get data source from localStorage or default to mock
const savedDataSource = localStorage.getItem('sonic_watchdog_data_source');
const initialDataSource = savedDataSource || 'mock';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <DataSourceProvider>
          <WalletProvider>
            <App />
          </WalletProvider>
        </DataSourceProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
); 