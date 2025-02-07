
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { HabitForm } from "@/components/create-plan/HabitForm";
import { CreatePlanHeader } from "@/components/create-plan/CreatePlanHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const CreatePlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");

  const { data: habits } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Habit</TabsTrigger>
            <TabsTrigger value="view">View My Plan</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <HabitForm onSubmit={handleSubmit} />
            </div>
          </TabsContent>
          <TabsContent value="view">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">My Habits</h2>
              <div className="space-y-4">
                {habits?.map((habit) => (
                  <div
                    key={habit.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{habit.title}</h3>
                        {habit.description && (
                          <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full border-2 border-orange-400 flex items-center justify-center">
                          <Flame className="h-5 w-5 text-orange-400" />
                        </div>
                        <span className="text-sm font-medium mt-1">{habit.streak || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default CreatePlan;
