
import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <p className="text-gray-600 mb-4">
          Welcome to our habit tracking application! We believe that building good habits is the foundation of personal growth and success.
        </p>
        <p className="text-gray-600 mb-4">
          Our gamified approach makes habit tracking fun and engaging, helping you stay motivated on your journey to self-improvement.
        </p>
        <h2 className="text-xl font-semibold mb-4 mt-8">How It Works</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Create and track your daily habits</li>
          <li>Earn XP and level up as you complete tasks</li>
          <li>Collect coins to unlock rewards</li>
          <li>Join teams and compete with friends</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default About;
