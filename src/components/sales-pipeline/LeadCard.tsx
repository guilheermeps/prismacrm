
import React, { useState } from "react";
import { MoreHorizontal, Edit, Trash, ArrowRight, ArrowLeft, UserCheck, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LeadForm from "@/components/sales-pipeline/LeadForm";
import LeadDetails from "@/components/sales-pipeline/LeadDetails";
import ConvertToContactForm from "@/components/sales-pipeline/ConvertToContactForm";
import { toast } from "sonner";

interface LeadCardProps {
  lead: any;
  stages: any[];
  onMoveLead: (leadId: string, fromStageId: string, toStageId: string) => void;
  onUpdateLead: (lead: any) => void;
  onDeleteLead: (leadId: string) => void;
  onConvertToContact: (lead: any) => void;
}

const LeadCard = ({
  lead,
  stages,
  onMoveLead,
  onUpdateLead,
  onDeleteLead,
  onConvertToContact
}: LeadCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);

  const currentStageIndex = stages.findIndex(stage => stage.id === lead.stageId);
  const hasNextStage = currentStageIndex < stages.length - 1;
  const hasPreviousStage = currentStageIndex > 0;

  const handleMoveNext = () => {
    if (hasNextStage) {
      const nextStage = stages[currentStageIndex + 1];
      onMoveLead(lead.id, lead.stageId, nextStage.id);
    }
  };

  const handleMovePrevious = () => {
    if (hasPreviousStage) {
      const previousStage = stages[currentStageIndex - 1];
      onMoveLead(lead.id, lead.stageId, previousStage.id);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("leadId", lead.id);
    e.dataTransfer.setData("stageId", lead.stageId);
    e.dataTransfer.effectAllowed = "move";
  };

  const openWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${lead.whatsapp}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleConvertClick = () => {
    setIsDetailsDialogOpen(false);
    setIsConvertDialogOpen(true);
  };

  const handleConvertSuccess = () => {
    onConvertToContact(lead);
    setIsConvertDialogOpen(false);
    toast.success(`${lead.name} foi convertido em cliente com sucesso!`);
  };

  return (
    <>
      <Card 
        className="cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
        draggable
        onDragStart={handleDragStart}
      >
        <CardContent className="p-3">
          <div className="space-y-2">
            {/* Lead Header */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-sm line-clamp-1" onClick={() => setIsDetailsDialogOpen(true)}>
                  {lead.name}
                </h4>
                <p className="text-xs text-muted-foreground">{lead.serviceType}</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsDetailsDialogOpen(true)}>
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsConvertDialogOpen(true)}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Converter para Cliente
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDeleteLead(lead.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Lead Value */}
            {lead.proposalValue && (
              <div className="text-sm font-medium">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL'
                }).format(lead.proposalValue)}
              </div>
            )}
            
            {/* WhatsApp Button */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={openWhatsApp}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between gap-2 pt-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMovePrevious}
                disabled={!hasPreviousStage}
                className="px-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMoveNext}
                disabled={!hasNextStage}
                className="px-2"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Lead Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
          </DialogHeader>
          <LeadForm 
            lead={lead} 
            stages={stages} 
            onSave={(updatedLead) => {
              onUpdateLead(updatedLead);
              setIsEditDialogOpen(false);
            }}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Lead Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
          </DialogHeader>
          <LeadDetails 
            lead={lead} 
            stages={stages}
            onEdit={() => {
              setIsDetailsDialogOpen(false);
              setIsEditDialogOpen(true);
            }}
            onConvertToContact={handleConvertClick}
          />
        </DialogContent>
      </Dialog>
      
      {/* Convert to Contact Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Converter Lead para Cliente</DialogTitle>
          </DialogHeader>
          <ConvertToContactForm 
            lead={lead}
            onClose={() => setIsConvertDialogOpen(false)}
            onSuccess={handleConvertSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadCard;
