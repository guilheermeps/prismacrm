
import React, { useState } from "react";
import { 
  Plus,
  Search,
  ShoppingCart 
} from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductsList from "@/components/orders-contracts/ProductsList";
import PackagesList from "@/components/orders-contracts/PackagesList";
import ProductForm from "@/components/orders-contracts/ProductForm";
import PackageForm from "@/components/orders-contracts/PackageForm";

const Products = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isNewPackageOpen, setIsNewPackageOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Produtos</h1>
            
            <Tabs defaultValue="products" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="products">Produtos</TabsTrigger>
                <TabsTrigger value="packages">Pacotes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="products" className="space-y-6">
                {/* Barra de ações para Produtos */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex gap-2">
                          <Plus className="h-4 w-4" />
                          Novo Produto
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Novo Produto</DialogTitle>
                        </DialogHeader>
                        <ProductForm onClose={() => setIsNewProductOpen(false)} />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-full"
                      />
                    </div>
                    
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="photo">Ensaio</SelectItem>
                        <SelectItem value="wedding">Casamento</SelectItem>
                        <SelectItem value="event">Evento</SelectItem>
                        <SelectItem value="print">Impressão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Lista de produtos */}
                <ProductsList 
                  searchTerm={searchTerm}
                  categoryFilter={categoryFilter}
                />
              </TabsContent>
              
              <TabsContent value="packages" className="space-y-6">
                {/* Barra de ações para Pacotes */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Dialog open={isNewPackageOpen} onOpenChange={setIsNewPackageOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Novo Pacote
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Novo Pacote</DialogTitle>
                        </DialogHeader>
                        <PackageForm onClose={() => setIsNewPackageOpen(false)} />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar pacotes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-full"
                      />
                    </div>
                    
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="photo">Ensaio</SelectItem>
                        <SelectItem value="wedding">Casamento</SelectItem>
                        <SelectItem value="event">Evento</SelectItem>
                        <SelectItem value="print">Impressão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Lista de pacotes */}
                <PackagesList 
                  searchTerm={searchTerm}
                  categoryFilter={categoryFilter}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
