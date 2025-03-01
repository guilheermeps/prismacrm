
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Categories for products
const productCategories = [
  { id: "photo", name: "Ensaio" },
  { id: "wedding", name: "Casamento" },
  { id: "event", name: "Evento" },
  { id: "print", name: "Impressão" }
];

interface ProductFormProps {
  initialProduct?: any;
  onClose: () => void;
}

const ProductForm = ({ initialProduct, onClose }: ProductFormProps) => {
  const [name, setName] = useState(initialProduct?.name || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [price, setPrice] = useState<number>(initialProduct?.price || 0);
  const [cost, setCost] = useState<number>(initialProduct?.cost || 0);
  const [category, setCategory] = useState(initialProduct?.category || "");
  const [availableIndividually, setAvailableIndividually] = useState(
    initialProduct?.availableIndividually !== undefined ? initialProduct?.availableIndividually : true
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      id: initialProduct?.id || Date.now(),
      name,
      description,
      price,
      cost,
      category,
      categoryName: productCategories.find(c => c.id === category)?.name || "",
      availableIndividually,
      createdAt: initialProduct?.createdAt || new Date().toISOString().split('T')[0]
    };
    
    console.log("Product data:", productData);
    
    // Here you would typically save this data to your back-end
    // For now, we'll just close the form
    onClose();
  };

  // Calculate profit margin
  const calculateProfit = () => {
    if (price === 0) return 0;
    return ((price - cost) / price * 100).toFixed(2);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nome do produto"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Descrição detalhada do produto"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Pricing */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input 
              id="price" 
              type="number" 
              min="0" 
              step="0.01"
              value={price} 
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} 
              placeholder="0,00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cost">Custo (R$)</Label>
            <Input 
              id="cost" 
              type="number" 
              min="0" 
              step="0.01"
              value={cost} 
              onChange={(e) => setCost(parseFloat(e.target.value) || 0)} 
              placeholder="0,00"
            />
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Margem de Lucro</span>
              <span className="text-sm font-medium">{calculateProfit()}%</span>
            </div>
            <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500" 
                style={{ width: `${calculateProfit()}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="available">Disponível para Venda Individual</Label>
              <Switch 
                id="available" 
                checked={availableIndividually} 
                onCheckedChange={setAvailableIndividually} 
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Se desativado, este produto só poderá ser vendido como parte de um pacote.
            </p>
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialProduct ? 'Atualizar Produto' : 'Salvar Produto'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
