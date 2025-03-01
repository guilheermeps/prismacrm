
import React, { useState } from "react";
import {
  Package,
  Edit,
  Trash,
  ShoppingCart,
  Check,
  X
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from "@/components/orders-contracts/ProductForm";

// Mock data para produtos
const mockProducts = [
  {
    id: 1,
    name: "Ensaio com 10 fotos",
    description: "Ensaio fotográfico com entrega de 10 fotos digitais tratadas",
    price: 450,
    category: "photo",
    categoryName: "Ensaio",
    cost: 150,
    availableIndividually: true,
    createdAt: "2023-10-15"
  },
  {
    id: 2,
    name: "Álbum 20x30cm",
    description: "Álbum fotográfico capa dura 20x30cm com 20 páginas",
    price: 350,
    category: "print",
    categoryName: "Impressão",
    cost: 200,
    availableIndividually: true,
    createdAt: "2023-11-03"
  },
  {
    id: 3,
    name: "Cobertura de Evento (4h)",
    description: "Cobertura de evento por 4 horas com entrega de todas as fotos",
    price: 1200,
    category: "event",
    categoryName: "Evento",
    cost: 450,
    availableIndividually: true,
    createdAt: "2023-09-22"
  },
  {
    id: 4,
    name: "Ensaio Pré-Wedding",
    description: "Ensaio pré-wedding completo em locação externa",
    price: 800,
    category: "wedding",
    categoryName: "Casamento",
    cost: 300,
    availableIndividually: false,
    createdAt: "2023-12-05"
  }
];

interface ProductsListProps {
  searchTerm?: string;
  categoryFilter?: string;
}

const ProductsList = ({ searchTerm = "", categoryFilter }: ProductsListProps) => {
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter products based on search term and category
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || categoryFilter === "all" || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Produtos</CardTitle>
        <CardDescription>
          Gerencie os produtos disponíveis para venda individual ou em pacotes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <Package className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead className="text-center">Venda Individual</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.categoryName}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(product.price)}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(product.cost)}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.availableIndividually ? 
                      <Check className="h-5 w-5 mx-auto text-green-500" /> : 
                      <X className="h-5 w-5 mx-auto text-red-500" />
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Dialog for editing products */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <ProductForm 
                initialProduct={editingProduct} 
                onClose={() => setIsEditDialogOpen(false)} 
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProductsList;
