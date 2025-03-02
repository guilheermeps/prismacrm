
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Schedule event types
export interface ScheduleEvent {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
  source_id?: string;
  source_type?: 'order' | 'contract' | 'manual';
  created_at: string;
}

// Create a new schedule event
export const createScheduleEvent = async (eventData: Omit<ScheduleEvent, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const id = uuidv4();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return null;
    }
    
    const { error } = await supabase
      .from('schedule_events')
      .insert({
        id,
        client: eventData.client,
        service: eventData.service,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        notes: eventData.notes,
        source_id: eventData.source_id,
        source_type: eventData.source_type,
        user_id: user.id
      });

    if (error) {
      console.error("Error creating schedule event:", error);
      throw error;
    }

    return id;
  } catch (error) {
    console.error("Error in createScheduleEvent:", error);
    return null;
  }
};

// Get all schedule events
export const getScheduleEvents = async (): Promise<ScheduleEvent[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return [];
    }

    const { data, error } = await supabase
      .from('schedule_events')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (error) {
      console.error("Error fetching schedule events:", error);
      throw error;
    }

    return data as ScheduleEvent[];
  } catch (error) {
    console.error("Error in getScheduleEvents:", error);
    return [];
  }
};

// Get schedule event by ID
export const getScheduleEventById = async (id: string): Promise<ScheduleEvent | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return null;
    }

    const { data, error } = await supabase
      .from('schedule_events')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error("Error fetching schedule event:", error);
      throw error;
    }

    return data as ScheduleEvent;
  } catch (error) {
    console.error("Error in getScheduleEventById:", error);
    return null;
  }
};

// Update a schedule event
export const updateScheduleEvent = async (event: Partial<ScheduleEvent> & { id: string }): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    const { error } = await supabase
      .from('schedule_events')
      .update(event)
      .eq('id', event.id)
      .eq('user_id', user.id);

    if (error) {
      console.error("Error updating schedule event:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in updateScheduleEvent:", error);
    return false;
  }
};

// Delete a schedule event
export const deleteScheduleEvent = async (id: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    const { error } = await supabase
      .from('schedule_events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error("Error deleting schedule event:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteScheduleEvent:", error);
    return false;
  }
};

// rest of file...
