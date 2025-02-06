
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from "./OnboardingForm";

interface GoalSectionProps {
  formData: Pick<FormData, "category" | "description" | "target">;
  onChange: (updates: Partial<FormData>) => void;
}

export const GoalSection = ({ formData, onChange }: GoalSectionProps) => {
  const categories = [
    { value: "weight_gain", label: "Weight Gain" },
    { value: "academic", label: "Academic Goals" },
    { value: "habits", label: "Daily Habits" },
    { value: "fitness", label: "Fitness" },
    { value: "career", label: "Career Growth" },
  ];

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          What's your main focus?
        </label>
        <Select
          value={formData.category}
          onValueChange={(value) => onChange({ category: value })}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category.value}
                value={category.value}
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tell us more about your goal
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="E.g., I want to gain 10kg of muscle mass in 6 months"
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          What's your target?
        </label>
        <Input
          type="text"
          value={formData.target}
          onChange={(e) => onChange({ target: e.target.value })}
          placeholder="E.g., 75kg"
          className="mt-1"
        />
      </div>
    </>
  );
};
