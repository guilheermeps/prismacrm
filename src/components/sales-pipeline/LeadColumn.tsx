
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeadCard from "@/components/sales-pipeline/LeadCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NewLeadForm from "@/components/sales-pipeline/NewLeadForm";
import { toast } from "sonner";
import { Lead, Stage } from "@/lib/supabase/types";

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
  isArchived?: boolean;
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
  isArchived = false
}: LeadColumnProps) => {
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);

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
    e.stopPropagation();
    // Add visual indicator that drop is allowed
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove visual indicator
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual indicator
    setIsDragOver(false);
    
    try {
      // Try to get JSON data first (more reliable)
      let leadId, fromStageId;
      
      try {
        const jsonData = e.dataTransfer.getData("application/json");
        if (jsonData) {
          const data = JSON.parse(jsonData);
          leadId = data.leadId;
          fromStageId = data.stageId;
        }
      } catch (err) {
        console.log("Couldn't parse JSON data, falling back to text data", err);
      }
      
      // Fallback to individual text data
      if (!leadId) leadId = e.dataTransfer.getData("leadId");
      if (!fromStageId) fromStageId = e.dataTransfer.getData("stageId");
      
      console.log("Drop data:", { leadId, fromStageId, toStageId: stage.id });
      
      if (leadId && fromStageId && fromStageId !== stage.id) {
        console.log(`Moving lead ${leadId} from stage ${fromStageId} to stage ${stage.id}`);
        onMoveLead(leadId, fromStageId, stage.id);
      }
    } catch (error) {
      console.error("Erro ao mover lead:", error);
      toast.error("Erro ao mover lead. Tente novamente.");
    }
  };

  // Calculate total value of leads in this stage
  const totalValue = leads.reduce((sum, lead) => sum + (lead.proposalValue || 0), 0);

  return (
    <div 
      className={`flex flex-col rounded-md min-w-[300px] max-w-[300px] transition-colors ${isDragOver ? 'bg-primary/10' : 'bg-secondary/20'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Stage Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: stage.color }} 
          />
          <h3 className="font-medium">{stage.title}</h3>
          <span className="text-sm text-muted-foreground ml-1">
            ({leads.length})
          </span>
        </div>
        
        {!isArchived && (
          <Dialog open={isNewLeadDialogOpen} onOpenChange={setIsNewLeadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Lead em {stage.title}</DialogTitle>
              </DialogHeader>
              <NewLeadForm 
                onSave={handleAddNewLead} 
                stages={allStages}
                initialStageId={stage.id}
                onCancel={() => setIsNewLeadDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Value Summary */}
      {leads.length > 0 && (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          <span className="font-medium">
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(totalValue)}
          </span> em {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
        </div>
      )}

      {/* Leads List */}
      <div className="p-2 flex-1 overflow-y-auto max-h-[calc(100vh-320px)]">
        <div className="space-y-2">
          {leads.length > 0 ? (
            leads.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                stages={allStages}
                onMoveLead={onMoveLead}
                onUpdateLead={onUpdateLead}
                onDeleteLead={onDeleteLead}
                onConvertToContact={onConvertToContact}
                onArchiveLead={onArchiveLead}
                onUnarchiveLead={onUnarchiveLead}
                isArchived={isArchived}
              />
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground text-sm">
              {isArchived 
                ? "Nenhum lead arquivado nesta etapa." 
                : "Nenhum lead nesta etapa. Adicione um novo!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadColumn;
