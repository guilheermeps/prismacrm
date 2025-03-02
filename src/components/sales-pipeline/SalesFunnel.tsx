import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Filter, Settings } from "lucide-react";
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

// Initial mock data for stages
const initialStages = [
  { id: "1", title: "Novo Lead", color: "#4361ee" },
  { id: "2", title: "Proposta Enviada", color: "#3a86ff" },
  { id: "3", title: "Reunião Agendada", color: "#4cc9f0" },
  { id: "4", title: "Negociação", color: "#4895ef" },
  { id: "5", title: "Fechado (Ganho)", color: "#4cc9f0" },
  { id: "6", title: "Fechado (Perdido)", color: "#ff595e" },
];

// Mock leads data
const initialLeads = [
  {
    id: "l1",
    name: "Maria Silva",
    whatsapp: "5511999887766",
    phone: "11 3322-4455",
    serviceType: "Ensaio Fotográfico",
    proposalValue: 1200,
    notes: "Cliente interessada em ensaio pré-wedding",
    stageId: "1",
    createdAt: new Date().toISOString(),
    history: [
      { 
        action: "created", 
        timestamp: new Date().toISOString(), 
        from: null, 
        to: "Novo Lead"
      }
    ]
  },
  {
    id: "l2",
    name: "João Pereira",
    whatsapp: "5511988776655",
    phone: "",
    serviceType: "Casamento",
    proposalValue: 5000,
    notes: "Casamento marcado para Dezembro 2024",
    stageId: "2",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    history: [
      { 
        action: "created", 
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), 
        from: null, 
        to: "Novo Lead"
      },
      { 
        action: "moved", 
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
        from: "Novo Lead", 
        to: "Proposta Enviada"
      }
    ]
  },
  {
    id: "l3",
    name: "Camila Oliveira",
    whatsapp: "5511977665544",
    phone: "11 2233-4455",
    serviceType: "Evento Corporativo",
    proposalValue: 3500,
    notes: "Evento para 100 pessoas",
    stageId: "3",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    history: [
      { 
        action: "created", 
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
        from: null, 
        to: "Novo Lead"
      },
      { 
        action: "moved", 
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), 
        from: "Novo Lead", 
        to: "Proposta Enviada"
      },
      { 
        action: "moved", 
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
        from: "Proposta Enviada", 
        to: "Reunião Agendada"
      }
    ]
  },
  {
    id: "l4",
    name: "Ricardo Santos",
    whatsapp: "5511966554433",
    phone: "",
    serviceType: "Ensaio Fotográfico",
    proposalValue: 800,
    notes: "Ensaio para LinkedIn",
    stageId: "4",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    history: [
      { 
        action: "created", 
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), 
        from: null, 
        to: "Novo Lead"
      },
      { 
        action: "moved", 
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
        from: "Novo Lead", 
        to: "Proposta Enviada"
      },
      { 
        action: "moved", 
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
        from: "Proposta Enviada", 
        to: "Reunião Agendada"
      },
      { 
        action: "moved", 
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
        from: "Reunião Agendada", 
        to: "Negociação"
      }
    ]
  },
  {
    id: "l5",
    name: "Fernando Lima",
    whatsapp: "5511955443322",
    phone: "11 4455-6677",
    serviceType: "Casamento",
    proposalValue: 6500,
    notes: "Casamento na praia",
    stageId: "5",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    history: [
      { 
        action: "created", 
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), 
        from: null, 
        to: "Novo Lead"
      },
      { 
        action: "moved", 
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), 
        from: "Novo Lead", 
        to: "Proposta Enviada"
      },
      { 
        action: "moved", 
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), 
        from: "Proposta Enviada", 
        to: "Reunião Agendada"
      },
      { 
        action: "moved", 
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
        from: "Reunião Agendada", 
        to: "Negociação"
      },
      { 
        action: "moved", 
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
        from: "Negociação", 
        to: "Fechado (Ganho)"
      }
    ]
  }
];

const SalesFunnel = () => {
  const navigate = useNavigate();
  const [stages, setStages] = useState(initialStages);
  const [leads, setLeads] = useState(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [isEditStageDialogOpen, setIsEditStageDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  // Filter leads by search term
  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewLead = (newLead) => {
    const id = `l${leads.length + 1}`;
    const createdAt = new Date().toISOString();
    
    const stageName = stages.find(stage => stage.id === newLead.stageId)?.title || "Desconhecido";
    
    const leadWithMetadata = {
      ...newLead,
      id,
      createdAt,
      history: [
        {
          action: "created",
          timestamp: createdAt,
          from: null,
          to: stageName
        }
      ]
    };
    
    setLeads([...leads, leadWithMetadata]);
    setIsNewLeadDialogOpen(false);
    toast.success("Lead adicionado com sucesso!");
  };

  const handleMoveLead = (leadId, fromStageId, toStageId) => {
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
        const fromStageName = stages.find(stage => stage.id === fromStageId)?.title || "Desconhecido";
        const toStageName = stages.find(stage => stage.id === toStageId)?.title || "Desconhecido";
        
        return {
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
      }
      return lead;
    });
    
    setLeads(updatedLeads);
  };

  const handleUpdateLead = (updatedLead) => {
    setLeads(leads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
    toast.success("Lead atualizado com sucesso!");
  };

  const handleDeleteLead = (leadId) => {
    setLeads(leads.filter(lead => lead.id !== leadId));
    toast.success("Lead removido com sucesso!");
  };

  const handleAddStage = (newStage) => {
    const id = `${stages.length + 1}`;
    setStages([...stages, { ...newStage, id }]);
    toast.success("Etapa adicionada com sucesso!");
  };

  const handleUpdateStage = (updatedStage) => {
    setStages(stages.map(stage => stage.id === updatedStage.id ? updatedStage : stage));
    setSelectedStage(null);
    setIsEditStageDialogOpen(false);
    toast.success("Etapa atualizada com sucesso!");
  };

  const handleDeleteStage = (stageId) => {
    // Check if there are leads in this stage
    const hasLeadsInStage = leads.some(lead => lead.stageId === stageId);
    
    if (hasLeadsInStage) {
      toast.error("Não é possível excluir uma etapa que contém leads!");
      return;
    }
    
    setStages(stages.filter(stage => stage.id !== stageId));
    setSelectedStage(null);
    setIsEditStageDialogOpen(false);
    toast.success("Etapa removida com sucesso!");
  };

  const openEditStageDialog = (stage) => {
    setSelectedStage(stage);
    setIsEditStageDialogOpen(true);
  };

  const convertToContact = (lead) => {
    // In a real application, this would create a contact in the Contacts module
    
    // You could then move the lead to the "Closed (Won)" stage
    const wonStage = stages.find(stage => stage.title === "Fechado (Ganho)");
    if (wonStage) {
      handleMoveLead(lead.id, lead.stageId, wonStage.id);
    }
  };

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
                    setSelectedStage({ title: "", color: "#4361ee" });
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
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar leads..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesFunnel;
