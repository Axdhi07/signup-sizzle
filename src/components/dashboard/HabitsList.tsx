import { useState } from "react";
import { Flame, Play, XCircle, Coins, Edit, Trash2 } from "lucide-react";
import { HabitCompletionChart } from "./HabitCompletionChart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface Habit {
  id: string;
  title: string;
  description: string | null;
  streak: number | null;
  last_completion_date: string | null;
  duration_minutes: number;
  coin_reward: number;
  streak_recovery_cost: number;
  streak_breaks_count: number;
}

interface HabitsListProps {
  habits: Habit[];
}

export const HabitsList = ({ habits }: HabitsListProps) => {
  const [activeHabit, setActiveHabit] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const completedHabits = habits?.filter(habit => 
    habit.last_completion_date && 
    new Date(habit.last_completion_date).toDateString() === new Date().toDateString()
  ).length || 0;
  
  const totalHabits = habits?.length || 0;
  const highestStreak = habits?.reduce((max, habit) => 
    Math.max(max, habit.streak || 0), 0) || 0;

  const deleteHabit = async (habitId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId);

    if (error) {
      toast({
        title: "Error deleting habit",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['habits'] });
    toast({
      title: "Habit deleted",
      description: "Your habit has been deleted successfully.",
    });
  };

  const startHabit = async (habit: Habit) => {
    if (activeHabit) {
      toast({
        title: "Another habit is in progress",
        description: "Please complete or cancel the current habit first",
        variant: "destructive",
      });
      return;
    }

    setActiveHabit(habit.id);
    setTimeLeft(habit.duration_minutes * 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          completeHabit(habit);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeHabit = async (habit: Habit) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update habit completion
    const { error: habitError } = await supabase
      .from('habits')
      .update({
        last_completion_date: new Date().toISOString(),
        streak: (habit.streak || 0) + 1,
      })
      .eq('id', habit.id);

    if (habitError) {
      toast({
        title: "Error updating habit",
        description: habitError.message,
        variant: "destructive",
      });
      return;
    }

    // Add coins to user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('coins')
      .eq('id', user.id)
      .single();

    if (!profile) {
      toast({
        title: "Error updating coins",
        description: "Profile not found",
        variant: "destructive",
      });
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        coins: profile.coins + habit.coin_reward,
      })
      .eq('id', user.id);

    if (profileError) {
      toast({
        title: "Error updating coins",
        description: profileError.message,
        variant: "destructive",
      });
      return;
    }

    setActiveHabit(null);
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    queryClient.invalidateQueries({ queryKey: ['habits'] });

    toast({
      title: "Habit completed!",
      description: `You earned ${habit.coin_reward} coins!`,
    });
  };

  const recoverStreak = async (habit: Habit) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const recoveryCost = habit.streak_recovery_cost * Math.pow(2, habit.streak_breaks_count);

    // Check if user has enough coins
    const { data: profile } = await supabase
      .from('profiles')
      .select('coins')
      .eq('id', user.id)
      .single();

    if (!profile || profile.coins < recoveryCost) {
      toast({
        title: "Not enough coins",
        description: `You need ${recoveryCost} coins to recover your streak`,
        variant: "destructive",
      });
      return;
    }

    // Update habit and deduct coins
    const { error: habitError } = await supabase
      .from('habits')
      .update({
        streak_breaks_count: habit.streak_breaks_count + 1,
      })
      .eq('id', habit.id);

    if (habitError) {
      toast({
        title: "Error updating habit",
        description: habitError.message,
        variant: "destructive",
      });
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        coins: profile.coins - recoveryCost,
      })
      .eq('id', user.id);

    if (profileError) {
      toast({
        title: "Error updating coins",
        description: profileError.message,
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['profile'] });
    queryClient.invalidateQueries({ queryKey: ['habits'] });

    toast({
      title: "Streak recovered!",
      description: `${recoveryCost} coins have been deducted`,
    });
  };

  return (
    <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-lg font-semibold">Your Habits</h2>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-orange-400 flex items-center justify-center mb-2">
              <Flame className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-sm font-medium">{highestStreak} day streak</span>
          </div>
          <HabitCompletionChart completedHabits={completedHabits} totalHabits={totalHabits} />
        </div>
      </div>
      
      {habits && habits.length > 0 ? (
        <div className="space-y-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{habit.title}</h3>
                  {habit.description && (
                    <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
                  )}
                  <div className="mt-2 flex items-center space-x-4">
                    {habit.streak && habit.streak > 0 && (
                      <div className="flex items-center text-sm text-orange-500">
                        <Flame className="h-4 w-4 mr-1" />
                        {habit.streak} day streak
                      </div>
                    )}
                    <div className="flex items-center text-sm text-yellow-500">
                      <Coins className="h-4 w-4 mr-1" />
                      {habit.coin_reward} coins
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {activeHabit === habit.id ? (
                    <div className="text-sm font-medium">
                      {Math.floor(timeLeft! / 60)}:{(timeLeft! % 60).toString().padStart(2, '0')}
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startHabit(habit)}
                        className="flex items-center"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/create-plan?edit=${habit.id}`)}
                        className="flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteHabit(habit.id)}
                        className="flex items-center text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                  {habit.streak === 0 && habit.last_completion_date && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => recoverStreak(habit)}
                      className="flex items-center text-destructive"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Recover Streak ({habit.streak_recovery_cost * Math.pow(2, habit.streak_breaks_count)} coins)
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No habits created yet. Start by adding a new habit!</p>
      )}
    </div>
  );
};
