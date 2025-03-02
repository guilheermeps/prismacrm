
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';

const COLORS = ['#F97316', '#FFBA08', '#3B82F6', '#8B5CF6'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-2 border border-border rounded-md shadow-lg">
        <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const LeadSourceCard = () => {
  const { leadSources, isLoading } = useDashboardData();

  if (isLoading) {
    return <div className="h-[200px] w-full flex items-center justify-center bg-muted animate-pulse rounded-md"></div>;
  }

  // Não mostrar o gráfico se não houver dados
  if (!leadSources.length || leadSources.every(source => source.value === 0)) {
    return (
      <div className="h-[200px] w-full flex items-center justify-center">
        <p className="text-muted-foreground text-center">Sem dados de origem de leads disponíveis</p>
      </div>
    );
  }

  // Filtrar origens sem leads
  const filteredSources = leadSources.filter(source => source.value > 0);

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredSources}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1500}
          >
            {filteredSources.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeadSourceCard;
