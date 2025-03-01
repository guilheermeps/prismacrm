
import React, { useState } from "react";
import { Plus, Trash } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Categories for packages
const packageCategories = [
  { id: "photo", name: "Ensaio" },
  { id: "wedding", name: "Casamento" },
  { id: "event", name: "Evento" },
  { id: "print", name: "Impressão" }
];

// Mock products available to add to packages
const availableProducts = [
  { id: 1, name: "Ensaio com 10 fotos", price: 450, category: "photo" },
  { id: 2, name: "Álbum 20x30cm", price: 350, category: "print" },
  { id: 3, name: "Cobertura de Evento (4h)", price: 1200, category: "event" },
  { id: 4, name: "Ensaio Pré-Wedding", price: 800, category: "wedding" },
  { id: 5, name: "Cobertura de Casamento (8h)", price: 3500, category: "wedding" },
  { id: 6, name: "Impressão 15x21cm", price: 30, category: "print" },
  { id: 7, name: "Edição Rápida (24h)", price: 300, category: "event" }
];

interface PackageFormProps {
  initialPackage?: any;
  onClose: () => void;
}

// Interface for package items
interface PackageItem {
  id: number;
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const PackageForm = ({ initialPackage, onClose }: PackageFormProps) => {
  const [name, setName] = useState(initialPackage?.name || "");
  const [description, setDescription] = useState(initialPackage?.description || "");
  const [category, setCategory] = useState(initialPackage?.category || "");
  const [isFixedPrice, setIsFixedPrice] = useState(
    initialPackage?.isFixedPrice !== undefined ? initialPackage?.isFixedPrice : true
  );
  const [price, setPrice] = useState<number>(initialPackage?.price || 0);
  
  // Transform initial products into the format we need
  const initialItems = initialPackage?.products 
    ? initialPackage.products.map((product: any) => ({
        id: Date.now() + Math.random(),
        productId: product.id,
        name: product.name,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        totalPrice: product.quantity * product.unitPrice
      }))
    : [];
  
  const [items, setItems] = useState<PackageItem[]>(initialItems);

  // Add a new item to the package
  const addItem = () => {
    const newItem: PackageItem = {
      id: Date.now(),
      productId: 0,
      name: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    };
    setItems([...items, newItem]);
  };

  // Remove an item from the package
  const removeItem = (itemId: number) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  // Update an item in the package
  const updateItem = (itemId: number, field: string, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // If product ID changed, update the name and unit price
        if (field === 'productId') {
          const product = availableProducts.find(p => p.id === value);
          if (product) {
            updatedItem.name = product.name;
            updatedItem.unitPrice = product.price;
          }
        }
        
        // Recalculate total price if quantity or unit price changed
        if (field === 'productId' || field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
  };

  // Calculate package total based on items
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const packageData = {
      id: initialPackage?.id || Date.now(),
      name,
      description,
      price: isFixedPrice ? price : calculateTotal(),
      category,
      categoryName: packageCategories.find(c => c.id === category)?.name || "",
      products: items.map(item => ({
        id: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      isFixedPrice,
      createdAt: initialPackage?.createdAt || new Date().toISOString().split('T')[0]
    };
    
    console.log("Package data:", packageData);
    
    // Here you would typically save this data to your back-end
    // For now, we'll just close the form
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Pacote</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nome do pacote"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Descrição detalhada do pacote"
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
                {packageCategories.map(category => (
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
            <div className="flex items-center justify-between">
              <Label htmlFor="isFixedPrice">Preço Fixo</Label>
              <Switch 
                id="isFixedPrice" 
                checked={isFixedPrice} 
                onCheckedChange={setIsFixedPrice} 
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Se ativado, o preço do pacote será fixo. Caso contrário, será calculado com base nos produtos incluídos.
            </p>
          </div>
          
          {isFixedPrice && (
            <div className="space-y-2">
              <Label htmlFor="price">Preço do Pacote (R$)</Label>
              <Input 
                id="price" 
                type="number" 
                min="0" 
                step="0.01"
                value={price} 
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} 
                placeholder="0,00"
                required={isFixedPrice}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Valor dos Produtos</Label>
              <span className="text-sm font-medium">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(calculateTotal())}
              </span>
            </div>
          </div>
          
          {isFixedPrice && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Diferença</Label>
                <span className={`text-sm font-medium ${price > calculateTotal() ? 'text-green-600' : price < calculateTotal() ? 'text-red-600' : ''}`}>
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(price - calculateTotal())}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {price > calculateTotal() 
                  ? 'O pacote está com valor acima da soma dos produtos.' 
                  : price < calculateTotal() 
                    ? 'O pacote está com desconto em relação à soma dos produtos.' 
                    : 'O preço do pacote é igual à soma dos produtos.'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Items in Package */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Produtos no Pacote</h3>
        
        {items.length === 0 ? (
          <div className="text-center py-6 border rounded-md border-dashed">
            <p className="text-muted-foreground">Nenhum produto adicionado ao pacote</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="w-24">Qtd</TableHead>
                <TableHead className="w-32">Preço Unit.</TableHead>
                <TableHead className="w-32 text-right">Subtotal</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Select 
                      value={item.productId.toString()} 
                      onValueChange={(value) => updateItem(item.id, 'productId', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProducts.map(product => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name} - {new Intl.NumberFormat('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            }).format(product.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      readOnly={item.productId > 0}
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(item.totalPrice)}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      </div>
      
      {/* Total */}
      <div className="flex justify-end items-center border-t pt-4 mt-4">
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Valor Total do Pacote</div>
          <div className="text-xl font-bold">
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(isFixedPrice ? price : calculateTotal())}
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialPackage ? 'Atualizar Pacote' : 'Salvar Pacote'}
        </Button>
      </div>
    </form>
  );
};

export default PackageForm;
