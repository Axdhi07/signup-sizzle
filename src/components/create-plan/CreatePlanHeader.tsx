
import { motion } from "framer-motion";

export const CreatePlanHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Create Your Plan</h1>
    </motion.div>
  );
};
