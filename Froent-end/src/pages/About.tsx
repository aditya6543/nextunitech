import React from 'react';
import { motion } from 'framer-motion';

const FounderCard: React.FC<{
  name: string;
  role: string;
  bio: string;
  image: string;
}> = ({ name, role, bio, image }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center text-center"
    >
      <img 
        src={image} 
        alt={name} 
        className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-primary-500"
      />
      <h3 className="text-xl font-bold text-primary-500">{name}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{role}</p>
      <p className="text-gray-500 dark:text-gray-400">{bio}</p>
    </motion.div>
  );
};

const About: React.FC = () => {
  const founders = [
    {
      name: "Aditya Kapse",
      role: "Founder & CEO",
      bio: "I am Aditya, the CEO and Founder of Madhav.AI, a vision-driven initiative focused on bringing the timeless wisdom of the Bhagavad Gita into the modern age of artificial intelligence. At Madhav.AI, we’re building a spiritual companion that goes beyond answers — it helps people find clarity, peace, and purpose through the teachings of Shri Krishna. With a background in DevSecOps and a deep interest in AI, I founded Madhav.AI to bridge technology and consciousness, creating experiences that are both human and divine. My mission is to make AI not just intelligent, but wise — a guide that listens, understands, and uplifts.",
      image: "/assets/aditya.png", // Replace with actual founder image
    },
    {
      name: "Nachiket Waghmare",
      role: "COO",
      bio: "Nachiket Waghmare, the Chief Operating Officer of Madhav.AI, leads our efforts in business development, strategic partnerships, and marketing. With a natural flair for communication and a sharp understanding of market dynamics, he ensures our vision connects meaningfully with people and organizations alike. Nachiket manages investor pitches, brand positioning, and outreach initiatives — turning Madhav.AI’s spiritual and technological vision into a movement that resonates across audiences. His leadership brings balance between innovation and execution, helping guide Madhav.AI’s growth with clarity and purpose.",
      image: "/assets/nachiket.png", // Replace with actual founder image
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-500">
            About NextUnitech.PVT.LTD
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Bridging the gap between cutting-edge AI technologies and the diverse needs of India
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-4xl mx-auto mb-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-primary-500">Our Mission</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            At NextUnitech.PVT.LTD, we are committed to making AI technologies accessible, 
            relevant, and empowering for every Indian. Our mission is to create intelligent 
            solutions that understand and address the unique challenges and opportunities 
            in the Indian context, bridging technological innovation with cultural sensitivity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {founders.map((founder, index) => (
            <FounderCard 
              key={index}
              name={founder.name}
              role={founder.role}
              bio={founder.bio}
              image={founder.image}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-primary-500">Our Vision</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            To be the leading AI technology partner for India, creating solutions 
            that are not just technologically advanced, but culturally intelligent 
            and socially impactful.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;

