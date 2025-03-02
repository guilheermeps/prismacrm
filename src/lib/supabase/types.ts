
export interface Lead {
  id: string;
  name: string;
  serviceType: string;
  whatsapp: string;
  stageId: string;
  proposalValue: number;
  notes?: string;
  createdAt: string;
  isArchived?: boolean;
  history: LeadHistory[];
}

export interface LeadHistory {
  action: string;
  timestamp: string;
  from: string | null;
  to: string | null;
}

export interface Stage {
  id: string;
  title: string;
  color: string;
}

export interface ClientRegistrationLink {
  id: string;
  lead_id: string;
  token: string;
  created_at: string;
  expires_at: string;
  is_used: boolean;
  form_data: any;
}
