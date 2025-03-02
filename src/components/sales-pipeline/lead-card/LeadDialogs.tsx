
import React from 'react';
import { Lead, Stage } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export interface LeadDialogsProps {
  lead: Lead;
  stages: Stage[];
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDetailsDialogOpen: boolean;
  setIsDetailsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isConvertDialogOpen: boolean;
  setIsConvertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: (lead: Lead, notes?: string) => void;
  onDelete: (id: string) => void;
  onConvertToContact: (lead: Lead) => void;
}

const LeadDialogs: React.FC<LeadDialogsProps> = ({
  lead,
  stages,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDetailsDialogOpen,
  setIsDetailsDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isConvertDialogOpen,
  setIsConvertDialogOpen,
  onUpdate,
  onDelete,
  onConvertToContact
}) => {
  const [notes, setNotes] = React.useState(lead.notes || '');
  const [newName, setNewName] = React.useState(lead.name);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Edit Dialog
  const handleUpdateLead = async () => {
    setIsUpdating(true);
    const updatedLead = { ...lead, name: newName };
    await onUpdate(updatedLead, notes);
    setIsUpdating(false);
    setIsEditDialogOpen(false);
  };

  // Delete Dialog
  const handleDeleteLead = async () => {
    setIsDeleting(true);
    await onDelete(lead.id);
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  // Convert to Contact Dialog
  const handleConvertToContact = () => {
    onConvertToContact(lead);
    setIsConvertDialogOpen(false);
  };

  return (
    <>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Anotações</Label>
              <Textarea
                id="notes"
                placeholder="Adicione informações relevantes sobre este lead..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateLead} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{lead.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Estágio</h4>
              <p className="text-sm text-muted-foreground">
                {stages.find(s => s.id === lead.stageId)?.title || 'Não definido'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Serviço</h4>
              <p className="text-sm text-muted-foreground">
                {lead.serviceType || 'Não definido'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Valor Proposta</h4>
              <p className="text-sm text-muted-foreground">
                {lead.proposalValue 
                  ? `R$ ${lead.proposalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : 'Não definido'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">WhatsApp</h4>
              <p className="text-sm text-muted-foreground">
                {lead.whatsapp || 'Não definido'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Anotações</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {lead.notes || 'Sem anotações'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o lead <strong>{lead.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLead} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Convert to Contact Dialog */}
      <AlertDialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Converter para Contato</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja converter <strong>{lead.name}</strong> em um contato? O lead será mantido e um novo contato será criado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConvertToContact}>
              Converter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LeadDialogs;
