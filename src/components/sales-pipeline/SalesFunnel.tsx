
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
    convertToContact,
    handleResetLeads,
    refreshLeads
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

  console.log("Filtered leads:", filteredLeads);
  console.log("Stages:", stages);
  console.log("Loading states - leads:", leadsLoading, "stages:", stagesLoading);

  // Add better error handling and fallback for empty states
  if (leadsLoading || stagesLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <LoadingState />
      </div>
    );
  }

  // Check for valid stages before rendering
  if (!stages || stages.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-card rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Nenhum estágio encontrado</h3>
          <p className="text-muted-foreground">Não foi possível carregar os estágios do pipeline.</p>
        </div>
      </div>
    );
  }

  // Create wrapper functions to fix type issues - converting return types to void
  const handleAddNewLeadWrapper = async (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => {
    console.log("Adding new lead from SalesFunnel:", newLead);
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
    <div className="space-y-4 w-full bg-background">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between w-full">
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
        isArchived={isArchived}
        onRefreshLeads={refreshLeads}
      />
    </div>
  );
};

export default SalesFunnel;
