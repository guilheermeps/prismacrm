
import React from "react";
import { MoreHorizontal, Edit, Trash, UserCheck, Archive, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lead } from "@/lib/supabase";

interface LeadActionsProps {
  lead: Lead;
  isArchived: boolean;
  onViewDetails: () => void;
  onEdit: () => void;
  onConvert: () => void;
  onDelete: (leadId: string) => void;
  onArchive?: (lead: Lead) => void;
  onUnarchive?: (lead: Lead) => void;
}

const LeadActions = ({
  lead,
  isArchived,
  onViewDetails,
  onEdit,
  onConvert,
  onDelete,
  onArchive,
  onUnarchive
}: LeadActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onViewDetails}>
          Ver Detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onConvert}>
          <UserCheck className="mr-2 h-4 w-4" />
          Converter para Cliente
        </DropdownMenuItem>
        {!isArchived && onArchive && (
          <DropdownMenuItem onClick={() => onArchive(lead)}>
            <Archive className="mr-2 h-4 w-4" />
            Arquivar
          </DropdownMenuItem>
        )}
        {isArchived && onUnarchive && (
          <DropdownMenuItem onClick={() => onUnarchive(lead)}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reativar
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(lead.id)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LeadActions;
