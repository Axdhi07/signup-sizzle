
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Template {
  id: string;
  title: string;
  description: string;
}

interface TemplateSectionProps {
  selectedTemplate: string;
  templates: Template[];
  onChange: (value: string) => void;
}

export const TemplateSection = ({ selectedTemplate, templates, onChange }: TemplateSectionProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Choose a habit template to get started
      </label>
      <Select
        value={selectedTemplate}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full mt-1">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem
              key={template.id}
              value={template.id}
            >
              {template.title} - {template.description}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
