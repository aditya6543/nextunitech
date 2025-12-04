import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Madhav.ai', path: '/madhav-ai' },
    { name: 'FindMeJob.ai', path: '/find-me-job' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md supports-[-webkit-backdrop-filter]:[-webkit-backdrop-filter:blur(12px)] shadow-sm">
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <motion.img 
            src="/assets/nextunitech_logo.png" 
            alt="NextUnitech Logo" 
            className="h-20 md:h-24 w-auto shrink-0"
            whileHover={{ scale: 1.05 }}
          />
          <span className="text-xl font-bold text-primary-500">NextUnitech Pvt. Ltd.</span>
        </Link>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <motion.button 
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
