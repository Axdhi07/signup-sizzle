import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

interface UserGoal {
  id: string;
  category: string;
  description: string;
  target: string;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  scheduledTime: string;
  durationMinutes: string;
  frequency: string;
}

interface HabitFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

export const HabitForm = ({ onSubmit }: HabitFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editHabitId = queryParams.get('edit');
  
  const { data: habitToEdit } = useQuery({
    queryKey: ['habit', editHabitId],
    queryFn: async () => {
      if (!editHabitId) return null;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("id", editHabitId)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!editHabitId,
  });

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    priority: "1",
    scheduledTime: "",
    durationMinutes: "30",
    frequency: "daily",
  });

  useEffect(() => {
    if (habitToEdit) {
      setFormData({
        title: habitToEdit.title,
        description: habitToEdit.description || "",
        category: habitToEdit.category || "",
        priority: habitToEdit.priority.toString(),
        scheduledTime: habitToEdit.scheduled_time || "",
        durationMinutes: habitToEdit.duration_minutes.toString(),
        frequency: habitToEdit.frequency,
      });
    }
  }, [habitToEdit]);

  const { data: userGoals } = useQuery({
    queryKey: ["userGoals"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as UserGoal[];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      if (editHabitId) {
        // If duration changed, reset streak
        if (habitToEdit && parseInt(formData.durationMinutes) !== habitToEdit.duration_minutes) {
          const { error } = await supabase
            .from("habits")
            .update({
              title: formData.title,
              description: formData.description,
              category: formData.category,
              priority: parseInt(formData.priority),
              scheduled_time: formData.scheduledTime,
              duration_minutes: parseInt(formData.durationMinutes),
              frequency: formData.frequency,
              streak: 0, // Reset streak when duration changes
              streak_breaks_count: (habitToEdit.streak_breaks_count || 0) + 1,
            })
            .eq("id", editHabitId);

          if (error) throw error;

          toast({
            title: "Habit updated",
            description: "Duration changed - streak has been reset",
          });
        } else {
          // Update without resetting streak
          const { error } = await supabase
            .from("habits")
            .update({
              title: formData.title,
              description: formData.description,
              category: formData.category,
              priority: parseInt(formData.priority),
              scheduled_time: formData.scheduledTime,
              duration_minutes: parseInt(formData.durationMinutes),
              frequency: formData.frequency,
            })
            .eq("id", editHabitId);

          if (error) throw error;

          toast({
            title: "Habit updated",
            description: "Your habit has been updated successfully",
          });
        }
      } else {
        // Create new habit
        await onSubmit(formData);
      }

      // Reset form after submission
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "1",
        scheduledTime: "",
        durationMinutes: "30",
        frequency: "daily",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save habit. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Habit Title
        </label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="E.g., Morning Workout"
          required
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe your habit"
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {userGoals?.map((goal) => (
              <SelectItem key={goal.id} value={goal.category}>
                {goal.category.replace("_", " ").toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Frequency
        </label>
        <Select
          value={formData.frequency}
          onValueChange={(value) =>
            setFormData({ ...formData, frequency: value })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Scheduled Time
          </label>
          <Input
            type="time"
            value={formData.scheduledTime}
            onChange={(e) =>
              setFormData({ ...formData, scheduledTime: e.target.value })
            }
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <Input
            type="number"
            min="1"
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData({ ...formData, durationMinutes: e.target.value })
            }
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority (1-5)
        </label>
        <Select
          value={formData.priority}
          onValueChange={(value) =>
            setFormData({ ...formData, priority: value })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((priority) => (
              <SelectItem key={priority} value={priority.toString()}>
                {priority} - {priority === 1 ? "Highest" : priority === 5 ? "Lowest" : "Medium"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Add Habit"}
      </Button>
    </form>
  );
};
