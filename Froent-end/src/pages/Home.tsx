import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProductCard: React.FC<{
  title: string;
  tagline: string;
  description: string;
  path: string;
}> = ({ title, tagline, description, path }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(path)}
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 transform hover:shadow-2xl"
    >
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold text-primary-500">{title}</h2>
      </div>
      <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">{tagline}</p>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </motion.div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-500">
            NextUnitech.PVT.LTD
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-4">
            AI Solutions for Bharat
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Empowering Indian innovation through cutting-edge artificial intelligence technologies
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <ProductCard 
            title="Madhav.ai"
            tagline="Your Personal AI Companion"
            description="Intelligent conversational AI that understands and assists you."
            path="/madhav-ai"
          />
          <ProductCard 
            title="FindMeJob.ai"
            tagline="AI-Powered Career Navigator"
            description="Smart job matching and career guidance platform."
            path="/find-me-job"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
