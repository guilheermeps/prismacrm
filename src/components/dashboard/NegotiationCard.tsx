
import { negotiations } from '@/utils/mockData';

interface NegotiationCardProps {
  title?: string;
  data?: {
    total: number;
    currency: string;
    count: number;
  }
}

const NegotiationCard = ({ 
  title = "Em negociação", 
  data = negotiations 
}: NegotiationCardProps) => {
  const { total, currency, count } = data;
  
  return (
    <div className="flex flex-col space-y-2">
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
