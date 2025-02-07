
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { HabitForm } from "@/components/create-plan/HabitForm";
import { CreatePlanHeader } from "@/components/create-plan/CreatePlanHeader";

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

  const handleSubmit = async (formData: {
    title: string;
    description: string;
    category: string;
    priority: string;
    scheduledTime: string;
    durationMinutes: string;
    frequency: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user found");

    const { error } = await supabase.from("habits").insert({
      user_id: user.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: parseInt(formData.priority),
      scheduled_time: formData.scheduledTime,
      duration_minutes: parseInt(formData.durationMinutes),
      frequency: formData.frequency,
    });

    if (error) throw error;

    toast({
      title: "Success!",
      description: "Your new habit has been added to your plan.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-2xl mx-auto">
        <CreatePlanHeader />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <HabitForm onSubmit={handleSubmit} />
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePlan;
