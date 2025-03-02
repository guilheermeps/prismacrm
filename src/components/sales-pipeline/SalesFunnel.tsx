
import React from "react";
import ActionBar from "@/components/sales-pipeline/actions/ActionBar";
import SalesFunnelBoard from "@/components/sales-pipeline/board/SalesFunnelBoard";
import LoadingState from "@/components/sales-pipeline/LoadingState";
import { useLeadOperations } from "@/components/sales-pipeline/hooks/useLeadOperations";
import { useStageOperations } from "@/components/sales-pipeline/hooks/useStageOperations";
import { filterLeads } from "@/components/sales-pipeline/utils/leadFilters";
import { Lead, Stage } from "@/lib/supabase/types";

interface SalesFunnelProps {
  searchTerm?: string;
  serviceTypeFilter?: string | null;
  dateFilter?: string;
  isArchived?: boolean;
}

const SalesFunnel = ({ 
  searchTerm = "", 
  serviceTypeFilter = null,
  dateFilter = "all",
  isArchived = false 
}: SalesFunnelProps) => {
  // Use our custom hooks
  const { 
    leads, 
    loading: leadsLoading, 
    handleAddNewLead,
    handleMoveLead,
    handleUpdateLead,
    handleDeleteLead,
    handleArchiveLead,
    handleUnarchiveLead,
    handleDiscardLead,
    convertToContact,
    handleResetLeads
  } = useLeadOperations();

  const {
    stages,
    loading: stagesLoading,
    handleAddStage,
    handleUpdateStage,
    handleDeleteStage
  } = useStageOperations();

  // Apply all filters
  const filteredLeads = filterLeads(leads, searchTerm, serviceTypeFilter, dateFilter, isArchived);

  if (leadsLoading || stagesLoading) {
    return <LoadingState />;
  }

  // Create wrapper functions to fix type issues
  const handleAddNewLeadWrapper = async (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => {
    await handleAddNewLead(newLead);
  };

  const handleAddStageWrapper = async (newStage: Omit<Stage, 'id'>) => {
    await handleAddStage(newStage);
  };

  const handleUpdateStageWrapper = async (updatedStage: Stage) => {
    await handleUpdateStage(updatedStage);
  };

  const handleDeleteStageWrapper = async (stageId: string) => {
    await handleDeleteStage(stageId);
  };
  
  const handleResetLeadsWrapper = async () => {
    await handleResetLeads();
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <ActionBar 
          stages={stages} 
          isArchived={isArchived}
          onAddNewLead={handleAddNewLeadWrapper}
          onAddStage={handleAddStageWrapper}
          onUpdateStage={handleUpdateStageWrapper}
          onDeleteStage={handleDeleteStageWrapper}
          onResetLeads={handleResetLeadsWrapper}
        />
      </div>

      {/* Sales Funnel Board */}
      <SalesFunnelBoard 
        stages={stages}
        filteredLeads={filteredLeads}
        onMoveLead={handleMoveLead}
        onUpdateLead={handleUpdateLead}
        onDeleteLead={handleDeleteLead}
        onConvertToContact={convertToContact}
        onArchiveLead={handleArchiveLead}
        onUnarchiveLead={handleUnarchiveLead}
        onDiscardLead={handleDiscardLead}
        isArchived={isArchived}
      />
    </div>
  );
};

export default SalesFunnel;
