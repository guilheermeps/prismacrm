
import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Filter, Settings, Trash2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LeadColumn from "@/components/sales-pipeline/LeadColumn";
import NewLeadForm from "@/components/sales-pipeline/NewLeadForm";
import EditStageForm from "@/components/sales-pipeline/EditStageForm";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
import { 
  supabase, 
  getLeads, 
  getStages, 
  createLead, 
  updateLead, 
  deleteLead, 
  createStage, 
  updateStage, 
  deleteStage,
  type Lead,
  type Stage
} from "@/lib/supabase";

// Initial mock data for stages, used only if no stages are found in Supabase
const initialStages = [
  { id: "1", title: "Novo Lead", color: "#4361ee" },
  { id: "2", title: "Proposta Enviada", color: "#3a86ff" },
  { id: "3", title: "Reunião Agendada", color: "#4cc9f0" },
  { id: "4", title: "Negociação", color: "#4895ef" },
  { id: "5", title: "Fechado (Ganho)", color: "#4cc9f0" },
  { id: "6", title: "Fechado (Perdido)", color: "#ff595e" },
];

interface SalesFunnelProps {
  searchTerm?: string;
  serviceTypeFilter?: string | null;
  dateFilter?: string;
  isArchived?: boolean;
}

const SalesFunnel = ({ 
  searchTerm = "", 
  serviceTypeFilter = null,
  dateFilter = "all",
  isArchived = false 
}: SalesFunnelProps) => {
  const navigate = useNavigate();
  const [stages, setStages] = useState<Stage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [isEditStageDialogOpen, setIsEditStageDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Carregar dados do Supabase ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Buscar estágios
        const stagesData = await getStages();
        
        // Se não houver estágios, inicializar com dados iniciais
        if (stagesData.length === 0) {
          // Criar estágios iniciais no Supabase
          const promises = initialStages.map(stage => 
            supabase.from('stages').insert(stage).select()
          );
          
          await Promise.all(promises);
          
          // Buscar novamente os estágios
          const newStagesData = await getStages();
          setStages(newStagesData);
        } else {
          setStages(stagesData);
        }
        
        // Buscar leads
        const leadsData = await getLeads();
        setLeads(leadsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Configurar inscrição em tempo real para mudanças
    const leadsSubscription = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        // Atualizar os leads quando houver mudanças
        getLeads().then(setLeads);
      })
      .subscribe();
      
    const stagesSubscription = supabase
      .channel('stages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stages' }, (payload) => {
        // Atualizar os estágios quando houver mudanças
        getStages().then(setStages);
      })
      .subscribe();
    
    // Limpar inscrições ao desmontar
    return () => {
      leadsSubscription.unsubscribe();
      stagesSubscription.unsubscribe();
    };
  }, []);

  // Apply all filters
  const filteredLeads = leads.filter(lead => {
    // Filter by search term
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.serviceType && lead.serviceType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.notes && lead.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by service type
    const matchesServiceType = 
      !serviceTypeFilter || 
      lead.serviceType === serviceTypeFilter;
    
    // Filter by archive status
    const matchesArchiveStatus = 
      lead.isArchived === isArchived;
    
    // Filter by date
    let matchesDate = true;
    if (dateFilter !== "all" && lead.createdAt) {
      const createdDate = new Date(lead.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case "today":
          matchesDate = createdDate.toDateString() === now.toDateString();
          break;
        case "week":
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          matchesDate = createdDate >= oneWeekAgo;
          break;
        case "month":
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          matchesDate = createdDate >= oneMonthAgo;
          break;
        case "quarter":
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          matchesDate = createdDate >= threeMonthsAgo;
          break;
      }
    }
    
    return matchesSearch && matchesServiceType && matchesArchiveStatus && matchesDate;
  });

  const handleAddNewLead = async (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => {
    try {
      const createdAt = new Date().toISOString();
      const stageName = stages.find(stage => stage.id === newLead.stageId)?.title || "Desconhecido";
      
      const leadWithMetadata = {
        ...newLead,
        createdAt,
        isArchived: false,
        history: [
          {
            action: "created",
            timestamp: createdAt,
            from: null,
            to: stageName
          }
        ]
      };
      
      const result = await createLead(leadWithMetadata as Omit<Lead, 'id'>);
      
      if (result) {
        setIsNewLeadDialogOpen(false);
        toast.success("Lead adicionado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao adicionar lead:", error);
      toast.error("Erro ao adicionar lead. Tente novamente.");
    }
  };

  const handleMoveLead = async (leadId: string, fromStageId: string, toStageId: string) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      
      if (!lead) return;
      
      const fromStageName = stages.find(stage => stage.id === fromStageId)?.title || "Desconhecido";
      const toStageName = stages.find(stage => stage.id === toStageId)?.title || "Desconhecido";
      
      const updatedLead = {
        ...lead,
        stageId: toStageId,
        history: [
          ...lead.history,
          {
            action: "moved",
            timestamp: new Date().toISOString(),
            from: fromStageName,
            to: toStageName
          }
        ]
      };
      
      await updateLead(updatedLead);
    } catch (error) {
      console.error("Erro ao mover lead:", error);
      toast.error("Erro ao mover lead. Tente novamente.");
    }
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    try {
      await updateLead(updatedLead);
      toast.success("Lead atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
      toast.error("Erro ao atualizar lead. Tente novamente.");
    }
  };

  const handleArchiveLead = async (lead: Lead) => {
    try {
      const updatedLead = {
        ...lead,
        isArchived: true,
        history: [
          ...lead.history,
          {
            action: "archived",
            timestamp: new Date().toISOString(),
            from: null,
            to: null
          }
        ]
      };
      
      await updateLead(updatedLead);
      toast.success("Lead arquivado com sucesso!");
    } catch (error) {
      console.error("Erro ao arquivar lead:", error);
      toast.error("Erro ao arquivar lead. Tente novamente.");
    }
  };

  const handleUnarchiveLead = async (lead: Lead) => {
    try {
      const updatedLead = {
        ...lead,
        isArchived: false,
        history: [
          ...lead.history,
          {
            action: "unarchived",
            timestamp: new Date().toISOString(),
            from: null,
            to: null
          }
        ]
      };
      
      await updateLead(updatedLead);
      toast.success("Lead restaurado com sucesso!");
    } catch (error) {
      console.error("Erro ao restaurar lead:", error);
      toast.error("Erro ao restaurar lead. Tente novamente.");
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      const success = await deleteLead(leadId);
      
      if (success) {
        toast.success("Lead removido com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao remover lead:", error);
      toast.error("Erro ao remover lead. Tente novamente.");
    }
  };

  const handleAddStage = async (newStage: Omit<Stage, 'id'>) => {
    try {
      const result = await createStage(newStage);
      
      if (result) {
        toast.success("Etapa adicionada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao adicionar etapa:", error);
      toast.error("Erro ao adicionar etapa. Tente novamente.");
    }
  };

  const handleUpdateStage = async (updatedStage: Stage) => {
    try {
      const result = await updateStage(updatedStage);
      
      if (result) {
        setSelectedStage(null);
        setIsEditStageDialogOpen(false);
        toast.success("Etapa atualizada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar etapa:", error);
      toast.error("Erro ao atualizar etapa. Tente novamente.");
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    try {
      // Verificar se há leads nesta etapa
      const hasLeadsInStage = leads.some(lead => lead.stageId === stageId);
      
      if (hasLeadsInStage) {
        toast.error("Não é possível excluir uma etapa que contém leads!");
        return;
      }
      
      const success = await deleteStage(stageId);
      
      if (success) {
        setSelectedStage(null);
        setIsEditStageDialogOpen(false);
        toast.success("Etapa removida com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao remover etapa:", error);
      toast.error("Erro ao remover etapa. Tente novamente.");
    }
  };

  const openEditStageDialog = (stage: Stage) => {
    setSelectedStage(stage);
    setIsEditStageDialogOpen(true);
  };

  const convertToContact = async (lead: Lead) => {
    try {
      // Em uma aplicação real, isto criaria um contato no módulo Contatos
      
      // Mover o lead para a etapa "Fechado (Ganho)"
      const wonStage = stages.find(stage => stage.title === "Fechado (Ganho)");
      if (wonStage) {
        await handleMoveLead(lead.id, lead.stageId, wonStage.id);
      }
      
      // Archive the lead after conversion
      const updatedLead = {
        ...lead,
        stageId: wonStage?.id || lead.stageId,
        isArchived: true,
        history: [
          ...lead.history,
          {
            action: "converted",
            timestamp: new Date().toISOString(),
            from: null,
            to: null
          }
        ]
      };
      
      await updateLead(updatedLead);
    } catch (error) {
      console.error("Erro ao converter para contato:", error);
      toast.error("Erro ao converter para contato. Tente novamente.");
    }
  };

  const handleResetLeads = async () => {
    try {
      // Excluir todos os leads
      const { error } = await supabase.from('leads').delete().neq('id', '0');
      
      if (error) {
        throw error;
      }
      
      setIsResetConfirmOpen(false);
      toast.success("Todos os leads foram removidos com sucesso!");
    } catch (error) {
      console.error("Erro ao remover todos os leads:", error);
      toast.error("Erro ao remover todos os leads. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2">Carregando pipeline de vendas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
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
                onSave={handleAddNewLead} 
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
                    onSave={selectedStage && selectedStage.id ? handleUpdateStage : handleAddStage}
                    onDelete={selectedStage && selectedStage.id ? () => handleDeleteStage(selectedStage.id) : null}
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
                <AlertDialogAction onClick={handleResetLeads}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Sales Funnel Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map(stage => (
            <LeadColumn
              key={stage.id}
              stage={stage}
              leads={filteredLeads.filter(lead => lead.stageId === stage.id)}
              allStages={stages}
              onMoveLead={handleMoveLead}
              onUpdateLead={handleUpdateLead}
              onDeleteLead={handleDeleteLead}
              onConvertToContact={convertToContact}
              onArchiveLead={handleArchiveLead}
              onUnarchiveLead={handleUnarchiveLead}
              isArchived={isArchived}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesFunnel;
