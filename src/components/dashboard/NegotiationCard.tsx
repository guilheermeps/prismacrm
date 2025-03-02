
interface NegotiationCardProps {
  title?: string;
  data?: {
    total: number;
    currency: string;
    count: number;
  }
  onClick?: () => void;
  isHighlighted?: boolean;
}

const NegotiationCard = ({ 
  title = "Em negociação", 
  data = { total: 0, currency: "R$", count: 0 },
  onClick,
  isHighlighted
}: NegotiationCardProps) => {
  const { total, currency, count } = data;
  
  const formattedValue = currency 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)
    : `${total}%`;
  
  return (
    <div 
      className={`flex flex-col space-y-2 ${onClick ? 'cursor-pointer hover:bg-studio-gray/30 transition-colors' : ''} ${isHighlighted ? 'border-l-4 border-studio-yellow pl-2' : ''}`}
      onClick={onClick}
    >
      <p className="text-muted-foreground">{title}</p>
      <div>
        <span className={`text-4xl font-bold ${isHighlighted ? 'text-studio-yellow' : ''}`}>
          {currency ? formattedValue : `${total}%`}
        </span>
        <p className="text-sm text-muted-foreground mt-1">
          {count} {count === 1 ? 'cliente' : 'clientes'}
        </p>
      </div>
    </div>
  );
};

export default NegotiationCard;
