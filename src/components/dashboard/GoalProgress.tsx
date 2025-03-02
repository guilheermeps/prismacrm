
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { getLeads, getStages, Lead, Stage } from "@/lib/supabase";

const GoalProgress = () => {
  const [goal, setGoal] = useState({
    current: 0,
    target: 10000, // Meta mensal padrão
    percentage: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar leads e estágios
        const [leadsData, stagesData] = await Promise.all([
          getLeads(),
          getStages()
        ]);
        
        // Identificar estágios "Fechado (Ganho)"
        const closedWonStages = stagesData.filter(stage => 
          stage.title.includes("Fechado (Ganho)") || 
          stage.title.includes("Ganho")
        );
        
        // Obter o mês atual
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        // Filtrar leads fechados no mês atual
        const closedLeadsThisMonth = leadsData.filter(lead => {
          const isClosedWon = closedWonStages.some(stage => stage.id === lead.stageId);
          if (!isClosedWon) return false;
          
          // Verificar se foi fechado este mês
          const closedDate = new Date(lead.createdAt); // Idealmente seria a data de fechamento
          return closedDate >= firstDayOfMonth;
        });
        
        // Calcular valor total
        const currentValue = closedLeadsThisMonth.reduce(
          (sum, lead) => sum + (lead.proposalValue || 0), 
          0
        );
        
        // Meta mensal fixada em R$ 10.000 por enquanto
        const targetValue = 10000;
        const percentage = Math.min((currentValue / targetValue) * 100, 100);
        
        setGoal({
          current: currentValue,
          target: targetValue,
          percentage: percentage
        });
      } catch (error) {
        console.error("Erro ao carregar dados de meta:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg animate-pulse">...</span>
          <span className="text-muted-foreground text-sm animate-pulse">Carregando...</span>
        </div>
        <Progress 
          value={0} 
          className="h-6 bg-studio-gray" 
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">{goal.percentage.toFixed(0)}%</span>
        <span className="text-muted-foreground text-sm">
          {`R$ ${goal.current.toLocaleString()} / Meta: R$ ${goal.target.toLocaleString()}`}
        </span>
      </div>
      
      <Progress 
        value={goal.percentage} 
        className="h-6 bg-studio-gray" 
        indicatorClassName="bg-gradient-to-r from-studio-yellow to-studio-orange transition-all duration-1000 ease-in-out"
      />
    </div>
  );
};

export default GoalProgress;
