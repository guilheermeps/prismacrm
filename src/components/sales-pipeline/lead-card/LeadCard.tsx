import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Lead, Stage } from "@/lib/supabase/types";
import WhatsAppButton from "@/components/sales-pipeline/lead-card/WhatsAppButton";
import LeadActions from "@/components/sales-pipeline/lead-card/LeadActions";
import ActionButtons from "@/components/sales-pipeline/lead-card/ActionButtons";
import LeadDialogs from "@/components/sales-pipeline/lead-card/LeadDialogs";
import ServiceTypeEditor from "@/components/sales-pipeline/lead-card/ServiceTypeEditor";
import ProposalValueEditor from "@/components/sales-pipeline/lead-card/ProposalValueEditor";

interface LeadCardProps {
  lead: Lead;
  stages: Stage[];
  onMoveLead: (leadId: string, fromStageId: string, toStageId: string) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onConvertToContact: (lead: Lead) => void;
  onArchiveLead?: (lead: Lead) => void;
  onUnarchiveLead?: (lead: Lead) => void;
  onDiscardLead?: (lead: Lead) => void;
  isArchived?: boolean;
}

const LeadCard = ({
  lead,
  stages,
  onMoveLead,
  onUpdateLead,
  onDeleteLead,
  onConvertToContact,
  onArchiveLead,
  onUnarchiveLead,
  onDiscardLead,
  isArchived = false
}: LeadCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isArchived) {
      e.preventDefault();
      return;
    }
    
    // Set data in dataTransfer with multiple formats for reliability
    const data = {
      leadId: lead.id,
      stageId: lead.stageId,
      leadObject: JSON.stringify(lead) // Add the entire lead object
    };
    
    // Set as JSON for structured data
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    
    // Set individual properties as fallback
    e.dataTransfer.setData("leadId", lead.id);
    e.dataTransfer.setData("stageId", lead.stageId);
    e.dataTransfer.setData("text/plain", lead.name); // For compatibility
    
    e.dataTransfer.effectAllowed = "move";
    
    // Add visual feedback immediately
    setIsDragging(true);
    
    // Log for debugging
    console.log(`Started dragging lead: ${lead.id} from stage: ${lead.stageId}`);
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (isArchived) return;
    
    setIsDragging(false);
    console.log("Drag ended");
  };

  const handleArchiveLead = () => {
    if (onArchiveLead) {
      onArchiveLead(lead);
      toast.success(`Lead ${lead.name} arquivado com sucesso!`);
    }
  };

  const handleUnarchiveLead = () => {
    if (onUnarchiveLead) {
      onUnarchiveLead(lead);
      toast.success(`Lead ${lead.name} reativado com sucesso!`);
    }
  };

  return (
    <>
      <Card 
        className={`${isDragging ? 'opacity-50' : ''} cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all`}
        draggable={!isArchived}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <CardContent className="p-3">
          <div className="space-y-2">
            {/* Lead Header */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-sm line-clamp-1 cursor-pointer hover:text-primary transition-colors" onClick={() => setIsDetailsDialogOpen(true)}>
                  {lead.name}
                </h4>
                {/* Substituir o texto estático pelo editor de tipo de serviço */}
                <ServiceTypeEditor 
                  lead={lead} 
                  onUpdateLead={onUpdateLead} 
                  isArchived={isArchived} 
                />
                {lead.createdAt && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              
              <LeadActions 
                lead={lead}
                isArchived={isArchived}
                onViewDetails={() => setIsDetailsDialogOpen(true)}
                onEdit={() => setIsEditDialogOpen(true)}
                onConvert={() => setIsConvertDialogOpen(true)}
                onDelete={onDeleteLead}
                onArchive={onArchiveLead}
                onUnarchive={onUnarchiveLead}
              />
            </div>
            
            {/* Substituir a exibição do valor por um editor */}
            <ProposalValueEditor 
              lead={lead} 
              onUpdateLead={onUpdateLead} 
              isArchived={isArchived} 
            />
            
            {/* WhatsApp Button */}
            <div className="flex items-center gap-2">
              <WhatsAppButton lead={lead} onUpdateLead={onUpdateLead} />
            </div>
            
            {/* Navigation Buttons */}
            <ActionButtons 
              leadId={lead.id}
              stageId={lead.stageId}
              stages={stages}
              onMoveLead={onMoveLead}
              isArchived={isArchived}
            />
          </div>
        </CardContent>
      </Card>

      <LeadDialogs 
        lead={lead}
        stages={stages}
        isEditDialogOpen={isEditDialogOpen}
        isDetailsDialogOpen={isDetailsDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isConvertDialogOpen={isConvertDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        setIsDetailsDialogOpen={setIsDetailsDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        setIsConvertDialogOpen={setIsConvertDialogOpen}
        onUpdate={onUpdateLead}
        onDelete={onDeleteLead}
        onConvertToContact={onConvertToContact}
      />
    </>
  );
};

export default LeadCard;
