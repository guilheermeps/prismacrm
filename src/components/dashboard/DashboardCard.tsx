
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  animate?: boolean;
  delay?: string;
}

const DashboardCard = ({ 
  title, 
  children, 
  className,
  fullWidth = false,
  animate = true,
  delay = '0s'
}: DashboardCardProps) => {
  return (
    <div 
      className={cn(
        "bg-card rounded-xl p-5 shadow-lg overflow-hidden",
        fullWidth ? "col-span-full" : "",
        animate ? "animate-slide-up" : "",
        className
      )}
      style={{ animationDelay: delay }}
    >
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="h-full">{children}</div>
    </div>
  );
};

export default DashboardCard;
