
import React from "react";
import { Lead } from "@/lib/supabase/types";

interface ColumnSummaryProps {
  leads: Lead[];
}

const ColumnSummary = ({ leads }: ColumnSummaryProps) => {
  // Calculate total value of leads in this stage
  const totalValue = leads.reduce((sum, lead) => sum + (lead.proposalValue || 0), 0);

  if (leads.length === 0) {
    return null;
  }

  return (
    <div className="px-3 py-2 text-sm text-muted-foreground">
      <span className="font-medium">
        {new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }).format(totalValue)}
      </span> em {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
    </div>
  );
};

export default ColumnSummary;
