
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stage } from "@/lib/supabase/types";

interface ActionButtonsProps {
  leadId: string;
  stageId: string;
  stages: Stage[];
  onMoveLead: (leadId: string, fromStageId: string, toStageId: string) => void;
  isArchived: boolean;
  disabled?: boolean;
}

const ActionButtons = ({ 
  leadId, 
  stageId, 
  stages, 
  onMoveLead, 
  isArchived,
  disabled = false
}: ActionButtonsProps) => {
  // Precisamos garantir que temos uma lista de estágios válida
  if (!stages || stages.length === 0) return null;
  
  // Encontra o índice do estágio atual
  const currentStageIndex = stages.findIndex(stage => stage.id === stageId);
  
  // Se não conseguirmos localizar o estágio, não renderizamos os botões
  if (currentStageIndex === -1) return null;
  
  const hasNextStage = currentStageIndex < stages.length - 1;
  const hasPreviousStage = currentStageIndex > 0;

  const handleMoveNext = () => {
    if (hasNextStage && !disabled) {
      const nextStage = stages[currentStageIndex + 1];
      onMoveLead(leadId, stageId, nextStage.id);
    }
  };

  const handleMovePrevious = () => {
    if (hasPreviousStage && !disabled) {
      const previousStage = stages[currentStageIndex - 1];
      onMoveLead(leadId, stageId, previousStage.id);
    }
  };

  if (isArchived) {
    return null;
  }

  return (
    <div className="flex justify-between gap-2 pt-1">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleMovePrevious}
        disabled={!hasPreviousStage || disabled}
        className="px-2"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleMoveNext}
        disabled={!hasNextStage || disabled}
        className="px-2"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ActionButtons;
