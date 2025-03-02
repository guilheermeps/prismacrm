import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { updateLead } from "@/lib/supabase/services/leadsCrudService";
import { createContact } from "@/lib/supabase/contactsService";
import { addHistoryEntry } from "./leadHistoryUtils";

// Discard lead
export const discardLead = async (lead: Lead): Promise<boolean> => {
  try {
    const updatedLead = {
      ...lead,
      history: addHistoryEntry(lead.history, "discarded", null, null)
    };
    
    await updateLead(updatedLead);
    
    toast.success("Lead descartado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao descartar lead:", error);
    toast.error("Erro ao descartar lead");
    return false;
  }
};

// Convert lead to contact
export const convertLeadToContact = async (lead: Lead): Promise<boolean> => {
  try {
    console.log(`Converting lead ${lead.id} to contact`);
    
    // Create the contact
    const contactData = {
      name: lead.name,
      whatsapp: lead.whatsapp,
      leadId: lead.id,
      notes: `Converted from lead: ${lead.name}`,
      is_active: true  // Add the missing required field
    };
    
    const contactId = await createContact(contactData);
    
    if (!contactId) {
      toast.error("Erro ao criar contato");
      return false;
    }
    
    // Update lead to mark as converted
    const updatedLead = {
      ...lead,
      history: addHistoryEntry(lead.history, "converted_to_contact", null, contactId)
    };
    
    await updateLead(updatedLead);
    
    toast.success("Lead convertido para contato com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao converter lead:", error);
    toast.error("Erro ao converter lead para contato");
    return false;
  }
};
