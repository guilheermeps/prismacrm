
import React from "react";
import { ArrowLeft, ArrowRight, ShoppingCart, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stage } from "@/lib/supabase/types";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  leadId: string;
  stageId: string;
  stages: Stage[];
  onMoveLead: (leadId: string, fromStageId: string, toStageId: string) => void;
  isArchived: boolean;
  leadName?: string; // Added to display in links
}

const ActionButtons = ({ 
  leadId, 
  stageId, 
  stages, 
  onMoveLead, 
  isArchived,
  leadName = "" // Default to empty string 
}: ActionButtonsProps) => {
  const navigate = useNavigate();
  
  // Don't show buttons if archived or if stages list is invalid
  if (isArchived || !stages || stages.length === 0) return null;
  
  // Find the index of the current stage
  const currentStageIndex = stages.findIndex(stage => stage.id === stageId);
  
  // If we can't find the current stage, don't render buttons
  if (currentStageIndex === -1) return null;
  
  const hasNextStage = currentStageIndex < stages.length - 1;
  const hasPreviousStage = currentStageIndex > 0;

  const handleMoveNext = () => {
    if (hasNextStage) {
      const nextStage = stages[currentStageIndex + 1];
      console.log(`Moving lead ${leadId} to next stage: ${nextStage.title} (${nextStage.id})`);
      onMoveLead(leadId, stageId, nextStage.id);
    }
  };

  const handleMovePrevious = () => {
    if (hasPreviousStage) {
      const previousStage = stages[currentStageIndex - 1];
      console.log(`Moving lead ${leadId} to previous stage: ${previousStage.title} (${previousStage.id})`);
      onMoveLead(leadId, stageId, previousStage.id);
    }
  };

  const navigateToCreateOrder = () => {
    // Store lead info in sessionStorage for use in OrderForm
    sessionStorage.setItem('createOrderFromLead', JSON.stringify({
      leadId,
      leadName,
      type: 'lead', // Identify the source as a lead
      amount: 0, // Add a default amount of 0 to be updated later
    }));
    navigate('/orders-contracts');
  };

  const navigateToCreateContract = () => {
    // Store lead info in sessionStorage for use in ContractForm
    sessionStorage.setItem('createContractFromLead', JSON.stringify({
      leadId,
      leadName,
      type: 'lead', // Identify the source as a lead
      amount: 0, // Add a default amount of 0 to be updated later
    }));
    navigate('/orders-contracts');
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-2 pt-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleMovePrevious}
          disabled={!hasPreviousStage}
          className={`px-2 ${!hasPreviousStage ? 'opacity-50' : 'hover:bg-primary/10'}`}
          title={hasPreviousStage ? `Mover para ${stages[currentStageIndex - 1].title}` : "Não há estágio anterior"}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleMoveNext}
          disabled={!hasNextStage}
          className={`px-2 ${!hasNextStage ? 'opacity-50' : 'hover:bg-primary/10'}`}
          title={hasNextStage ? `Mover para ${stages[currentStageIndex + 1].title}` : "Não há próximo estágio"}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={navigateToCreateOrder}
          className="text-xs flex-1"
          title="Criar pedido a partir deste lead"
        >
          <ShoppingCart className="h-3 w-3 mr-1" />
          Pedido
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={navigateToCreateContract}
          className="text-xs flex-1"
          title="Criar contrato a partir deste lead"
        >
          <FileText className="h-3 w-3 mr-1" />
          Contrato
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
