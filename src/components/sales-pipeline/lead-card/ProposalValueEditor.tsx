
import React, { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lead } from "@/lib/supabase/types";

interface ProposalValueEditorProps {
  lead: Lead;
  onUpdateLead: (lead: Lead) => void;
  isArchived?: boolean;
}

const ProposalValueEditor: React.FC<ProposalValueEditorProps> = ({ 
  lead, 
  onUpdateLead,
  isArchived = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Formatar o valor inicial
  useEffect(() => {
    if (lead.proposalValue) {
      const formattedValue = formatCurrency(lead.proposalValue);
      setValue(formattedValue);
    }
  }, [lead.proposalValue]);

  useEffect(() => {
    // Focar no input quando começar a editar
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Formatar como moeda brasileira
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Função para converter o valor formatado para número
  const parseCurrency = (value: string): number => {
    // Remover o símbolo de moeda e qualquer caractere não numérico, exceto vírgula e ponto
    const numericValue = value
      .replace(/[^\d,.-]/g, '')
      .replace(',', '.');
    
    return parseFloat(numericValue) || 0;
  };

  // Função para formatar o input enquanto digita
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    
    // Remover qualquer formatação existente
    input = input.replace(/[^\d]/g, '');
    
    // Se não houver nada ou apenas zeros, mostrar R$ 0,00
    if (!input || parseInt(input) === 0) {
      setValue('R$ 0,00');
      return;
    }
    
    // Converter para centavos (inteiro)
    const cents = parseInt(input);
    
    // Formatar como reais (dividir por 100 para obter o valor em reais)
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(cents / 100);
    
    setValue(formattedValue);
  };

  const handleSave = async () => {
    const numericValue = parseCurrency(value);
    
    if (numericValue === lead.proposalValue) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    
    try {
      // Atualizar o lead com o novo valor
      const updatedLead = {
        ...lead,
        proposalValue: numericValue,
        history: [
          ...lead.history || [],
          {
            action: "updated_proposal_value",
            timestamp: new Date().toISOString(),
            from: lead.proposalValue ? lead.proposalValue.toString() : null,
            to: numericValue.toString()
          }
        ]
      };
      
      await onUpdateLead(updatedLead);
    } catch (error) {
      console.error("Erro ao atualizar valor da proposta:", error);
      // Reverter para o valor original em caso de erro
      setValue(lead.proposalValue ? formatCurrency(lead.proposalValue) : '');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setValue(lead.proposalValue ? formatCurrency(lead.proposalValue) : '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col space-y-1">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleValueChange}
          placeholder="R$ 0,00"
          className="text-xs"
          disabled={isSaving}
        />
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
    <div 
      className="text-sm font-medium cursor-pointer hover:underline"
      onClick={() => !isArchived && setIsEditing(true)}
    >
      {lead.proposalValue > 0 
        ? formatCurrency(lead.proposalValue)
        : <span className="text-muted-foreground text-xs">Adicionar valor</span>
      }
    </div>
  );
};

export default ProposalValueEditor;
