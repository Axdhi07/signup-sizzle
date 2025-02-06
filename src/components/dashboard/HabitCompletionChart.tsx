
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface HabitCompletionChartProps {
  completedHabits: number;
  totalHabits: number;
}

export const HabitCompletionChart = ({ completedHabits, totalHabits }: HabitCompletionChartProps) => {
  const pieData = [
    { name: "Completed", value: completedHabits },
    { name: "Remaining", value: totalHabits - completedHabits }
  ];
  const COLORS = ["#10B981", "#E5E7EB"];

  return (
    <div className="w-24 h-24">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            innerRadius={25}
            outerRadius={35}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center text-sm mt-2">
        {((completedHabits / totalHabits) * 100).toFixed(0)}% Complete
      </div>
    </div>
  );
};
