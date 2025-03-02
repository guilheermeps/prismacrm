
import { Stage } from "@/lib/supabase/types";

// Initial mock data for stages, used only if no stages are found in Supabase
export const initialStages = [
  { id: "1", title: "Novo Lead", color: "#4361ee" },
  { id: "2", title: "Proposta Enviada", color: "#3a86ff" },
  { id: "3", title: "Reunião Agendada", color: "#4cc9f0" },
  { id: "4", title: "Negociação", color: "#4895ef" },
  { id: "5", title: "Fechado (Ganho)", color: "#4cc9f0" },
  { id: "6", title: "Fechado (Perdido)", color: "#ff595e" },
];
