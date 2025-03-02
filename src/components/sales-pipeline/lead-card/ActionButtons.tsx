
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
  leadName?: string;
}

const ActionButtons = ({ 
  leadId, 
  stageId, 
  stages, 
  onMoveLead, 
  isArchived,
  leadName = ""
}: ActionButtonsProps) => {
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
    </div>
  );
};

export default ActionButtons;
