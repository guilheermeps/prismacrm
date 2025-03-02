
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getLeads } from '@/lib/supabase';

const ConversionChart = () => {
  const [conversionRate, setConversionRate] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsData = await getLeads();
        
        // Calculate conversion rate based on leads that have been converted
        const convertedLeads = leadsData.filter(lead => 
          lead.history && lead.history.some(entry => entry.action === "converted")
        );
        
        const totalActiveLeads = leadsData.filter(lead => !lead.isArchived).length;
        
        const rate = totalActiveLeads > 0 
          ? Math.round((convertedLeads.length / totalActiveLeads) * 100) 
          : 0;
        
        setConversionRate(rate);
      } catch (error) {
        console.error("Erro ao calcular taxa de conversão:", error);
        // Use a default value if there's an error
        setConversionRate(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const data = [
    { name: 'Convertido', value: conversionRate },
    { name: 'Não Convertido', value: 100 - conversionRate }
  ];
  
  const COLORS = ['#FFBA08', '#2A2F3E'];
  
  return (
    <div className="h-[200px] w-full relative">
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-studio-yellow border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default ConversionChart;
