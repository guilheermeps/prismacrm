
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Stage } from "@/lib/supabase/types";

interface ColumnHeaderProps {
  stage: Stage;
  leadsCount: number;
  isArchived: boolean;
  onAddNewLead: () => void;
}

const ColumnHeader = ({ stage, leadsCount, isArchived, onAddNewLead }: ColumnHeaderProps) => {
  return (
    <div className="p-3 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: stage.color }} 
        />
        <h3 className="font-medium">{stage.title}</h3>
        <span className="text-sm text-muted-foreground ml-1">
          ({leadsCount})
        </span>
      </div>
      
      {!isArchived && (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={onAddNewLead}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </Dialog>
      )}
    </div>
  );
};

export default ColumnHeader;
