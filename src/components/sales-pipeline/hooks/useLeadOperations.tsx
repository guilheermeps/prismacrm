
import { useState, useEffect, createContext, useContext } from "react";
import { toast } from "sonner";
import { 
  supabase, 
  getLeads,
  createLead as apiCreateLead,
  type Lead
} from "@/lib/supabase";
import { 
  addNewLead, 
  updateLeadData,
  removeLead,
  archiveLead,
  unarchiveLead,
  convertLeadToContact,
  discardLead,
  moveLead
} from "./utils/leadActionHandlers";
import { resetAllLeads } from "./utils/leadBulkOperations";

// Define context type
interface LeadOperationsContextType {
  leads: Lead[];
  loading: boolean;
  handleAddNewLead: (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => Promise<boolean>;
  handleMoveLead: (leadId: string, fromStageId: string, toStageId: string) => Promise<boolean>;
  handleUpdateLead: (updatedLead: Lead) => Promise<boolean>;
  handleDeleteLead: (leadId: string) => Promise<boolean>;
  handleArchiveLead: (lead: Lead) => Promise<boolean>;
  handleUnarchiveLead: (lead: Lead) => Promise<boolean>;
  handleDiscardLead: (lead: Lead) => Promise<boolean>;
  convertToContact: (lead: Lead) => Promise<boolean>;
  handleResetLeads: () => Promise<boolean>;
  refreshLeads: () => Promise<void>;
}

// Create context with default values
const LeadOperationsContext = createContext<LeadOperationsContextType>({
  leads: [],
  loading: true,
  handleAddNewLead: async () => false,
  handleMoveLead: async () => false,
  handleUpdateLead: async () => false,
  handleDeleteLead: async () => false,
  handleArchiveLead: async () => false,
  handleUnarchiveLead: async () => false,
  handleDiscardLead: async () => false,
  convertToContact: async () => false,
  handleResetLeads: async () => false,
  refreshLeads: async () => {}
});

// Provider component
export function LeadOperationsProvider({ children }: { children: React.ReactNode }) {
  const leadOperations = useLeadOperationsInternal();
  
  return (
    <LeadOperationsContext.Provider value={leadOperations}>
      {children}
    </LeadOperationsContext.Provider>
  );
}

// Hook for consuming the context
export function useLeadOperations() {
  return useContext(LeadOperationsContext);
}

// Internal implementation of the hook logic
function useLeadOperationsInternal() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      console.log("Fetching leads to update global state...");
      const leadsData = await getLeads();
      console.log("Fetched leads:", leadsData);
      setLeads(leadsData);
      return leadsData;
    } catch (error) {
      console.error("Erro ao carregar leads:", error);
      toast.error("Erro ao carregar leads. Tente novamente.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    fetchLeads();
    
    // Setup improved real-time subscription with better error handling
    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'leads' 
        }, 
        async (payload) => {
          console.log('Real-time lead update detected:', payload);
          
          // Check the type of change and update state accordingly for better performance
          if (payload.eventType === 'INSERT') {
            // For new leads, just append to the current state
            await fetchLeads(); // Refresh all leads to ensure we have complete data
          } else if (payload.eventType === 'UPDATE') {
            // For updates, replace the specific lead
            await fetchLeads(); // Refresh all leads to ensure we have complete data
          } else if (payload.eventType === 'DELETE') {
            // For deletions, remove the lead
            const deletedLeadId = payload.old.id;
            setLeads(currentLeads => 
              currentLeads.filter(lead => lead.id !== deletedLeadId)
            );
          } else {
            // For any other changes, refresh the whole list
            await fetchLeads();
          }
        })
      .subscribe((status) => {
        console.log(`Supabase real-time subscription status: ${status}`);
        // Fix: Use the correct type comparison
        if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to real-time updates. Retrying...');
          // Auto-retry after a delay
          setTimeout(() => {
            fetchLeads();
          }, 5000);
        }
      });
    
    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up Supabase real-time subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const refreshLeads = async () => {
    setLoading(true);
    await fetchLeads();
  };

  const handleAddNewLead = async (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => {
    try {
      console.log("handleAddNewLead called with:", newLead);
      
      // Ensure all required fields are present
      if (!newLead.name || !newLead.stageId) {
        console.error("Missing required fields for lead creation");
        toast.error("Dados incompletos para criação do lead");
        return false;
      }
      
      console.log("Adding new lead with validated data:", newLead);
      const result = await addNewLead(newLead);
      console.log("Add new lead result:", result);
      
      if (result) {
        toast.success("Lead adicionado com sucesso!");
        await refreshLeads();
        return true;
      } else {
        toast.error("Erro ao adicionar lead");
        return false;
      }
    } catch (error) {
      console.error("Error adding new lead:", error);
      toast.error("Erro ao adicionar lead: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      return false;
    }
  };

  const handleMoveLead = async (leadId: string, fromStageId: string, toStageId: string) => {
    // Find the lead to move from the current state
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) {
      console.error(`Lead ${leadId} not found in current state`);
      toast.error("Erro ao mover lead: não encontrado");
      return false;
    }
    
    console.log(`Moving lead ${leadId} from stage ${fromStageId} to ${toStageId}`);
    
    // Update local state immediately for better UX
    const updatedLeads = leads.map(l => {
      if (l.id === leadId) {
        return { ...l, stageId: toStageId };
      }
      return l;
    });
    
    // Update local state before API call for immediate feedback
    setLeads(updatedLeads);
    
    // Call the move function to update in database
    const result = await moveLead(lead, toStageId);
    
    if (!result) {
      console.error(`Failed to move lead ${leadId} to stage ${toStageId}`);
      // Revert local state if API call fails
      setLeads(leads);
      toast.error("Erro ao mover lead. Tente novamente.");
      return false;
    }
    
    // Refresh all leads to ensure consistency
    await refreshLeads();
    return true;
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    try {
      const result = await updateLeadData(updatedLead);
      if (result) {
        await refreshLeads();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Erro ao atualizar lead");
      return false;
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      const result = await removeLead(leadId);
      if (result) {
        toast.success("Lead removido com sucesso!");
        await refreshLeads();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Erro ao remover lead");
      return false;
    }
  };

  const handleArchiveLead = async (lead: Lead) => {
    const result = await archiveLead(lead);
    if (result) {
      await refreshLeads();
    }
    return result;
  };

  const handleUnarchiveLead = async (lead: Lead) => {
    const result = await unarchiveLead(lead);
    if (result) {
      await refreshLeads();
    }
    return result;
  };

  const handleDiscardLead = async (lead: Lead) => {
    const result = await discardLead(lead);
    if (result) {
      await refreshLeads();
    }
    return result;
  };

  const convertToContact = async (lead: Lead) => {
    const result = await convertLeadToContact(lead);
    if (result) {
      await refreshLeads();
    }
    return result;
  };

  const handleResetLeads = async () => {
    const result = await resetAllLeads();
    if (result) {
      await refreshLeads();
    }
    return result;
  };

  return {
    leads,
    loading,
    handleAddNewLead,
    handleMoveLead,
    handleUpdateLead,
    handleDeleteLead,
    handleArchiveLead,
    handleUnarchiveLead,
    handleDiscardLead,
    convertToContact,
    handleResetLeads,
    refreshLeads
  };
}
