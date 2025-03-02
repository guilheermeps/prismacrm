
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
  source_type?: "order" | "contract";
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
