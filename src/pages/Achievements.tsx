
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface Achievement {
  id: string;
  type: string;
  tier: string;
  progress: number;
  target: number;
  title: string;
  description: string;
  icon: string;
}

const Achievements = () => {
  const navigate = useNavigate();

  const { data: achievements, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as Achievement[];
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "bronze":
        return "bg-orange-600";
      case "silver":
        return "bg-gray-400";
      case "gold":
        return "bg-yellow-500";
      case "platinum":
        return "bg-blue-500";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <h1 className="text-3xl font-bold">Achievements</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements?.map((achievement) => (
          <Card key={achievement.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{achievement.icon}</span>
                <span>{achievement.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {achievement.description}
              </p>
              <div className="space-y-2">
                <Progress 
                  value={(achievement.progress / achievement.target) * 100} 
                  className={`h-2 ${getTierColor(achievement.tier)}`}
                />
                <p className="text-sm text-muted-foreground">
                  Progress: {achievement.progress} / {achievement.target}
                </p>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-secondary text-secondary-foreground">
                  {achievement.tier}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
