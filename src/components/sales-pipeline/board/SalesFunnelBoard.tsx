
import React, { useState, useEffect } from "react";
import LeadColumn from "@/components/sales-pipeline/LeadColumn";
import { Lead, Stage } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface SalesFunnelBoardProps {
  stages: Stage[];
  filteredLeads: Lead[];
  onMoveLead: (leadId: string, fromStageId: string, toStageId: string) => Promise<boolean>;
  onUpdateLead: (lead: Lead) => Promise<boolean>;
  onDeleteLead: (leadId: string) => Promise<boolean>;
  onConvertToContact: (lead: Lead) => Promise<boolean>;
  onArchiveLead: (lead: Lead) => Promise<boolean>;
  onUnarchiveLead: (lead: Lead) => Promise<boolean>;
  onDiscardLead?: (lead: Lead) => Promise<boolean>;
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
  onDiscardLead,
  isArchived 
}: SalesFunnelBoardProps) => {
  const [boardLeads, setBoardLeads] = useState<Lead[]>(filteredLeads);
  const [isDragging, setIsDragging] = useState(false);
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
  const [successLeadId, setSuccessLeadId] = useState<string | null>(null);

  // Update local state when props change
  useEffect(() => {
    console.log("Filtered leads updated:", filteredLeads.length);
    setBoardLeads(filteredLeads);
  }, [filteredLeads]);

  // Clear success indicator after a delay
  useEffect(() => {
    if (successLeadId) {
      const timer = setTimeout(() => {
        setSuccessLeadId(null);
      }, 2000); // Show success indicator for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [successLeadId]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Create an optimistic update handler
  const handleOptimisticLeadMove = (leadId: string, fromStageId: string, toStageId: string) => {
    // Prevent moving in archived view
    if (isArchived) return;
    
    console.log(`Optimistically moving lead ${leadId} from ${fromStageId} to ${toStageId}`);
    
    // Find the lead to be moved
    const leadToMove = boardLeads.find(lead => lead.id === leadId);
    
    if (!leadToMove) {
      console.error("Lead not found for optimistic update");
      return;
    }
    
    // Set this lead as currently saving
    setSavingLeadId(leadId);
    
    // Update the lead's stage in our local state first for instant UI update
    const updatedLeads = boardLeads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, stageId: toStageId };
      }
      return lead;
    });
    
    // Update local state immediately
    setBoardLeads(updatedLeads);
    
    // Then call the parent handler to update backend
    onMoveLead(leadId, fromStageId, toStageId)
      .then(success => {
        if (success) {
          // Show success indicator
          setSuccessLeadId(leadId);
          console.log("Lead move persisted successfully");
        } else {
          console.error("Failed to persist lead move, reverting UI");
          // If the backend update fails, revert the UI change
          setBoardLeads(prevLeads => 
            prevLeads.map(lead => 
              lead.id === leadId ? { ...lead, stageId: fromStageId } : lead
            )
          );
          toast.error("Não foi possível mover o lead. A visualização foi restaurada.");
        }
      })
      .catch(error => {
        console.error("Error persisting lead move:", error);
        // If there's an error, revert the UI change
        setBoardLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === leadId ? { ...lead, stageId: fromStageId } : lead
          )
        );
        toast.error("Erro ao mover lead. A visualização foi restaurada.");
      })
      .finally(() => {
        // Clear the saving state
        setSavingLeadId(null);
      });
  };

  // Handle refreshing the board
  const handleRefresh = () => {
    setBoardLeads(filteredLeads);
  };

  // Calculate total value and count of leads
  const totalValue = boardLeads.reduce((sum, lead) => sum + (lead.proposalValue || 0), 0);
  const totalLeads = boardLeads.length;

  return (
    <div className="space-y-4">
      {/* Board Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2 bg-card p-4 rounded-lg shadow-sm">
        <div>
          <h3 className="text-lg font-medium">
            {isArchived ? "Leads Arquivados" : "Kanban de Leads"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {totalLeads} {totalLeads === 1 ? 'lead' : 'leads'} • Valor total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>
      
      {/* Kanban Board */}
      <div 
        className={`overflow-x-auto pb-4 min-h-[calc(100vh-250px)] transition-opacity ${isDragging ? 'opacity-95' : 'opacity-100'}`}
        onDragOver={handleDragOver}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
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
              onDiscardLead={onDiscardLead}
              isArchived={isArchived}
              savingLeadId={savingLeadId}
              successLeadId={successLeadId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesFunnelBoard;
