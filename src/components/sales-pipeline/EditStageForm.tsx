
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditStageFormProps {
  stage: any;
  onSave: (stage: any) => void;
  onDelete: (() => void) | null;
  onCancel: () => void;
}

const EditStageForm = ({ stage, onSave, onDelete, onCancel }: EditStageFormProps) => {
  const [formData, setFormData] = useState({
    id: stage?.id || "",
    title: stage?.title || "",
    color: stage?.color || "#4361ee"
  });

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Nome da Etapa</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ex: Novo Lead"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Cor</Label>
        <div className="flex gap-2">
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-16 h-9 p-1"
          />
          <Input
            value={formData.color}
            onChange={(e) => handleChange("color", e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <div>
          {onDelete && (
            <Button 
              variant="destructive" 
              type="button" 
              onClick={onDelete}
            >
              Excluir
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {stage?.id ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditStageForm;
