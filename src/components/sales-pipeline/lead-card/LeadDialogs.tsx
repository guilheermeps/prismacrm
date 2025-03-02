
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LeadForm from "@/components/sales-pipeline/LeadForm";
import LeadDetails from "@/components/sales-pipeline/LeadDetails";
import ConvertToContactForm from "@/components/sales-pipeline/ConvertToContactForm";
import { Lead, Stage } from "@/lib/supabase";

interface LeadDialogsProps {
  lead: Lead;
  stages: Stage[];
  isEditDialogOpen: boolean;
  isDetailsDialogOpen: boolean;
  isConvertDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  setIsDetailsDialogOpen: (open: boolean) => void;
  setIsConvertDialogOpen: (open: boolean) => void;
  onUpdateLead: (lead: Lead) => void;
  onConvertToContact: (lead: Lead) => void;
}

const LeadDialogs = ({
  lead,
  stages,
  isEditDialogOpen,
  isDetailsDialogOpen,
  isConvertDialogOpen,
  setIsEditDialogOpen,
  setIsDetailsDialogOpen,
  setIsConvertDialogOpen,
  onUpdateLead,
  onConvertToContact
}: LeadDialogsProps) => {
  const navigate = useNavigate();

  const handleConvertClick = () => {
    setIsDetailsDialogOpen(false);
    setIsConvertDialogOpen(true);
  };

  const handleConvertSuccess = () => {
    onConvertToContact(lead);
    setIsConvertDialogOpen(false);
    toast.success(`${lead.name} foi convertido em cliente com sucesso!`);
    navigate("/contacts");
  };

  return (
    <>
      {/* Edit Lead Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
          </DialogHeader>
          <LeadForm 
            lead={lead} 
            stages={stages} 
            onSave={(updatedLead) => {
              // Add history entry for edit
              const editedLead = {
                ...updatedLead,
                history: [
                  ...lead.history,
                  {
                    action: "edited",
                    timestamp: new Date().toISOString(),
                    from: null,
                    to: null
                  }
                ]
              };
              onUpdateLead(editedLead);
              setIsEditDialogOpen(false);
            }}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Lead Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
          </DialogHeader>
          <LeadDetails 
            lead={lead} 
            stages={stages}
            onEdit={() => {
              setIsDetailsDialogOpen(false);
              setIsEditDialogOpen(true);
            }}
            onConvertToContact={handleConvertClick}
          />
        </DialogContent>
      </Dialog>
      
      {/* Convert to Contact Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Converter Lead para Cliente</DialogTitle>
          </DialogHeader>
          <ConvertToContactForm 
            lead={lead}
            onClose={() => setIsConvertDialogOpen(false)}
            onSuccess={handleConvertSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadDialogs;
