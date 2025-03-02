
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { updateLead } from "@/lib/supabase/services/leadsCrudService";
import { createContact } from "@/lib/supabase/contactsService";
import { addHistoryEntry } from "./leadHistoryUtils";

// Discard a lead (mark as not viable/interested)
export const discardLead = async (lead: Lead): Promise<boolean> => {
  try {
    if (!lead || !lead.id) {
      toast.error("Lead inválido");
      return false;
    }
    
    // Create a new history entry for discarding
    const updatedLead = {
      ...lead,
      isArchived: true,
      history: addHistoryEntry(lead.history, "discarded", null, null)
    };
    
    const success = await updateLead(updatedLead);
    
    if (success) {
      toast.success("Lead descartado com sucesso!");
      return true;
    } else {
      throw new Error("Falha ao descartar lead");
    }
  } catch (error) {
    console.error("Erro ao descartar lead:", error);
    toast.error("Erro ao descartar lead");
    return false;
  }
};

// Convert lead to contact
export const convertLeadToContact = async (lead: Lead): Promise<boolean> => {
  try {
    // Create a contact from the lead
    const newContact = {
      name: lead.name,
      whatsapp: lead.whatsapp || "",
      leadId: lead.id,
      notes: lead.notes || ""
    };
    
    // Mark the lead as converted and add to history
    const updatedLead = {
      ...lead,
      isArchived: true,
      // Adding a new action type 'converted' to track conversions specifically
      history: addHistoryEntry(lead.history, "converted", null, null)
    };
    
    await updateLead(updatedLead);
    
    // Create the contact
    const contact = await createContact(newContact);
    
    if (contact) {
      toast.success("Lead convertido para contato com sucesso!");
      return true;
    } else {
      throw new Error("Falha ao converter lead");
    }
  } catch (error) {
    console.error("Erro ao converter lead para contato:", error);
    toast.error("Erro ao converter lead para contato");
    return false;
  }
};
