
import { Flame } from "lucide-react";
import { HabitCompletionChart } from "./HabitCompletionChart";

interface Habit {
  id: string;
  title: string;
  description: string | null;
  streak: number | null;
  last_completion_date: string | null;
}

interface HabitsListProps {
  habits: Habit[];
}

export const HabitsList = ({ habits }: HabitsListProps) => {
  const completedHabits = habits?.filter(habit => 
    habit.last_completion_date && 
    new Date(habit.last_completion_date).toDateString() === new Date().toDateString()
  ).length || 0;
  const totalHabits = habits?.length || 0;
  const highestStreak = habits?.reduce((max, habit) => 
    Math.max(max, habit.streak || 0), 0) || 0;

  return (
    <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-lg font-semibold">Your Habits</h2>
        <div className="flex items-center space-x-4">
          {/* Streak Display */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-orange-400 flex items-center justify-center mb-2">
              <Flame className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-sm font-medium">{highestStreak} day streak</span>
          </div>
          
          {/* Completion Pie Chart */}
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
              <h3 className="font-medium">{habit.title}</h3>
              {habit.description && (
                <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
              )}
              {habit.streak && habit.streak > 0 && (
                <div className="mt-2 flex items-center text-sm text-orange-500">
                  <Flame className="h-4 w-4 mr-1" />
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
  );
};
