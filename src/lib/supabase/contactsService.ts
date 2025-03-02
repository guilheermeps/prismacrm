
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Contact types
export interface ContactTag {
  id: string;
  name: string;
  color: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  lead_id?: string;
  tags: ContactTag[];
}

// Create a new contact
export const createContact = async (contactData: Omit<Contact, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const id = uuidv4();
    
    const { error } = await supabase
      .from('contacts')
      .insert({
        id,
        ...contactData
      });

    if (error) {
      console.error("Error creating contact:", error);
      throw error;
    }

    return id;
  } catch (error) {
    console.error("Error in createContact:", error);
    return null;
  }
};

// Get all contacts
export const getContacts = async (): Promise<Contact[]> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }

    return data as Contact[];
  } catch (error) {
    console.error("Error in getContacts:", error);
    return [];
  }
};

// Get contact by ID
export const getContactById = async (id: string): Promise<Contact | null> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching contact:", error);
      throw error;
    }

    return data as Contact;
  } catch (error) {
    console.error("Error in getContactById:", error);
    return null;
  }
};

// Update a contact
export const updateContact = async (contact: Partial<Contact> & { id: string }): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contacts')
      .update(contact)
      .eq('id', contact.id);

    if (error) {
      console.error("Error updating contact:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in updateContact:", error);
    return false;
  }
};

// Delete a contact
export const deleteContact = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteContact:", error);
    return false;
  }
};

// Get contacts by filter
export const getContactsByFilter = async (
  filter: {
    name?: string;
    is_active?: boolean;
    tag?: string;
  }
): Promise<Contact[]> => {
  try {
    let query = supabase
      .from('contacts')
      .select('*');

    if (filter.name) {
      query = query.ilike('name', `%${filter.name}%`);
    }

    if (filter.is_active !== undefined) {
      query = query.eq('is_active', filter.is_active);
    }

    if (filter.tag) {
      // Since tags are stored as JSONB, we need to check if the array contains the tag
      query = query.contains('tags', [{ name: filter.tag }]);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) {
      console.error("Error fetching filtered contacts:", error);
      throw error;
    }

    return data as Contact[];
  } catch (error) {
    console.error("Error in getContactsByFilter:", error);
    return [];
  }
};

// Get contact by lead ID
export const getContactByLeadId = async (leadId: string): Promise<Contact | null> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('lead_id', leadId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching contact by lead ID:", error);
      throw error;
    }

    return data as Contact;
  } catch (error) {
    console.error("Error in getContactByLeadId:", error);
    return null;
  }
};
