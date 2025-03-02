
import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lead } from "@/lib/supabase";

interface WhatsAppButtonProps {
  lead: Lead;
  onUpdateLead: (lead: Lead) => void;
}

const WhatsAppButton = ({ lead, onUpdateLead }: WhatsAppButtonProps) => {
  const openWhatsApp = () => {
    if (!lead.whatsapp) {
      toast.error("Número de WhatsApp não disponível");
      return;
    }
    
    // Format the number properly
    let whatsappNumber = lead.whatsapp;
    // Remove any non-digit characters if they exist
    whatsappNumber = whatsappNumber.replace(/\D/g, '');
    
    // Check if the number starts with country code
    if (!whatsappNumber.startsWith('55') && whatsappNumber.length <= 11) {
      whatsappNumber = '55' + whatsappNumber;
    }
    
    // Construct WhatsApp URL with formatted number
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}`;
    window.open(whatsappUrl, '_blank');
    
    // Add to history
    const updatedLead = {
      ...lead,
      history: [
        ...lead.history,
        {
          action: "whatsapp",
          timestamp: new Date().toISOString(),
          from: null,
          to: null
        }
      ]
    };
    
    onUpdateLead(updatedLead);
    toast.success("Redirecionando para o WhatsApp...");
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
      onClick={openWhatsApp}
    >
      <MessageSquare className="h-4 w-4 mr-1" />
      WhatsApp
    </Button>
  );
};

export default WhatsAppButton;
