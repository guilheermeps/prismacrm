
import React, { useState, useEffect } from "react";
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
  const [boardLeads, setBoardLeads] = useState<Lead[]>(filteredLeads);

  // Update local state when props change
  useEffect(() => {
    setBoardLeads(filteredLeads);
  }, [filteredLeads]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Create an optimistic update handler
  const handleOptimisticLeadMove = (leadId: string, fromStageId: string, toStageId: string) => {
    // Update the lead's stage in our local state first
    const updatedLeads = boardLeads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, stageId: toStageId };
      }
      return lead;
    });
    
    // Update local state
    setBoardLeads(updatedLeads);
    
    // Then call the parent handler to update backend
    onMoveLead(leadId, fromStageId, toStageId);
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
            leads={boardLeads.filter(lead => lead.stageId === stage.id)}
            allStages={stages}
            onMoveLead={handleOptimisticLeadMove}
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
