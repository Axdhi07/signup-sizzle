
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-nav-background backdrop-blur-md border-b border-gray-200/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold">Your Logo</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-300"
            >
              Sign up
            </Button>
            <Button
              className="bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Log in
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
