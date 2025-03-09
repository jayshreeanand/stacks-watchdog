import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { WalletProvider } from './context/WalletContext';
import { DataSourceProvider } from './context/DataSourceContext';

// Define the theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0080ff', // Primary color
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
    electroneum: {
      50: '#f2f9ff',
      100: '#d9ecff',
      200: '#b3d9ff',
      300: '#8cc6ff',
      400: '#66b3ff',
      500: '#3399ff', // Electroneum blue
      600: '#0080ff',
      700: '#0066cc',
      800: '#004d99',
      900: '#003366',
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

// Initialize the app with the data source from localStorage or URL params
const initializeDataSource = () => {
  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const dataSourceParam = urlParams.get('dataSource');
  
  if (dataSourceParam) {
    console.log(`Data source from URL: ${dataSourceParam}`);
    localStorage.setItem('etn_watchdog_data_source', dataSourceParam);
    return;
  }
  
  // Otherwise, use localStorage or default
  const savedDataSource = localStorage.getItem('etn_watchdog_data_source');
  console.log(`Data source from localStorage: ${savedDataSource || 'not set (using default)'}`);
};

// Initialize data source before rendering
initializeDataSource();

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