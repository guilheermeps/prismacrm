
import React from "react";
import LeadCard from "@/components/sales-pipeline/LeadCard";
import { Lead, Stage } from "@/lib/supabase/types";

interface ColumnContentProps {
  leads: Lead[];
  stages: Stage[];
  onMoveLead: (leadId: string, fromStageId: string, toStageId: string) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onConvertToContact: (lead: Lead) => void;
  onArchiveLead?: (lead: Lead) => void;
  onUnarchiveLead?: (lead: Lead) => void;
  onDiscardLead?: (lead: Lead) => void;
  isArchived: boolean;
  savingLeadId?: string | null;
  successLeadId?: string | null;
}

const ColumnContent = ({
  leads,
  stages,
  onMoveLead,
  onUpdateLead,
  onDeleteLead,
  onConvertToContact,
  onArchiveLead,
  onUnarchiveLead,
  onDiscardLead,
  isArchived,
  savingLeadId = null,
  successLeadId = null
}: ColumnContentProps) => {
  return (
    <div className="p-2 flex-1 overflow-y-auto max-h-[calc(100vh-320px)]">
      <div className="space-y-2">
        {leads.length > 0 ? (
          leads.map(lead => (
            <div key={lead.id} data-lead-id={lead.id}>
              <LeadCard
                lead={lead}
                stages={stages}
                onMoveLead={onMoveLead}
                onUpdateLead={onUpdateLead}
                onDeleteLead={onDeleteLead}
                onConvertToContact={onConvertToContact}
                onArchiveLead={onArchiveLead}
                onUnarchiveLead={onUnarchiveLead}
                onDiscardLead={onDiscardLead}
                isArchived={isArchived}
                isSaving={savingLeadId === lead.id}
                isSuccess={successLeadId === lead.id}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm">
            {isArchived 
              ? "Nenhum lead arquivado nesta etapa." 
              : "Nenhum lead nesta etapa. Adicione um novo!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColumnContent;
