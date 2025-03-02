
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import NegotiationCard from "@/components/dashboard/NegotiationCard";
import { getLeads, getStages } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const SalesFunnelStats = () => {
  const [stats, setStats] = useState([
    {
      title: "Em negociação",
      data: {
        total: 0,
        currency: "R$",
        count: 0
      }
    },
    {
      title: "Propostas Enviadas",
      data: {
        total: 0,
        currency: "R$",
        count: 0
      }
    },
    {
      title: "Fechado (Mês)",
      data: {
        total: 0,
        currency: "R$",
        count: 0
      }
    },
    {
      title: "Taxa de Conversão",
      data: {
        total: 0,
        currency: "",
        count: 0
      },
      isPercentage: true
    }
  ]);

  // Use React Query to fetch and cache leads and stages
  const { data: leadsData = [], isLoading: isLeadsLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
    staleTime: 30000, // 30 seconds
  });

  const { data: stagesData = [], isLoading: isStagesLoading } = useQuery({
    queryKey: ['stages'],
    queryFn: getStages,
    staleTime: 300000, // 5 minutes
  });

  const isLoading = isLeadsLoading || isStagesLoading;

  useEffect(() => {
    if (!isLoading && leadsData.length > 0 && stagesData.length > 0) {
      calculateStats(leadsData, stagesData);
    }
  }, [isLoading, leadsData, stagesData]);

  const calculateStats = (leads, stages) => {
    try {
      // Calcular estatísticas baseadas nos leads reais
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      // Encontrar estágios por categorias
      const negotiationStages = stages.filter(stage => 
        stage.title.includes("Negociação") || 
        stage.title.includes("Reunião") || 
        stage.title.includes("Contato")
      );
      
      const proposalStages = stages.filter(stage => 
        stage.title.includes("Proposta") || 
        stage.title.includes("Orçamento")
      );
      
      const closedWonStages = stages.filter(stage => 
        stage.title.includes("Fechado (Ganho)") || 
        stage.title.includes("Ganho")
      );
      
      const closedLostStages = stages.filter(stage => 
        stage.title.includes("Fechado (Perdido)") || 
        stage.title.includes("Perdido")
      );
      
      // Calcular totais
      // Em negociação: todos os leads ativos exceto os que estão em estágios de fechado (ganho ou perdido)
      const negotiationLeads = leads.filter(lead => 
        !lead.isArchived && 
        !closedWonStages.some(stage => stage.id === lead.stageId) &&
        !closedLostStages.some(stage => stage.id === lead.stageId)
      );
      
      // Propostas enviadas: todos os leads na coluna de propostas, independente do status
      const proposalLeads = leads.filter(lead => 
        proposalStages.some(stage => stage.id === lead.stageId)
      );
      
      // Fechado (mês): leads ganhos no mês atual
      const closedWonLeads = leads.filter(lead => {
        const isClosedWon = closedWonStages.some(stage => stage.id === lead.stageId);
        if (!isClosedWon) return false;
        
        // Verificar se foi fechado este mês
        const leadCreatedAt = new Date(lead.createdAt); // Idealmente deveria ser a data de fechamento
        return leadCreatedAt >= firstDayOfMonth;
      });
      
      // Calcular valor total e contagem para cada categoria
      const calculateTotals = (filteredLeads) => {
        return {
          total: filteredLeads.reduce((sum, lead) => sum + (lead.proposalValue || 0), 0),
          count: filteredLeads.length
        };
      };
      
      const negotiationStats = calculateTotals(negotiationLeads);
      const proposalStats = calculateTotals(proposalLeads);
      const closedStats = calculateTotals(closedWonLeads);
      
      // Calcular taxa de conversão:
      // Total de leads convertidos em clientes (com action "converted") / total de leads * 100
      const convertedLeads = leads.filter(lead => 
        lead.history && lead.history.some(entry => entry.action === "converted")
      );
      const totalActiveLeads = leads.filter(lead => !lead.isArchived).length;
      
      const conversionRate = totalActiveLeads > 0 
        ? Math.round((convertedLeads.length / totalActiveLeads) * 100) 
        : 0;
      
      // Atualizar estatísticas
      setStats([
        {
          title: "Em negociação",
          data: {
            total: negotiationStats.total,
            currency: "R$",
            count: negotiationStats.count
          }
        },
        {
          title: "Propostas Enviadas",
          data: {
            total: proposalStats.total,
            currency: "R$",
            count: proposalStats.count
          }
        },
        {
          title: "Fechado (Mês)",
          data: {
            total: closedStats.total,
            currency: "R$",
            count: closedStats.count
          }
        },
        {
          title: "Taxa de Conversão",
          data: {
            total: conversionRate,
            currency: "",
            count: convertedLeads.length
          },
          isPercentage: true
        }
      ]);
    } catch (error) {
      console.error("Erro ao calcular estatísticas:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border shadow-sm">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="h-16 flex items-center justify-center">
                <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
              </div>
            ) : (
              <NegotiationCard
                title={stat.title}
                data={{
                  total: stat.data.total,
                  currency: stat.isPercentage ? "" : stat.data.currency,
                  count: stat.data.count
                }}
                isHighlighted={index === 0}
              />
            )}
            {stat.isPercentage && !isLoading && (
              <div className="text-xs text-muted-foreground mt-1">
                {stat.data.count} leads convertidos
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SalesFunnelStats;
