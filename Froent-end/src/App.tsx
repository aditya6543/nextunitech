import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import MadhavAI from './pages/MadhavAI';
import FindMeJobAI from './pages/FindMeJobAI';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/Login';
import MadhavLogin from './components/MadhavLogin';
import AnimatedBackground from './components/AnimatedBackground';

const App: React.FC = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAdminAuthenticated(!!token);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AnimatedBackground />
        <div className="min-h-screen flex flex-col pt-20">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/madhav-ai" element={<MadhavAI />} />
              <Route path="/madhav-ai/login" element={<MadhavLogin />} />
              <Route path="/find-me-job" element={<FindMeJobAI />} />
              <Route 
                path="/admin" 
                element={
                  isAdminAuthenticated ? 
                    <AdminDashboard /> : 
                    <Login setIsAuthenticated={setIsAdminAuthenticated} />
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
