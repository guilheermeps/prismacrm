
import { negotiations } from '@/utils/mockData';

const NegotiationCard = () => {
  const { total, currency, count } = negotiations;
  
  return (
    <div className="flex flex-col space-y-2">
      <p className="text-muted-foreground">Em negociação</p>
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
