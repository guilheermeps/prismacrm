
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { conversionRate } from '@/utils/mockData';

const ConversionChart = () => {
  const data = [
    { name: 'Convertido', value: conversionRate },
    { name: 'Não Convertido', value: 100 - conversionRate }
  ];
  
  const COLORS = ['#FFBA08', '#2A2F3E'];
  
  return (
    <div className="h-[200px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="100%"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-4xl font-bold block">
          {conversionRate}%
        </span>
      </div>
    </div>
  );
};

export default ConversionChart;
