
import React from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewLeadForm from "@/components/sales-pipeline/NewLeadForm";
import { Lead, Stage } from "@/lib/supabase/types";

interface NewLeadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => void;
  stages: Stage[];
  stageId: string;
  stageTitle: string;
}

const NewLeadDialog = ({
  isOpen,
  onOpenChange,
  onSave,
  stages,
  stageId,
  stageTitle
}: NewLeadDialogProps) => {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Adicionar Lead em {stageTitle}</DialogTitle>
      </DialogHeader>
      <NewLeadForm 
        onSave={onSave} 
        stages={stages}
        initialStageId={stageId}
        onCancel={() => onOpenChange(false)} 
      />
    </DialogContent>
  );
};

export default NewLeadDialog;
