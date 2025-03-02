
import React, { useState } from "react";
import { 
  Menu, 
  ChevronDown, 
  ChevronLeft, 
  Plus, 
  Filter, 
  BarChart, 
  Search, 
  RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NewLeadForm from "@/components/sales-pipeline/NewLeadForm";
import { Stage, Lead } from "@/lib/supabase/types";
import { Input } from "@/components/ui/input";

interface SalesPipelineMenuProps {
  stages: Stage[];
  isArchived: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddNewLead: (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => Promise<void>;
  onFilterChange?: (filterType: string) => void;
  onViewChange?: (view: string) => void;
  onRefresh?: () => void;
}

const SalesPipelineMenu = ({
  stages,
  isArchived,
  searchTerm,
  onSearchChange,
  onAddNewLead,
  onFilterChange,
  onViewChange,
  onRefresh
}: SalesPipelineMenuProps) => {
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-lg mb-5">
      <div className="p-4">
        {/* Main Menu Bar */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <h2 className="text-xl font-semibold">
              {isArchived ? "Leads Arquivados" : "Pipeline de Vendas"}
            </h2>
            
            {/* Add New Lead Button */}
            <Dialog open={isNewLeadDialogOpen} onOpenChange={setIsNewLeadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Novo Lead</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Lead</DialogTitle>
                </DialogHeader>
                <NewLeadForm 
                  onSave={async (newLead) => {
                    await onAddNewLead(newLead);
                    setIsNewLeadDialogOpen(false);
                  }}
                  stages={stages} 
                  onCancel={() => setIsNewLeadDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
            
            {/* Refresh Button */}
            {onRefresh && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={onRefresh}
                title="Atualizar"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Right Section - Desktop View */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar leads..."
                className="pl-8 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            {/* View Dropdown */}
            {onViewChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    <span>Visualização</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onViewChange('board')}>
                    Quadro Kanban
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewChange('list')}>
                    Lista
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewChange('timeline')}>
                    Linha do Tempo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Filter Dropdown */}
            {onFilterChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filtrar</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onFilterChange('all')}>
                    Todos os Leads
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterChange('recent')}>
                    Leads Recentes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterChange('high-value')}>
                    Alto Valor
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterChange('low-value')}>
                    Baixo Valor
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Expanded Menu */}
        {isMenuOpen && (
          <div className="mt-4 space-y-3 md:hidden border-t pt-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar leads..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            {/* Filter Options */}
            {onFilterChange && (
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => {
                  // Just toggle a simple filter for mobile
                  onFilterChange('all');
                }}
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filtros</span>
                </div>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            {/* View Options */}
            {onViewChange && (
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => {
                  // Toggle between basic views on mobile
                  onViewChange('board');
                }}
              >
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>Visualização</span>
                </div>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPipelineMenu;
