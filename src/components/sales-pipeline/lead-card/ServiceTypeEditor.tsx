
import React, { useState, useRef, useEffect } from "react";
import { Check, X, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Lead } from "@/lib/supabase/types";

// Lista predefinida de tipos de serviço
const DEFAULT_SERVICE_TYPES = [
  "Ensaio Fotográfico",
  "Casamento",
  "Evento Corporativo",
  "Book",
  "Evento Social",
  "Formatura",
  "Aniversário",
  "Outro"
];

interface ServiceTypeEditorProps {
  lead: Lead;
  onUpdateLead: (lead: Lead) => void;
  isArchived?: boolean;
}

const ServiceTypeEditor: React.FC<ServiceTypeEditorProps> = ({ 
  lead, 
  onUpdateLead,
  isArchived = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceType, setServiceType] = useState(lead.serviceType || '');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Combinação de tipos predefinidos com tipos já usados no sistema
  const [allServiceTypes, setAllServiceTypes] = useState<string[]>(DEFAULT_SERVICE_TYPES);

  // Filtrar tipos de serviço baseado na busca
  const filteredServiceTypes = allServiceTypes.filter(type => 
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Quando o componente montar, verificar se o tipo atual não está na lista
    if (lead.serviceType && !allServiceTypes.includes(lead.serviceType)) {
      setAllServiceTypes(prev => [...prev, lead.serviceType!]);
    }
  }, [lead.serviceType]);

  useEffect(() => {
    // Focar no input quando começar a editar
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (serviceType === lead.serviceType) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    
    try {
      // Adicionar o tipo à lista se for novo
      if (serviceType && !allServiceTypes.includes(serviceType)) {
        setAllServiceTypes(prev => [...prev, serviceType]);
      }

      // Atualizar o lead
      const updatedLead = {
        ...lead,
        serviceType,
        history: [
          ...lead.history || [],
          {
            action: "updated_service_type",
            timestamp: new Date().toISOString(),
            from: lead.serviceType || null,
            to: serviceType
          }
        ]
      };
      
      await onUpdateLead(updatedLead);
    } catch (error) {
      console.error("Erro ao atualizar tipo de serviço:", error);
      // Reverter para o valor original em caso de erro
      setServiceType(lead.serviceType || '');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setServiceType(lead.serviceType || '');
    setIsEditing(false);
  };

  const handleSelectType = (type: string) => {
    setServiceType(type);
    setSearchTerm('');
  };

  if (isEditing) {
    return (
      <div className="flex flex-col space-y-1">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative w-full flex items-center">
              <Input
                ref={inputRef}
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="Tipo de serviço"
                className="pr-8 text-xs"
                disabled={isSaving}
              />
              <ChevronDown className="absolute right-2 h-4 w-4 text-muted-foreground" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0" align="start">
            <div className="px-2 pt-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tipo de serviço"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto py-2">
              {filteredServiceTypes.length > 0 ? (
                filteredServiceTypes.map((type) => (
                  <div
                    key={type}
                    className="flex items-center px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                    onClick={() => handleSelectType(type)}
                  >
                    {type}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Nenhum tipo encontrado
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex items-center justify-end space-x-1">
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
    <p 
      className="text-xs text-muted-foreground cursor-pointer hover:underline"
      onClick={() => !isArchived && setIsEditing(true)}
    >
      {lead.serviceType || 'Adicionar tipo de serviço'}
    </p>
  );
};

export default ServiceTypeEditor;
