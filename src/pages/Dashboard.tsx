
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Profile {
  username: string;
  display_name: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  coins: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        toast({
          title: "Not authenticated",
          description: "Please sign in to access the dashboard",
          variant: "destructive",
        });
      }
    };

    checkUser();
  }, [navigate, toast]);

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Stats Overview</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Level</p>
              <p className="text-2xl font-bold">{profile?.level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">XP</p>
              <p className="text-2xl font-bold">{profile?.xp}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Coins</p>
              <p className="text-2xl font-bold">{profile?.coins}</p>
            </div>
          </div>
        </div>

        {/* Placeholder for habits list - will be implemented next */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Your Habits</h2>
          <p className="text-gray-500">No habits created yet. Start by adding a new habit!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
