
import { Input } from "@/components/ui/input";

interface PersonalInfoSectionProps {
  displayName: string;
  onChange: (value: string) => void;
}

export const PersonalInfoSection = ({ displayName, onChange }: PersonalInfoSectionProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        What should we call you?
      </label>
      <Input
        type="text"
        value={displayName}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your display name"
        className="mt-1"
      />
    </div>
  );
};
