import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, Settings, User, Coins } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  username: string;
  display_name: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  coins: number;
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const showBackArrow = location.pathname !== "/dashboard";

  const { data: profile } = useQuery({
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
      return;
    }
    navigate("/");
  };

  // Calculate XP progress percentage
  const xpToNextLevel = 1000; // Example: 1000 XP needed per level
  const currentLevelProgress = ((profile?.xp || 0) % xpToNextLevel) / xpToNextLevel * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {showBackArrow && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/dashboard")}
                  className="mr-4"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div className="text-2xl font-bold text-primary">
                HabitQuest
              </div>
              <nav className="hidden md:ml-8 md:flex md:space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/teams")}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Teams
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/achievements")}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Achievements
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/leaderboard")}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Leaderboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/shop")}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Shop
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center">
              {profile && (
                <div className="flex items-center mr-4">
                  <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm border">
                    <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{profile.coins || 0}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-12 w-12 rounded-full"
                      >
                        <div className="relative">
                          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200">
                            {profile.avatar_url ? (
                              <img
                                src={profile.avatar_url}
                                alt={profile.display_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -left-1 bg-primary text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
                            {profile.level}
                          </div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="p-2">
                        <div className="text-sm font-medium">{profile.display_name}</div>
                        <div className="text-xs text-gray-500">Level {profile.level}</div>
                        <div className="mt-2">
                          <Progress value={currentLevelProgress} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1">
                            {profile.xp % xpToNextLevel} / {xpToNextLevel} XP to next level
                          </div>
                        </div>
                      </div>
                      <DropdownMenuItem onClick={() => navigate("/profile/edit")}>
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/profile/customize")}>
                        <Settings className="mr-2 h-4 w-4" />
                        Customize Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
