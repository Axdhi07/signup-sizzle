
import { useState } from "react";
import { SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { GoalSection } from "./GoalSection";
import { TemplateSection } from "./TemplateSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export type FormData = {
  category: string;
  description: string;
  target: string;
  displayName: string;
  selectedTemplate: string;
};

export const OnboardingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    category: "",
    description: "",
    target: "",
    displayName: "",
    selectedTemplate: "",
  });

  // Fetch available habit templates
  const { data: templates } = useQuery({
    queryKey: ["habitTemplates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habit_templates")
        .select("*")
        .order("title");

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Update user's display name if provided
      if (formData.displayName) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ display_name: formData.displayName })
          .eq("id", user.id);

        if (profileError) throw profileError;
      }

      // Insert user goals
      const { error: goalError } = await supabase.from("user_goals").insert({
        user_id: user.id,
        category: formData.category,
        description: formData.description,
        target: formData.target,
      });

      if (goalError) throw goalError;

      // If a template was selected, create habits from the template
      if (formData.selectedTemplate && templates) {
        const selectedTemplate = templates.find(t => t.id === formData.selectedTemplate);
        
        if (selectedTemplate) {
          const { error: habitError } = await supabase.from("habits").insert({
            user_id: user.id,
            title: selectedTemplate.title,
            description: selectedTemplate.description,
            category: formData.category,
            frequency: selectedTemplate.frequency,
            theme: selectedTemplate.theme,
            duration_minutes: selectedTemplate.duration_minutes,
          });

          if (habitError) throw habitError;

          // Initialize habit statistics
          const { data: habit } = await supabase
            .from("habits")
            .select("id")
            .eq("user_id", user.id)
            .eq("title", selectedTemplate.title)
            .single();

          if (habit) {
            const { error: statsError } = await supabase.from("habit_statistics").insert({
              user_id: user.id,
              habit_id: habit.id,
              completion_rate: 0,
              streak_history: [0],
              monthly_completions: 0,
            });

            if (statsError) throw statsError;
          }
        }
      }

      toast({
        title: "Welcome aboard!",
        description: "Your goals have been saved. Let's start creating your plan!",
      });

      navigate("/create-plan");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your goals. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PersonalInfoSection
          displayName={formData.displayName}
          onChange={(value) => setFormData({ ...formData, displayName: value })}
        />
        <GoalSection
          formData={formData}
          onChange={(updates) => setFormData({ ...formData, ...updates })}
        />
        <TemplateSection
          selectedTemplate={formData.selectedTemplate}
          templates={templates || []}
          onChange={(value) => setFormData({ ...formData, selectedTemplate: value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Continue to Create Plan"}
      </Button>
    </form>
  );
};
