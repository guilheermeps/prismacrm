
import React, { useState } from "react";
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
  UserRound
} from "lucide-react";
import { mockContacts } from "@/utils/mockData";
import { Badge } from "@/components/ui/badge";

interface ContactsListProps {
  filterType: "all" | "client" | "supplier";
  onAddContact: () => void;
  onEditContact: (contact: any) => void;
}

const ContactsList = ({ filterType, onAddContact, onEditContact }: ContactsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter contacts based on type and search query
  const filteredContacts = mockContacts.filter(contact => {
    const matchesType = filterType === "all" || contact.type === filterType;
    const matchesSearch = !searchQuery || 
                          contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.phone?.includes(searchQuery);
    return matchesType && matchesSearch;
  });

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
                <TableHead>CPF/CNPJ</TableHead>
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
                        <span className="text-sm">{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{contact.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={contact.type === "client" ? "default" : "secondary"}>
                      {contact.type === "client" ? "Cliente" : "Fornecedor"}
                    </Badge>
                  </TableCell>
                  <TableCell>{contact.document}</TableCell>
                  <TableCell>{contact.city}/{contact.state}</TableCell>
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
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Ver Pedidos
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
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
