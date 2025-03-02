
import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { formatWhatsAppNumber, getWhatsAppUrl } from "@/lib/supabase/leadsService";

interface WhatsAppButtonProps {
  lead: Lead;
  onUpdateLead: (lead: Lead) => void;
}

const WhatsAppButton = ({ lead, onUpdateLead }: WhatsAppButtonProps) => {
  const handleOpenWhatsApp = () => {
    if (!lead.whatsapp) {
      toast.error("Número de WhatsApp não disponível");
      return;
    }
    
    try {
      // Generate WhatsApp URL
      const whatsappUrl = getWhatsAppUrl(lead.whatsapp);
      console.log("Opening WhatsApp URL:", whatsappUrl);
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      // Add to lead history
      const updatedLead = {
        ...lead,
        history: [
          ...lead.history,
          {
            action: "whatsapp_clicked",
            timestamp: new Date().toISOString(),
            from: null,
            to: null
          }
        ]
      };
      
      // Update lead with new history
      onUpdateLead(updatedLead);
      
      toast.success("Abrindo WhatsApp...");
    } catch (error) {
      console.error("Erro ao abrir WhatsApp:", error);
      toast.error("Erro ao abrir WhatsApp. Tente novamente.");
    }
  };

  return (
    <Button 
      onClick={handleOpenWhatsApp} 
      variant="outline" 
      size="sm"
      className="w-full bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
    >
      <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
      WhatsApp
    </Button>
  );
};

export default WhatsAppButton;
