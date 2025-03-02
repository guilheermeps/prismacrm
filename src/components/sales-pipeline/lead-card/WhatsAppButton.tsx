
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Check, X } from "lucide-react";
import { Lead } from "@/lib/supabase/types";
import { formatWhatsAppNumber, getWhatsAppUrl } from "@/lib/supabase/leadsService";

interface WhatsAppButtonProps {
  lead: Lead;
  onUpdateLead: (lead: Lead) => void;
}

const WhatsAppButton = ({ lead, onUpdateLead }: WhatsAppButtonProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [whatsapp, setWhatsapp] = useState(lead.whatsapp || '');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = () => {
    setIsEditing(true);
    // Use setTimeout para garantir que o inputRef esteja disponível após a renderização
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleSave = async () => {
    if (!whatsapp.trim()) {
      handleCancel();
      return;
    }

    setIsSaving(true);
    
    try {
      // Remover qualquer formatação e caracteres não numéricos
      const cleanNumber = whatsapp.replace(/\D/g, '');
      
      // Atualizar o lead com o novo número
      const updatedLead = {
        ...lead,
        whatsapp: cleanNumber,
        history: [
          ...lead.history || [],
          {
            action: "updated_whatsapp",
            timestamp: new Date().toISOString(),
            from: lead.whatsapp || null,
            to: cleanNumber
          }
        ]
      };
      
      await onUpdateLead(updatedLead);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar WhatsApp:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setWhatsapp(lead.whatsapp || '');
    setIsEditing(false);
  };

  // Formatar o número para exibição ao sair do modo de edição
  const handleBlur = () => {
    // Não cancelar a edição no blur, apenas formatar o número
    const formatted = formatWhatsAppNumber(whatsapp);
    setWhatsapp(formatted);
  };

  // Abrir WhatsApp em uma nova aba
  const openWhatsApp = () => {
    if (!lead.whatsapp) {
      handleStartEdit();
      return;
    }
    
    const whatsappUrl = getWhatsAppUrl(lead.whatsapp);
    window.open(whatsappUrl, '_blank');
  };

  if (isEditing) {
    return (
      <div className="flex flex-col w-full gap-1">
        <div className="flex items-center gap-1">
          <Input
            ref={inputRef}
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            onBlur={handleBlur}
            placeholder="Insira o WhatsApp..."
            className="h-8 text-xs"
          />
        </div>
        <div className="flex justify-end gap-1">
          <Button 
            onClick={handleCancel} 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6"
            disabled={isSaving}
          >
            <X className="h-3 w-3" />
          </Button>
          <Button 
            onClick={handleSave} 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Check className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 w-full text-xs"
      onClick={openWhatsApp}
    >
      <MessageSquare className="mr-2 h-4 w-4 text-green-500" />
      {lead.whatsapp ? formatWhatsAppNumber(lead.whatsapp) : "Adicionar WhatsApp"}
    </Button>
  );
};

export default WhatsAppButton;
