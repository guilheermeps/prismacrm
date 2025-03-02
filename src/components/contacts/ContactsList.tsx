
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Phone, 
  Mail,
  Edit,
  Trash,
  FileText,
  UserRound,
  ShoppingCart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Contact, getContacts, deleteContact } from "@/lib/supabase/contactsService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ContactsListProps {
  filterType: "all" | "client" | "supplier";
  onAddContact: () => void;
  onEditContact: (contact: any) => void;
  onCreateOrder?: (contact: any) => void;
  onCreateContract?: (contact: any) => void;
}

const ContactsList = ({ 
  filterType, 
  onAddContact, 
  onEditContact,
  onCreateOrder,
  onCreateContract
}: ContactsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  
  // Use React Query for fetching and caching contacts
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });
  
  // Handle contact deletion
  const handleDeleteContact = async (contactId: string) => {
    try {
      const success = await deleteContact(contactId);
      if (success) {
        toast.success("Contato excluído com sucesso");
        // Invalidate and refetch contacts after deletion
        queryClient.invalidateQueries({ queryKey: ['contacts'] });
      } else {
        toast.error("Erro ao excluir contato");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Erro ao excluir contato");
    }
  };
  
  // Filter contacts based on type and search query
  const filteredContacts = contacts.filter(contact => {
    const matchesType = filterType === "all" || 
                       (filterType === "client" && contact.tags.some(tag => tag.name.toLowerCase() === "cliente")) ||
                       (filterType === "supplier" && contact.tags.some(tag => tag.name.toLowerCase() === "fornecedor"));
    
    const matchesSearch = !searchQuery || 
                          contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.phone?.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  if (isLoading) {
    return <div className="py-8 text-center">Carregando contatos...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">Erro ao carregar contatos</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar contatos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={onAddContact} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo Contato
        </Button>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center py-16 border rounded-md">
          <UserRound className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Nenhum contato encontrado.</p>
          <Button onClick={onAddContact} variant="outline" className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Contato
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cidade/UF</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{contact.phone || contact.whatsapp || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{contact.email || 'N/A'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.tags.map((tag) => (
                      <Badge 
                        key={tag.id} 
                        variant={tag.name.toLowerCase() === "cliente" ? "default" : "secondary"}
                        className="mr-1"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>{contact.city || 'N/A'}/{contact.state || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditContact(contact)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        {onCreateOrder && contact.tags.some(tag => tag.name.toLowerCase() === "cliente") && (
                          <DropdownMenuItem onClick={() => onCreateOrder(contact)}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Criar Pedido
                          </DropdownMenuItem>
                        )}
                        {onCreateContract && contact.tags.some(tag => tag.name.toLowerCase() === "cliente") && (
                          <DropdownMenuItem onClick={() => onCreateContract(contact)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Criar Contrato
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ContactsList;
