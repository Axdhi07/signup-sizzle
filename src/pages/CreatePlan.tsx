
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const CreatePlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        toast({
          title: "Not authenticated",
          description: "Please sign in to create a plan",
          variant: "destructive",
        });
      }
    };

    checkUser();
  }, [navigate, toast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">Create Your Plan</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Coming Soon!</h2>
        <p className="text-gray-600">
          The plan creation feature is currently under development. Check back soon to create your personalized habit tracking plan!
        </p>
      </div>
    </motion.div>
  );
};

export default CreatePlan;
