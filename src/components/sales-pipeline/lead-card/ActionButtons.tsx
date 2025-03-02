
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stage } from "@/lib/supabase";

interface ActionButtonsProps {
  leadId: string;
  stageId: string;
  stages: Stage[];
  onMoveLead: (leadId: string, fromStageId: string, toStageId: string) => void;
  isArchived: boolean;
}

const ActionButtons = ({ 
  leadId, 
  stageId, 
  stages, 
  onMoveLead, 
  isArchived 
}: ActionButtonsProps) => {
  const currentStageIndex = stages.findIndex(stage => stage.id === stageId);
  const hasNextStage = currentStageIndex < stages.length - 1;
  const hasPreviousStage = currentStageIndex > 0;

  const handleMoveNext = () => {
    if (hasNextStage) {
      const nextStage = stages[currentStageIndex + 1];
      onMoveLead(leadId, stageId, nextStage.id);
    }
  };

  const handleMovePrevious = () => {
    if (hasPreviousStage) {
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
  );
};

export default ActionButtons;
