
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
              {profile?.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt={profile?.display_name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.display_name}</h1>
              <p className="text-gray-500">@{profile?.username}</p>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Level</p>
                <p className="text-xl font-bold">{profile?.level}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">XP</p>
                <p className="text-xl font-bold">{profile?.xp}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Coins</p>
                <p className="text-xl font-bold">{profile?.coins}</p>
              </div>
            </div>
          </div>
          
          {/* Placeholder for habits list - will be implemented next */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Habits</h2>
            <p className="text-gray-500">No habits created yet. Start by adding a new habit!</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
