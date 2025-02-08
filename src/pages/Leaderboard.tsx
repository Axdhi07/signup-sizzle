
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Medal, Trophy, Flame } from "lucide-react";

interface LeaderboardEntry {
  username: string;
  xp: number;
  streak: number;
}

const Leaderboard = () => {
  const navigate = useNavigate();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("global_leaderboard")
        .select("*");

      if (error) throw error;
      return data as LeaderboardEntry[];
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

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Medal className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <h1 className="text-3xl font-bold">Global Leaderboard</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>XP</TableHead>
              <TableHead>Streak</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard?.map((entry, index) => (
              <TableRow key={entry.username}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getMedalIcon(index)}
                    {index + 1}
                  </div>
                </TableCell>
                <TableCell>{entry.username}</TableCell>
                <TableCell>{entry.xp.toLocaleString()} XP</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {entry.streak}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Leaderboard;
