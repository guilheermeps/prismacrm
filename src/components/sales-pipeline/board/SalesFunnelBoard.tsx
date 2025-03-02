import React, { useState, useEffect } from "react";
import LeadColumn from "@/components/sales-pipeline/LeadColumn";
import SalesPipelineMenu from "@/components/sales-pipeline/board/SalesPipelineMenu";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [localFilteredLeads, setLocalFilteredLeads] = useState<Lead[]>(filteredLeads);

  // Update local state when props change
  useEffect(() => {
    setBoardLeads(filteredLeads);
    setLocalFilteredLeads(filteredLeads);
  }, [filteredLeads]);

  // Search functionality - modified to only use properties that exist in Lead type
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setLocalFilteredLeads(boardLeads);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = boardLeads.filter(lead => 
        lead.name.toLowerCase().includes(lowercaseSearch) || 
        (lead.whatsapp && lead.whatsapp.toLowerCase().includes(lowercaseSearch)) ||
        (lead.serviceType && lead.serviceType.toLowerCase().includes(lowercaseSearch)) ||
        (lead.notes && lead.notes.toLowerCase().includes(lowercaseSearch))
      );
      setLocalFilteredLeads(filtered);
    }
  }, [searchTerm, boardLeads]);

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

  // Handle adding a new lead (passed to menu)
  const handleAddNewLead = async (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => {
    // This is just a pass-through to the parent component
    return Promise.resolve();
  };

  // Handle refresh action
  const handleRefresh = () => {
    // Simply reset to the filtered leads from props
    setBoardLeads(filteredLeads);
    setLocalFilteredLeads(filteredLeads);
    setSearchTerm("");
  };

  return (
    <div className="space-y-4">
      {/* New Menu Component */}
      <SalesPipelineMenu 
        stages={stages}
        isArchived={isArchived}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNewLead={handleAddNewLead}
        onRefresh={handleRefresh}
      />
      
      {/* Board Content */}
      <div 
        className="overflow-x-auto pb-4 min-h-[500px]" 
        onDragOver={handleDragOver}
      >
        <div className="flex gap-4 min-w-max h-full">
          {stages.map(stage => (
            <LeadColumn
              key={stage.id}
              stage={stage}
              leads={localFilteredLeads.filter(lead => lead.stageId === stage.id)}
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
    </div>
  );
};

export default SalesFunnelBoard;
