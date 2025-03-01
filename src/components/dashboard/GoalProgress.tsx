
import { Progress } from "@/components/ui/progress";
import { monthlyGoal } from '@/utils/mockData';

const GoalProgress = () => {
  const { current, target, month } = monthlyGoal;
  const percentage = (current / target) * 100;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">{percentage.toFixed(0)}%</span>
        <span className="text-muted-foreground text-sm">{`Meta: R$ ${target.toLocaleString()}`}</span>
      </div>
      
      <Progress 
        value={percentage} 
        className="h-6 bg-studio-gray" 
        indicatorClassName="bg-gradient-to-r from-studio-yellow to-studio-orange transition-all duration-1000 ease-in-out"
      />
    </div>
  );
};

export default GoalProgress;
