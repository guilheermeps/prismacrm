
import React, { useState } from "react";
import { PlusCircle, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import NewLeadForm from "@/components/sales-pipeline/NewLeadForm";
import EditStageForm from "@/components/sales-pipeline/EditStageForm";
import { toast } from "sonner";
import { Stage, Lead } from "@/lib/supabase/types";

interface ActionBarProps {
  stages: Stage[];
  isArchived: boolean;
  onAddNewLead: (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => Promise<void>;
  onAddStage: (newStage: Omit<Stage, 'id'>) => Promise<void>;
  onUpdateStage: (updatedStage: Stage) => Promise<void>;
  onDeleteStage: (stageId: string) => Promise<void>;
  onResetLeads: () => Promise<void>;
}

const ActionBar = ({ 
  stages, 
  isArchived, 
  onAddNewLead, 
  onAddStage, 
  onUpdateStage, 
  onDeleteStage, 
  onResetLeads 
}: ActionBarProps) => {
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [isEditStageDialogOpen, setIsEditStageDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  
  const openEditStageDialog = (stage: Stage) => {
    setSelectedStage(stage);
    setIsEditStageDialogOpen(true);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* New Lead Button */}
      <Dialog open={isNewLeadDialogOpen} onOpenChange={setIsNewLeadDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex gap-2">
            <PlusCircle className="h-4 w-4" />
            Novo Lead
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Lead</DialogTitle>
          </DialogHeader>
          <NewLeadForm 
            onSave={onAddNewLead} 
            stages={stages} 
            onCancel={() => setIsNewLeadDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Manage Stages Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <Settings className="h-4 w-4" />
            Gerenciar Etapas
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Dialog open={isEditStageDialogOpen} onOpenChange={setIsEditStageDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => {
                e.preventDefault();
                setSelectedStage({ title: "", color: "#4361ee" } as Stage);
                setIsEditStageDialogOpen(true);
              }}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Etapa
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>
                  {selectedStage && selectedStage.id ? "Editar Etapa" : "Nova Etapa"}
                </DialogTitle>
              </DialogHeader>
              <EditStageForm
                stage={selectedStage}
                onSave={selectedStage && selectedStage.id ? onUpdateStage : onAddStage}
                onDelete={selectedStage && selectedStage.id ? () => onDeleteStage(selectedStage.id) : null}
                onCancel={() => setIsEditStageDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <DropdownMenuItem className="flex flex-col items-start w-full">
            <div className="font-semibold mb-2">Etapas Existentes:</div>
            <div className="w-full space-y-1">
              {stages.map(stage => (
                <div 
                  key={stage.id}
                  className="flex items-center justify-between w-full p-1 hover:bg-accent rounded cursor-pointer"
                  onClick={() => openEditStageDialog(stage)}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: stage.color }} 
                    />
                    {stage.title}
                  </div>
                </div>
              ))}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reset Leads Button */}
      <AlertDialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex gap-2">
            <Trash2 className="h-4 w-4" />
            Limpar {isArchived ? "Arquivados" : "Leads"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá permanentemente todos os leads {isArchived ? "arquivados" : ""} do pipeline de vendas. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onResetLeads}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionBar;
