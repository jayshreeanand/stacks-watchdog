import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
); 