
import React from "react";
import LeadColumn from "@/components/sales-pipeline/LeadColumn";
import { Lead, Stage } from "@/lib/supabase/types";

interface SalesFunnelBoardProps {
  stages: Stage[];
  filteredLeads: Lead[];
  onMoveLead: (leadId: string, fromStageId: string, toStageId: string) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onConvertToContact: (lead: Lead) => void;
  onArchiveLead: (lead: Lead) => void;
  onUnarchiveLead: (lead: Lead) => void;
  isArchived: boolean;
}

const SalesFunnelBoard = ({ 
  stages, 
  filteredLeads, 
  onMoveLead, 
  onUpdateLead, 
  onDeleteLead, 
  onConvertToContact, 
  onArchiveLead, 
  onUnarchiveLead, 
  isArchived 
}: SalesFunnelBoardProps) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div 
      className="overflow-x-auto pb-4 min-h-[500px]" 
      onDragOver={handleDragOver}
    >
      <div className="flex gap-4 min-w-max h-full">
        {stages.map(stage => (
          <LeadColumn
            key={stage.id}
            stage={stage}
            leads={filteredLeads.filter(lead => lead.stageId === stage.id)}
            allStages={stages}
            onMoveLead={onMoveLead}
            onUpdateLead={onUpdateLead}
            onDeleteLead={onDeleteLead}
            onConvertToContact={onConvertToContact}
            onArchiveLead={onArchiveLead}
            onUnarchiveLead={onUnarchiveLead}
            isArchived={isArchived}
          />
        ))}
      </div>
    </div>
  );
};

export default SalesFunnelBoard;
