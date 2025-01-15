// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import GameDetailsPage from './pages/GameDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppFooter from './components/AppFooter';
import { Box } from '@mui/material';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Box
        sx={{
          width: '66vw',
          margin: '0 auto',
          padding: '2rem 0 0 0',
          position: 'relative', 
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
          <AppHeader />
          <Box
            sx={{
              flex:1,
              display:'flex',
              maxHeight:'300rem'
            }}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game/:id"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <GameDetailsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
          {false && (
            <AppFooter />
          )}
          
      </Box>

      </Router>
    </QueryClientProvider>
  );
};

export default App;
