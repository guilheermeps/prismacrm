
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children?: ReactNode;
  className?: string;
  fullWidth?: boolean;
  animate?: boolean;
  delay?: string;
  value?: string;
  trend?: string;
  trendDirection?: string;
  period?: string;
}

const DashboardCard = ({ 
  title, 
  children, 
  className,
  fullWidth = false,
  animate = true,
  delay = '0s',
  value,
  trend,
  trendDirection,
  period
}: DashboardCardProps) => {
  // If value prop is provided, we render a stats card
  if (value) {
    return (
      <div 
        className={cn(
          "bg-card rounded-lg md:rounded-xl p-4 md:p-5 shadow-lg overflow-hidden",
          fullWidth ? "col-span-full" : "",
          animate ? "animate-slide-up" : "",
          className
        )}
        style={{ animationDelay: delay }}
      >
        <h3 className="text-base md:text-lg font-medium mb-1">{title}</h3>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl md:text-3xl font-bold">{value}</p>
          {trend && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              trendDirection === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {trend} {period && <span className="text-muted-foreground">({period})</span>}
            </span>
          )}
        </div>
        {children && <div className="mt-2">{children}</div>}
      </div>
    );
  }

  // Original layout for non-stats cards
  return (
    <div 
      className={cn(
        "bg-card rounded-lg md:rounded-xl p-4 md:p-5 shadow-lg overflow-hidden",
        fullWidth ? "col-span-full" : "",
        animate ? "animate-slide-up" : "",
        className
      )}
      style={{ animationDelay: delay }}
    >
      <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">{title}</h3>
      <div className="h-full">{children}</div>
    </div>
  );
};

export default DashboardCard;
