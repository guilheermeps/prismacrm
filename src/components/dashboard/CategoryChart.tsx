
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { serviceTypes } from '@/utils/mockData';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-darker p-2 border border-studio-gray rounded-md shadow-lg">
        <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const CategoryChart = () => {
  const COLORS = ['#FFBA08', '#FCA311', '#F97316', '#E65100'];
  
  return (
    <div className="h-[200px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={serviceTypes}
          layout="vertical"
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <XAxis 
            type="number" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#E2E8F0' }}
            domain={[0, 'dataMax + 10']}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#E2E8F0' }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]}
            animationDuration={1500}
          >
            {serviceTypes.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
