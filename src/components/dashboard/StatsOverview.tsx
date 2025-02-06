
import { motion } from "framer-motion";

interface StatsOverviewProps {
  level: number;
  xp: number;
  coins: number;
}

export const StatsOverview = ({ level, xp, coins }: StatsOverviewProps) => {
  const xpToNextLevel = 1000; // Example: 1000 XP needed per level
  const currentLevelProgress = (xp % xpToNextLevel) / xpToNextLevel * 100;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Stats Overview</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Level</p>
          <p className="text-2xl font-bold">{level}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">XP</p>
          <p className="text-2xl font-bold">{xp}</p>
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {xp % xpToNextLevel} / {xpToNextLevel} XP to next level
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Coins</p>
          <p className="text-2xl font-bold">{coins}</p>
        </div>
      </div>
    </div>
  );
};
