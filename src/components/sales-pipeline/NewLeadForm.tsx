
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewLeadFormProps {
  onSave: (lead: any) => void;
  onCancel: () => void;
  stages: any[];
  initialStageId?: string;
}

const serviceTypes = [
  "Ensaio Fotográfico",
  "Casamento",
  "Evento Corporativo",
  "Book",
  "Evento Social",
  "Formatura",
  "Aniversário",
  "Outro"
];

const NewLeadForm = ({ onSave, onCancel, stages, initialStageId }: NewLeadFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    serviceType: "",
    proposalValue: "",
    notes: "",
    stageId: initialStageId || stages[0]?.id || ""
  });

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format whatsapp number - remove any non-digit characters
    const formattedWhatsapp = formData.whatsapp.replace(/\D/g, "");
    
    // Convert proposal value to number
    const proposalValue = formData.proposalValue 
      ? parseFloat(formData.proposalValue.replace(/[^\d,.-]/g, "").replace(",", "."))
      : 0;
    
    console.log("Submitting lead data:", {
      ...formData,
      whatsapp: formattedWhatsapp,
      proposalValue
    });
    
    onSave({
      ...formData,
      whatsapp: formattedWhatsapp,
      proposalValue
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Lead *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Nome completo"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp *</Label>
        <Input
          id="whatsapp"
          value={formData.whatsapp}
          onChange={(e) => handleChange("whatsapp", e.target.value)}
          placeholder="Ex: 11999887766"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceType">Tipo de Serviço *</Label>
        <Select
          value={formData.serviceType}
          onValueChange={(value) => handleChange("serviceType", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de serviço" />
          </SelectTrigger>
          <SelectContent>
            {serviceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="proposalValue">Valor da Proposta</Label>
        <Input
          id="proposalValue"
          value={formData.proposalValue}
          onChange={(e) => handleChange("proposalValue", e.target.value)}
          placeholder="Ex: 1500,00"
          type="text"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stage">Etapa do Funil</Label>
        <Select
          value={formData.stageId}
          onValueChange={(value) => handleChange("stageId", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a etapa" />
          </SelectTrigger>
          <SelectContent>
            {stages.map((stage) => (
              <SelectItem key={stage.id} value={stage.id}>
                {stage.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Anotações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Informações importantes, histórico, próximos passos..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Lead
        </Button>
      </div>
    </form>
  );
};

export default NewLeadForm;
