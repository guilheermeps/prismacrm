
import { useState, useEffect, createContext, useContext } from "react";
import { toast } from "sonner";
import { 
  supabase, 
  getLeads,
  type Lead
} from "@/lib/supabase";
import { 
  addNewLead, 
  moveLead,
  updateLeadData,
  removeLead,
  archiveLead,
  unarchiveLead,
  convertLeadToContact,
  discardLead
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
      const leadsData = await getLeads();
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
    
    // Setup real-time subscription
    const leadsSubscription = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, async (payload) => {
        console.log('Real-time lead update detected:', payload);
        // Refresh leads when changes are detected
        const updatedLeads = await fetchLeads();
        setLeads(updatedLeads);
      })
      .subscribe();
    
    // Cleanup subscription on unmount
    return () => {
      leadsSubscription.unsubscribe();
    };
  }, []);

  const refreshLeads = async () => {
    setLoading(true);
    await fetchLeads();
  };

  const handleAddNewLead = async (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => {
    const result = await addNewLead(newLead);
    if (result) {
      await refreshLeads();
    }
    return result;
  };

  const handleMoveLead = async (leadId: string, fromStageId: string, toStageId: string) => {
    const lead = leads.find(l => l.id === leadId);
    const result = await moveLead(lead, toStageId);
    if (result) {
      await refreshLeads();
    }
    return result;
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    const result = await updateLeadData(updatedLead);
    if (result) {
      await refreshLeads();
    }
    return result;
  };

  const handleDeleteLead = async (leadId: string) => {
    const result = await removeLead(leadId);
    if (result) {
      await refreshLeads();
    }
    return result;
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
