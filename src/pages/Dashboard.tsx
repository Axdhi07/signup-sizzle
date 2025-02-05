
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Fire } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Profile {
  username: string;
  display_name: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  coins: number;
}

interface Habit {
  id: string;
  title: string;
  description: string | null;
  streak: number | null;
  last_completion_date: string | null;
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
      return data as Habit[];
    },
  });

  // Calculate completion statistics for pie chart
  const completedHabits = habits?.filter(habit => 
    habit.last_completion_date && 
    new Date(habit.last_completion_date).toDateString() === new Date().toDateString()
  ).length || 0;
  const totalHabits = habits?.length || 0;
  const pieData = [
    { name: "Completed", value: completedHabits },
    { name: "Remaining", value: totalHabits - completedHabits }
  ];
  const COLORS = ["#10B981", "#E5E7EB"];

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

  // Calculate XP progress percentage
  const xpToNextLevel = 1000; // Example: 1000 XP needed per level
  const currentLevelProgress = ((profile?.xp || 0) % xpToNextLevel) / xpToNextLevel * 100;

  // Get the highest streak
  const highestStreak = habits?.reduce((max, habit) => 
    Math.max(max, habit.streak || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Overview */}
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
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${currentLevelProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {profile?.xp % xpToNextLevel} / {xpToNextLevel} XP to next level
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Coins</p>
              <p className="text-2xl font-bold">{profile?.coins}</p>
            </div>
          </div>
        </div>

        {/* Habits List */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-semibold">Your Habits</h2>
            <div className="flex items-center space-x-4">
              {/* Streak Display */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-orange-400 flex items-center justify-center mb-2">
                  <Fire className="h-6 w-6 text-orange-400" />
                </div>
                <span className="text-sm font-medium">{highestStreak} day streak</span>
              </div>
              
              {/* Completion Pie Chart */}
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={25}
                      outerRadius={35}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center text-sm mt-2">
                  {((completedHabits / totalHabits) * 100).toFixed(0)}% Complete
                </div>
              </div>
            </div>
          </div>
          
          {habits && habits.length > 0 ? (
            <div className="space-y-4">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <h3 className="font-medium">{habit.title}</h3>
                  {habit.description && (
                    <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
                  )}
                  {habit.streak && habit.streak > 0 && (
                    <div className="mt-2 flex items-center text-sm text-orange-500">
                      <Fire className="h-4 w-4 mr-1" />
                      {habit.streak} day streak
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No habits created yet. Start by adding a new habit!</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
