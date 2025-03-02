
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { UserCheck, Edit, MessageSquare, Link2, Copy, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { getClientRegistrationLink } from "@/lib/supabase";

interface LeadDetailsProps {
  lead: any;
  stages: any[];
  onEdit: () => void;
  onConvertToContact: () => void;
}

const LeadDetails = ({ lead, stages, onEdit, onConvertToContact }: LeadDetailsProps) => {
  const [registrationLink, setRegistrationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // Verificar se existe um link de registro para este lead
    const checkRegistrationLink = async () => {
      const linkData = await getClientRegistrationLink(lead.id);
      if (linkData) {
        const fullLink = `${window.location.origin}/register/${linkData.token}`;
        setRegistrationLink(fullLink);
      }
    };
    
    checkRegistrationLink();
  }, [lead.id]);
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  const currentStage = stages.find(stage => stage.id === lead.stageId)?.title || "Desconhecido";

  // Format the timestamp in lead history
  const formattedHistory = lead.history ? [...lead.history].reverse().map(item => ({
    ...item,
    formattedTime: formatDate(item.timestamp)
  })) : [];

  const handleOpenWhatsApp = () => {
    if (!lead.whatsapp) {
      toast.error("Número de WhatsApp não disponível");
      return;
    }
    
    // Format the number properly
    let whatsappNumber = lead.whatsapp;
    // Remove any non-digit characters if they exist
    whatsappNumber = whatsappNumber.replace(/\D/g, '');
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const copyToClipboard = () => {
    if (registrationLink) {
      navigator.clipboard.writeText(registrationLink);
      setCopied(true);
      toast.success("Link copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{lead.name}</h3>
            <p className="text-sm text-muted-foreground">{lead.serviceType}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </div>

        {lead.proposalValue > 0 && (
          <div className="text-lg font-medium">
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(lead.proposalValue)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button onClick={handleOpenWhatsApp} className="flex gap-2 bg-green-600 hover:bg-green-700">
          <MessageSquare className="h-4 w-4" />
          WhatsApp
        </Button>
      </div>

      {registrationLink && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Link de Cadastro do Cliente</h4>
            <div className="flex">
              <Input 
                value={registrationLink} 
                readOnly 
                className="flex-1 bg-muted cursor-text text-xs"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="ml-2" 
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Este link pode ser compartilhado com o cliente para que ele complete seu cadastro.
            </p>
          </div>
        </>
      )}

      <Separator />
      
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Informações</h4>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Etapa</p>
            <p>{currentStage}</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Criado em</p>
            <p>{formatDate(lead.createdAt)}</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">WhatsApp</p>
            <p>{lead.whatsapp || "Não informado"}</p>
          </div>
        </div>
      </div>
      
      {lead.notes && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Anotações</h4>
            <p className="text-sm whitespace-pre-line">{lead.notes}</p>
          </div>
        </>
      )}
      
      <Separator />
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Histórico</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
          {formattedHistory.length > 0 ? (
            formattedHistory.map((item, index) => (
              <div key={index} className="border-l-2 pl-3 py-1 border-muted">
                {item.action === "created" ? (
                  <p>
                    <span className="font-medium">Lead criado</span> em {item.formattedTime}
                  </p>
                ) : item.action === "moved" ? (
                  <p>
                    <span className="font-medium">Movido</span> de <span className="italic">{item.from}</span> para <span className="italic">{item.to}</span> em {item.formattedTime}
                  </p>
                ) : (
                  <p>{item.action} - {item.formattedTime}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground italic">Nenhum histórico disponível</p>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="pt-2">
        <Button 
          onClick={onConvertToContact}
          className="w-full"
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Converter para Cliente
        </Button>
      </div>
    </div>
  );
};

export default LeadDetails;
