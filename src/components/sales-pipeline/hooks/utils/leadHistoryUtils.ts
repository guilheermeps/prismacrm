
import { LeadHistory } from "@/lib/supabase/types";

export const createLeadHistory = (action: string, from: string | null = null, to: string | null = null): LeadHistory => {
  return {
    action,
    timestamp: new Date().toISOString(),
    from,
    to
  };
};

export const addHistoryEntry = (
  existingHistory: LeadHistory[] = [], 
  action: string, 
  from: string | null = null, 
  to: string | null = null
): LeadHistory[] => {
  return [
    ...existingHistory,
    createLeadHistory(action, from, to)
  ];
};
