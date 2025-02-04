
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-700 mb-8"
            >
              Welcome to your application
            </motion.span>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-8"
            >
              Start building something amazing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="max-w-2xl mx-auto text-xl text-gray-500 mb-12"
            >
              Create an account and begin your journey with us. Our platform
              provides everything you need to bring your ideas to life.
            </motion.p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
