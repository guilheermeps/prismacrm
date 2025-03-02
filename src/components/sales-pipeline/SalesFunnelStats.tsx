
import React from "react";
import { useLeadOperations } from "./hooks/useLeadOperations";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const SalesFunnelStats = () => {
  const { leads, loading } = useLeadOperations();

  // Use React Query to optimize stats calculations
  const { data: stats } = useQuery({
    queryKey: ['leadStats', leads.length],
    queryFn: () => {
      // Calculate all stats from leads
      const activeLeads = leads.filter(lead => !lead.isArchived);
      const archivedLeads = leads.filter(lead => lead.isArchived);
      
      // Total active leads
      const totalActiveLeads = activeLeads.length;
      
      // Total proposal value
      const totalProposalValue = activeLeads.reduce((total, lead) => 
        total + (lead.proposalValue || 0), 0);
      
      // Calculate conversion rate
      const convertedLeads = activeLeads.filter(lead => 
        lead.history && lead.history.some(entry => entry.action === "converted")
      );
      const conversionRate = totalActiveLeads > 0 
        ? Math.round((convertedLeads.length / totalActiveLeads) * 100) 
        : 0;

      return {
        totalActiveLeads,
        totalProposalValue,
        conversionRate,
        totalArchivedLeads: archivedLeads.length,
        convertedLeadsCount: convertedLeads.length
      };
    },
    enabled: !loading,
    staleTime: 30000, // Stats are fresh for 30 seconds
  });
  
  if (loading) {
    return <div className="animate-pulse bg-muted h-20 rounded-lg"></div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Leads Card */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Negociações Ativas</p>
            <p className="text-2xl font-bold">{stats?.totalActiveLeads || 0}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Total Proposal Value Card */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Valor em Propostas</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(stats?.totalProposalValue || 0)}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Conversion Rate Card */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
            <p className="text-2xl font-bold">{stats?.conversionRate || 0}%</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Archived Leads Card */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Leads Convertidos</p>
            <p className="text-2xl font-bold">{stats?.convertedLeadsCount || 0}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesFunnelStats;
