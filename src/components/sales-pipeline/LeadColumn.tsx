
import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Lead, Stage } from "@/lib/supabase/types";
import ColumnHeader from "@/components/sales-pipeline/column/ColumnHeader";
import ColumnSummary from "@/components/sales-pipeline/column/ColumnSummary";
import ColumnContent from "@/components/sales-pipeline/column/ColumnContent";
import NewLeadDialog from "@/components/sales-pipeline/column/NewLeadDialog";

interface LeadColumnProps {
  stage: Stage;
  leads: Lead[];
  allStages: Stage[];
  onMoveLead: (leadId: string, fromStageId: string, toStageId: string) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onConvertToContact: (lead: Lead) => void;
  onArchiveLead?: (lead: Lead) => void;
  onUnarchiveLead?: (lead: Lead) => void;
  onDiscardLead?: (lead: Lead) => void;
  isArchived?: boolean;
  savingLeadId?: string | null;
  successLeadId?: string | null;
}

const LeadColumn = ({
  stage,
  leads,
  allStages,
  onMoveLead,
  onUpdateLead,
  onDeleteLead,
  onConvertToContact,
  onArchiveLead,
  onUnarchiveLead,
  onDiscardLead,
  isArchived = false,
  savingLeadId = null,
  successLeadId = null
}: LeadColumnProps) => {
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [columnLeads, setColumnLeads] = useState<Lead[]>(leads);
  
  // Update local state when props change
  useEffect(() => {
    setColumnLeads(leads);
  }, [leads]);

  const handleAddNewLead = (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => {
    try {
      // Create a new lead in this stage
      const leadWithStage = { ...newLead, stageId: stage.id };
      onUpdateLead(leadWithStage as Lead);
      setIsNewLeadDialogOpen(false);
      toast.success("Lead adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar lead:", error);
      toast.error("Erro ao adicionar lead. Tente novamente.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    // Add visual indicator that drop is allowed
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Remove visual indicator
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Remove visual indicator
    setIsDragOver(false);
    
    if (isArchived) return; // Prevent dropping in archived view
    
    try {
      // Try to get JSON data
      const jsonData = e.dataTransfer.getData("application/json");
      
      if (jsonData) {
        const data = JSON.parse(jsonData);
        const leadId = data.leadId;
        const fromStageId = data.stageId;
        
        if (leadId && fromStageId && fromStageId !== stage.id) {
          console.log(`Moving lead ${leadId} from stage ${fromStageId} to stage ${stage.id}`);
          
          // Call the move function to update the backend and UI
          onMoveLead(leadId, fromStageId, stage.id);
        }
      }
    } catch (error) {
      console.error("Erro ao mover lead:", error);
      toast.error("Erro ao mover lead. Tente novamente.");
    }
  };

  return (
    <div 
      className={`flex flex-col rounded-md min-w-[300px] max-w-[300px] transition-colors ${isDragOver ? 'bg-primary/10' : 'bg-secondary/20'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragOver}
      onDrop={handleDrop}
      data-stage-id={stage.id}
    >
      {/* Stage Header */}
      <ColumnHeader 
        stage={stage} 
        leadsCount={columnLeads.length}
        isArchived={isArchived}
        onAddNewLead={() => setIsNewLeadDialogOpen(true)}
      />

      {/* Value Summary */}
      <ColumnSummary leads={columnLeads} />

      {/* Leads List */}
      <ColumnContent 
        leads={columnLeads}
        stages={allStages}
        onMoveLead={onMoveLead}
        onUpdateLead={onUpdateLead}
        onDeleteLead={onDeleteLead}
        onConvertToContact={onConvertToContact}
        onArchiveLead={onArchiveLead}
        onUnarchiveLead={onUnarchiveLead}
        onDiscardLead={onDiscardLead}
        isArchived={isArchived}
        savingLeadId={savingLeadId}
        successLeadId={successLeadId}
      />

      {/* New Lead Dialog */}
      <Dialog open={isNewLeadDialogOpen} onOpenChange={setIsNewLeadDialogOpen}>
        <NewLeadDialog 
          isOpen={isNewLeadDialogOpen}
          onOpenChange={setIsNewLeadDialogOpen}
          onSave={handleAddNewLead}
          stages={allStages}
          stageId={stage.id}
          stageTitle={stage.title}
        />
      </Dialog>
    </div>
  );
};

export default LeadColumn;
