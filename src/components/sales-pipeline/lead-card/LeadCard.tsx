
import React, { useState } from "react";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lead, Stage } from "@/lib/supabase/types";
import { formatWhatsAppNumber, getWhatsAppUrl } from "@/lib/supabase/leadsService";
import { Edit, Trash2, MoreVertical, Phone, Archive, RotateCcw, User, Eye } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import LeadDialogs from "@/components/sales-pipeline/lead-card/LeadDialogs";
import { toast } from "sonner";

interface LeadCardProps {
  lead: Lead;
  stages: Stage[];
  onUpdate: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onConvert: (lead: Lead) => void;
  onArchive?: (lead: Lead) => void;
  onUnarchive?: (lead: Lead) => void;
  onDiscard?: (lead: Lead) => void;
  isArchived?: boolean;
}

const LeadCard = ({
  lead,
  stages,
  onUpdate,
  onDelete,
  onConvert,
  onArchive,
  onUnarchive,
  onDiscard,
  isArchived = false
}: LeadCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, lead: Lead) => {
    // Store the lead information in the drag event
    const leadData = {
      leadId: lead.id,
      stageId: lead.stageId,
      leadObject: JSON.stringify(lead)
    };
    
    e.dataTransfer.setData("application/json", JSON.stringify(leadData));
    e.dataTransfer.effectAllowed = "move";
    
    // Add a visual indicator that the item is being dragged
    const card = e.currentTarget;
    setTimeout(() => {
      card.style.opacity = "0.5";
    }, 0);
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Remove the visual indicator
    e.currentTarget.style.opacity = "1";
  };
  
  const openWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!lead.whatsapp) {
        toast.error("Esse lead não tem número de WhatsApp.");
        return;
      }
      
      const formattedNumber = formatWhatsAppNumber(lead.whatsapp);
      const whatsappUrl = getWhatsAppUrl(formattedNumber);
      
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      toast.error("Erro ao abrir o WhatsApp.");
    }
  };
  
  return (
    <>
      <Card
        className="mb-3 border border-border hover:border-accent-foreground transition-colors cursor-move"
        draggable={!isArchived}
        onDragStart={(e) => handleDragStart(e, lead)}
        onDragEnd={handleDragEnd}
        data-lead-id={lead.id}
      >
        <CardHeader className="p-3 pb-0">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base line-clamp-1 mr-2">{lead.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setIsDetailsDialogOpen(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar lead
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsConvertDialogOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Converter para contato
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isArchived ? (
                  <DropdownMenuItem onClick={() => onUnarchive && onUnarchive(lead)}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Desarquivar lead
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onArchive && onArchive(lead)}>
                    <Archive className="mr-2 h-4 w-4" />
                    Arquivar lead
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir lead
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Badge variant="outline" className="text-xs font-normal">
                {lead.serviceType || "Sem tipo"}
              </Badge>
              {lead.proposalValue > 0 && (
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(lead.proposalValue)}
                </span>
              )}
            </div>
            {lead.notes && lead.notes.length > 0 && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {lead.notes}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between">
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-xs h-8 px-2"
            onClick={openWhatsApp}
            disabled={!lead.whatsapp}
          >
            <Phone className="h-3 w-3 mr-1" />
            WhatsApp
          </Button>
        </CardFooter>
      </Card>

      <LeadDialogs 
        lead={lead}
        stages={stages}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDetailsDialogOpen={isDetailsDialogOpen}
        setIsDetailsDialogOpen={setIsDetailsDialogOpen}
        isConvertDialogOpen={isConvertDialogOpen}
        setIsConvertDialogOpen={setIsConvertDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        onUpdateLead={onUpdate}
        onDeleteLead={onDelete}
        onConvertToContact={onConvert}
      />
    </>
  );
};

export default LeadCard;
