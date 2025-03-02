
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  user_id: string;
  created_at: string;
}

const ServiceTypeSettings = () => {
  const { user } = useAuth();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    fetchServiceTypes();
  }, [user]);

  const fetchServiceTypes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_types")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      setServiceTypes(data || []);
    } catch (error: any) {
      toast.error(error.message || "Erro ao carregar tipos de serviço");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingServiceType(null);
    setFormData({
      name: "",
      description: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (serviceType: ServiceType) => {
    setEditingServiceType(serviceType);
    setFormData({
      name: serviceType.name,
      description: serviceType.description || "",
      is_active: serviceType.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.name.trim()) {
      toast.error("O nome do tipo de serviço é obrigatório");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingServiceType) {
        // Update existing service type
        const { error } = await supabase
          .from("service_types")
          .update({
            name: formData.name,
            description: formData.description || null,
            is_active: formData.is_active,
          })
          .eq("id", editingServiceType.id);

        if (error) throw error;
        toast.success("Tipo de serviço atualizado com sucesso!");
      } else {
        // Create new service type
        const { error } = await supabase.from("service_types").insert({
          name: formData.name,
          description: formData.description || null,
          is_active: formData.is_active,
          user_id: user.id,
        });

        if (error) throw error;
        toast.success("Tipo de serviço criado com sucesso!");
      }

      setIsDialogOpen(false);
      fetchServiceTypes();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar tipo de serviço");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (serviceType: ServiceType) => {
    try {
      const { error } = await supabase
        .from("service_types")
        .update({ is_active: !serviceType.is_active })
        .eq("id", serviceType.id);

      if (error) throw error;

      setServiceTypes(
        serviceTypes.map((item) =>
          item.id === serviceType.id ? { ...item, is_active: !item.is_active } : item
        )
      );

      toast.success(
        `Tipo de serviço ${serviceType.is_active ? "desativado" : "ativado"} com sucesso!`
      );
    } catch (error: any) {
      toast.error(error.message || "Erro ao alterar status do tipo de serviço");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este tipo de serviço?")) return;

    try {
      const { error } = await supabase.from("service_types").delete().eq("id", id);

      if (error) throw error;

      setServiceTypes(serviceTypes.filter((item) => item.id !== id));
      toast.success("Tipo de serviço excluído com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir tipo de serviço");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tipos de Serviço</CardTitle>
            <CardDescription>
              Gerencie os tipos de serviço que sua empresa oferece
            </CardDescription>
          </div>
          <Button variant="default" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : serviceTypes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum tipo de serviço cadastrado.</p>
            <p>Clique em "Adicionar" para criar o primeiro.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceTypes.map((serviceType) => (
                  <TableRow key={serviceType.id}>
                    <TableCell className="font-medium">{serviceType.name}</TableCell>
                    <TableCell>{serviceType.description || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Switch
                          checked={serviceType.is_active}
                          onCheckedChange={() => handleToggleActive(serviceType)}
                          aria-label="Toggle active status"
                        />
                        <span className="ml-2 text-sm">
                          {serviceType.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(serviceType)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(serviceType.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingServiceType ? "Editar" : "Adicionar"} Tipo de Serviço
            </DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {editingServiceType ? "editar" : "adicionar"} um tipo
              de serviço.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Ex: Casamento, Ensaio Fotográfico, etc."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  placeholder="Descrição do tipo de serviço"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Ativo</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingServiceType ? "Salvar alterações" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ServiceTypeSettings;
