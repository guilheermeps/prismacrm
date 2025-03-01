
import React, { useState } from "react";
import {
  ShoppingCart,
  Edit,
  Trash,
  Package
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PackageForm from "@/components/orders-contracts/PackageForm";

// Mock data for packages
const mockPackages = [
  {
    id: 1,
    name: "Pacote Premium Casamento",
    description: "Cobertura completa de casamento com álbum e ensaio pré-wedding",
    price: 5500,
    category: "wedding",
    categoryName: "Casamento",
    products: [
      { id: 4, name: "Ensaio Pré-Wedding", quantity: 1, unitPrice: 800 },
      { id: 5, name: "Cobertura de Casamento (8h)", quantity: 1, unitPrice: 3500 },
      { id: 2, name: "Álbum 20x30cm", quantity: 2, unitPrice: 350 }
    ],
    isFixedPrice: true,
    createdAt: "2023-11-10"
  },
  {
    id: 2,
    name: "Pacote Família",
    description: "Ensaio familiar com impressões",
    price: 750,
    category: "photo",
    categoryName: "Ensaio",
    products: [
      { id: 1, name: "Ensaio com 10 fotos", quantity: 1, unitPrice: 450 },
      { id: 6, name: "Impressão 15x21cm", quantity: 10, unitPrice: 30 }
    ],
    isFixedPrice: true,
    createdAt: "2023-12-15"
  },
  {
    id: 3,
    name: "Pacote de Evento Corporativo",
    description: "Cobertura de evento corporativo com entrega digital",
    price: 1500,
    category: "event",
    categoryName: "Evento",
    products: [
      { id: 3, name: "Cobertura de Evento (4h)", quantity: 1, unitPrice: 1200 },
      { id: 7, name: "Edição Rápida (24h)", quantity: 1, unitPrice: 300 }
    ],
    isFixedPrice: false,
    createdAt: "2024-01-05"
  }
];

interface PackagesListProps {
  searchTerm?: string;
  categoryFilter?: string;
}

const PackagesList = ({ searchTerm = "", categoryFilter }: PackagesListProps) => {
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter packages based on search term and category
  const filteredPackages = mockPackages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || categoryFilter === "all" || pkg.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate total products in a package
  const getTotalProducts = (pkg: any) => {
    return pkg.products.reduce((sum: number, item: any) => sum + item.quantity, 0);
  };

  // Calculate total value based on products
  const calculateTotalValue = (pkg: any) => {
    if (pkg.isFixedPrice) return pkg.price;
    
    return pkg.products.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Pacotes</CardTitle>
        <CardDescription>
          Gerencie os pacotes de produtos disponíveis para venda
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredPackages.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Nenhum pacote encontrado</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Preços</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{pkg.name}</div>
                      <div className="text-sm text-muted-foreground">{pkg.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{pkg.categoryName}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{getTotalProducts(pkg)} itens</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(calculateTotalValue(pkg))}
                  </TableCell>
                  <TableCell>
                    <Badge variant={pkg.isFixedPrice ? "default" : "outline"}>
                      {pkg.isFixedPrice ? "Fixo" : "Calculado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(pkg)}>
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

        {/* Dialog for editing packages */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Pacote</DialogTitle>
            </DialogHeader>
            {editingPackage && (
              <PackageForm 
                initialPackage={editingPackage} 
                onClose={() => setIsEditDialogOpen(false)} 
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PackagesList;
