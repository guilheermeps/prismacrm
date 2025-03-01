
import { negotiations } from '@/utils/mockData';

interface NegotiationCardProps {
  title?: string;
  data?: {
    total: number;
    currency: string;
    count: number;
  }
  onClick?: () => void;
}

const NegotiationCard = ({ 
  title = "Em negociação", 
  data = negotiations,
  onClick
}: NegotiationCardProps) => {
  const { total, currency, count } = data;
  
  return (
    <div 
      className={`flex flex-col space-y-2 ${onClick ? 'cursor-pointer hover:bg-studio-gray/30 transition-colors' : ''}`}
      onClick={onClick}
    >
      <p className="text-muted-foreground">{title}</p>
      <div>
        <span className="text-4xl font-bold">
          {currency}{total.toLocaleString()}
        </span>
        <p className="text-sm text-muted-foreground mt-1">
          {count} {count === 1 ? 'cliente' : 'clientes'}
        </p>
      </div>
    </div>
  );
};

export default NegotiationCard;
