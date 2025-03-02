
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import NegotiationCard from "@/components/dashboard/NegotiationCard";
import { getLeads, getStages, Lead, Stage } from "@/lib/supabase";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados
        const [leadsData, stagesData] = await Promise.all([
          getLeads(),
          getStages()
        ]);

        // Calcular estatísticas baseadas nos leads reais
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        // Encontrar estágios por categorias
        const negotiationStages = stagesData.filter(stage => 
          stage.title.includes("Negociação") || 
          stage.title.includes("Reunião")
        );
        
        const proposalStages = stagesData.filter(stage => 
          stage.title.includes("Proposta") || 
          stage.title.includes("Orçamento")
        );
        
        const closedWonStages = stagesData.filter(stage => 
          stage.title.includes("Fechado (Ganho)") || 
          stage.title.includes("Ganho")
        );
        
        // Calcular totais
        const negotiationLeads = leadsData.filter(lead => 
          negotiationStages.some(stage => stage.id === lead.stageId)
        );
        
        const proposalLeads = leadsData.filter(lead => 
          proposalStages.some(stage => stage.id === lead.stageId)
        );
        
        const closedWonLeads = leadsData.filter(lead => {
          const isClosedWon = closedWonStages.some(stage => stage.id === lead.stageId);
          if (!isClosedWon) return false;
          
          // Verificar se foi fechado este mês
          const closedDate = new Date(lead.createdAt); // Idealmente deveria ser a data de fechamento
          return closedDate >= firstDayOfMonth;
        });
        
        // Calcular valor total e contagem para cada categoria
        const calculateTotals = (leads: Lead[]) => {
          return {
            total: leads.reduce((sum, lead) => sum + (lead.proposalValue || 0), 0),
            count: leads.length
          };
        };
        
        const negotiationStats = calculateTotals(negotiationLeads);
        const proposalStats = calculateTotals(proposalLeads);
        const closedStats = calculateTotals(closedWonLeads);
        
        // Calcular taxa de conversão (leads fechados / total de leads) * 100
        const totalLeads = leadsData.length;
        const closedTotalLeads = leadsData.filter(lead => 
          closedWonStages.some(stage => stage.id === lead.stageId)
        ).length;
        
        const conversionRate = totalLeads > 0 
          ? Math.round((closedTotalLeads / totalLeads) * 100) 
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
              count: closedTotalLeads
            },
            isPercentage: true
          }
        ]);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border shadow-sm">
          <CardContent className="p-4">
            {loading ? (
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
            {stat.isPercentage && !loading && (
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
