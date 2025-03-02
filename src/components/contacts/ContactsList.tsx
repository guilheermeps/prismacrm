
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash, FileText, FileSignature, Phone } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { getContacts, deleteContact } from "@/lib/supabase/contactsService";
import { Contact } from "@/lib/supabase/contactsService";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatWhatsAppNumber, getWhatsAppUrl } from "@/lib/supabase/leadsService";

interface ContactsListProps {
  filterType: "all" | "client" | "supplier";
  onAddContact: () => void;
  onEditContact: (contact: Contact) => void;
  onCreateOrder: (contact: Contact) => void;
  onCreateContract: (contact: Contact) => void;
}

const ContactsList = ({ 
  filterType, 
  onAddContact, 
  onEditContact,
  onCreateOrder,
  onCreateContract 
}: ContactsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  
  // Fetch contacts using React Query
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
    staleTime: 30000, // Data remains fresh for 30 seconds
  });
  
  // Filter contacts based on search term and type
  const filteredContacts = contacts.filter(contact => {
    // Filter by search term
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by type
    const matchesType = filterType === "all" || 
      (filterType === "client" && hasTags(contact, ["Cliente"])) ||
      (filterType === "supplier" && hasTags(contact, ["Fornecedor"]));
    
    return matchesSearch && matchesType;
  });
  
  // Helper function to check if contact has specific tags
  function hasTags(contact: Contact, tagNames: string[]): boolean {
    if (!contact.tags || contact.tags.length === 0) return false;
    return contact.tags.some(tag => tagNames.includes(tag.name));
  }
  
  // Handle contact deletion
  const handleDeleteContact = async (contact: Contact) => {
    try {
      if (window.confirm(`Tem certeza que deseja excluir o contato ${contact.name}?`)) {
        const success = await deleteContact(contact.id);
        if (success) {
          // Invalidate and refetch contacts
          queryClient.invalidateQueries({ queryKey: ['contacts'] });
          toast.success("Contato excluído com sucesso!");
        } else {
          toast.error("Erro ao excluir contato");
        }
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Erro ao excluir contato");
    }
  };
  
  // Open WhatsApp
  const openWhatsApp = (contact: Contact) => {
    try {
      if (!contact.whatsapp) {
        toast.error("Esse contato não tem número de WhatsApp.");
        return;
      }
      
      const formattedNumber = formatWhatsAppNumber(contact.whatsapp);
      const whatsappUrl = getWhatsAppUrl(formattedNumber);
      
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      toast.error("Erro ao abrir o WhatsApp.");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar contatos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={onAddContact}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Contato
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Cidade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-[100px]" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-[150px]" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-[60px] ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredContacts.length > 0 ? (
              // Actual contacts
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{contact.phone || '-'}</TableCell>
                  <TableCell className="hidden md:table-cell">{contact.email || '-'}</TableCell>
                  <TableCell className="hidden lg:table-cell">{contact.city || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => contact.whatsapp && openWhatsApp(contact)}
                        disabled={!contact.whatsapp}
                        title={contact.whatsapp ? "Abrir WhatsApp" : "Sem WhatsApp"}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditContact(contact)}>
                            Editar Contato
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onCreateOrder(contact)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Criar Pedido
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onCreateContract(contact)}>
                            <FileSignature className="h-4 w-4 mr-2" />
                            Criar Contrato
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteContact(contact)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // No results
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum contato encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContactsList;
