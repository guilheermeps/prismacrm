
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ScheduleEvent {
  id?: string;
  client: string;
  service: string;
  date: string;
  time: string;
  location: string;
  source_id?: string;
  source_type?: "order" | "contract" | "manual";
  notes?: string;
}

export const createScheduleEvent = async (event: ScheduleEvent): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('schedule_events')
      .insert(event)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    toast.success('Evento adicionado à agenda com sucesso');
    return data.id;
  } catch (error: any) {
    console.error('Error creating schedule event:', error.message);
    toast.error('Erro ao adicionar evento à agenda');
    return null;
  }
};

export const getScheduleEvents = async (): Promise<ScheduleEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('schedule_events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Error fetching schedule events:', error.message);
    toast.error('Erro ao buscar eventos da agenda');
    return [];
  }
};

export const updateScheduleEvent = async (id: string, updates: Partial<ScheduleEvent>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('schedule_events')
      .update(updates)
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success('Evento atualizado com sucesso');
    return true;
  } catch (error: any) {
    console.error('Error updating schedule event:', error.message);
    toast.error('Erro ao atualizar evento');
    return false;
  }
};

export const deleteScheduleEvent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('schedule_events')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success('Evento removido com sucesso');
    return true;
  } catch (error: any) {
    console.error('Error deleting schedule event:', error.message);
    toast.error('Erro ao remover evento');
    return false;
  }
};
