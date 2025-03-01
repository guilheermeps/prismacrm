
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserCheck, Edit, MessageSquare, Phone } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeadDetailsProps {
  lead: any;
  stages: any[];
  onEdit: () => void;
  onConvertToContact: () => void;
}

const LeadDetails = ({ lead, stages, onEdit, onConvertToContact }: LeadDetailsProps) => {
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
    const whatsappUrl = `https://wa.me/${lead.whatsapp}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    if (lead.phone) {
      window.location.href = `tel:${lead.phone}`;
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

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={handleOpenWhatsApp} className="flex gap-2 bg-green-600 hover:bg-green-700">
          <MessageSquare className="h-4 w-4" />
          WhatsApp
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleCall}
          disabled={!lead.phone}
          className="flex gap-2"
        >
          <Phone className="h-4 w-4" />
          Ligar
        </Button>
      </div>

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
            <p>{lead.whatsapp}</p>
          </div>
          
          {lead.phone && (
            <div>
              <p className="text-muted-foreground">Telefone</p>
              <p>{lead.phone}</p>
            </div>
          )}
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
          {formattedHistory.map((item, index) => (
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
          ))}
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
