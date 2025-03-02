
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Link2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { generateClientRegistrationLink, getClientRegistrationLink } from "@/lib/supabase";
import { Contact, createContact, updateContact } from "@/lib/supabase/contactsService";
import { useQueryClient } from "@tanstack/react-query";

// Ensure we have the correct props for ContactForm
// We need to add an onSuccess prop to be called after successful operation

interface ContactFormProps {
  onClose: () => void;
  initialContact?: Contact | null;
  onSuccess?: () => void;  // Add this prop
}

const ContactForm = (props: ContactFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [registrationLink, setRegistrationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [useExternalForm, setUseExternalForm] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Contact, 'id' | 'created_at'>>({
    name: props.initialContact?.name || "",
    email: props.initialContact?.email || "",
    phone: props.initialContact?.phone || "",
    whatsapp: props.initialContact?.whatsapp || "",
    address: props.initialContact?.address || "",
    city: props.initialContact?.city || "",
    state: props.initialContact?.state || "SP",
    postal_code: props.initialContact?.postal_code || "",
    notes: props.initialContact?.notes || "",
    is_active: props.initialContact?.is_active || true,
    lead_id: props.initialContact?.lead_id || "",
    tags: props.initialContact?.tags || []
  });

  // Verificar se já existe um link para este lead
  useEffect(() => {
    const checkExistingLink = async () => {
      console.log("Verificando link existente para lead:", props.initialContact);
      if (props.initialContact && props.initialContact.lead_id) {
        try {
          console.log("Buscando link para lead_id:", props.initialContact.lead_id);
          const link = await getClientRegistrationLink(props.initialContact.lead_id);
          console.log("Resultado da busca de link:", link);
          
          if (link) {
            // Certifica-se de que estamos usando o protocolo correto (http/https)
            const protocol = window.location.protocol;
            const hostname = window.location.host; // inclui host e porta
            const fullLink = `${protocol}//${hostname}/register/${link.token}`;
            
            console.log("Link encontrado, URL completa:", fullLink);
            setRegistrationLink(fullLink);
            // Automaticamente selecionar a opção de formulário externo se já existe um link
            setUseExternalForm(true);
          } else {
            console.log("Nenhum link encontrado para este lead");
          }
        } catch (error) {
          console.error("Erro ao verificar link existente:", error);
        }
      }
    };
    
    if (props.initialContact?.lead_id) {
      checkExistingLink();
    }
  }, [props.initialContact]);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (props.initialContact) {
        // Update existing contact
        const updatedContact = {
          id: props.initialContact.id,
          ...formData
        };
        const success = await updateContact(updatedContact);
        if (success) {
          toast.success("Contato atualizado com sucesso!");
          if (props.onSuccess) {
            props.onSuccess();
          }
        } else {
          toast.error("Erro ao atualizar contato");
        }
      } else {
        // Create new contact
        const newContact = {
          ...formData
        };
        const contactId = await createContact(newContact);
        if (contactId) {
          toast.success("Contato criado com sucesso!");
          if (props.onSuccess) {
            props.onSuccess();
          }
        } else {
          toast.error("Erro ao criar contato");
        }
      }
      
      props.onClose();
      
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Erro ao salvar contato");
    }
  };

  const generateLink = async () => {
    console.log("Iniciando geração de link para lead:", props.initialContact?.lead_id);
    setIsGeneratingLink(true);
    try {
      // Forçar a regeneração do link (mesmo se já existir um)
      if (props.initialContact?.lead_id) {
        const result = await generateClientRegistrationLink(props.initialContact.lead_id);
        console.log("Resultado da geração de link:", result);
        
        if (result) {
          // Certifica-se de que estamos usando o protocolo correto (http/https)
          const protocol = window.location.protocol;
          const hostname = window.location.host; // inclui host e porta
          const fullLink = `${protocol}//${hostname}/register/${result.token}`;
          
          console.log("Link gerado com sucesso, URL completa:", fullLink);
          setRegistrationLink(fullLink);
          toast.success("Link de cadastro gerado com sucesso!");
        } else {
          console.error("Falha ao gerar link - resultado nulo");
          toast.error("Erro ao gerar link de cadastro.");
        }
      } else {
        toast.error("Lead ID não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao gerar link:", error);
      toast.error("Erro ao gerar link de cadastro.");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = () => {
    if (registrationLink) {
      navigator.clipboard.writeText(registrationLink);
      setCopied(true);
      toast.success("Link copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openRegistrationLink = () => {
    if (registrationLink) {
      // Abrir em uma nova aba
      window.open(registrationLink, '_blank', 'noopener,noreferrer');
      toast.success("Formulário aberto em nova aba!");
    } else {
      toast.error("Não foi possível abrir o formulário.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="useExternalForm" 
          checked={useExternalForm}
          onCheckedChange={(checked) => setUseExternalForm(checked as boolean)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label 
            htmlFor="useExternalForm" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Usar formulário externo
          </Label>
          <p className="text-sm text-muted-foreground">
            Gerar um link para que o cliente preencha seus dados
          </p>
        </div>
      </div>

      {useExternalForm ? (
        <div className="space-y-4 rounded-md border p-4">
          <div className="text-sm">
            <p>Ao gerar um link, você poderá compartilhá-lo com o cliente para que ele preencha seus próprios dados.</p>
            <p className="mt-1 text-muted-foreground">O link será válido por 7 dias.</p>
          </div>
          
          {registrationLink ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Link para compartilhar com o cliente:</Label>
                <div className="flex">
                  <Input 
                    value={registrationLink} 
                    readOnly 
                    className="flex-1 bg-muted cursor-text"
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline" 
                    className="ml-2" 
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="button" 
                onClick={openRegistrationLink} 
                className="w-full"
                variant="secondary"
              >
                Abrir formulário em nova aba
              </Button>
              
              <Button 
                type="button" 
                onClick={generateLink} 
                disabled={isGeneratingLink}
                className="w-full"
                variant="outline"
              >
                {isGeneratingLink ? "Regenerando..." : "Regenerar Link"}
              </Button>
            </div>
          ) : (
            <Button 
              type="button" 
              onClick={generateLink} 
              disabled={isGeneratingLink}
              className="w-full"
            >
              <Link2 className="mr-2 h-4 w-4" />
              {isGeneratingLink ? "Gerando..." : "Gerar Link de Cadastro"}
            </Button>
          )}
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={props.onClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={props.onSuccess}>
              Concluir
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nome do contato"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp/Telefone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp || ""}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Rua, número, complemento"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postal_code">CEP</Label>
            <Input
              id="postal_code"
              value={formData.postal_code || ""}
              onChange={(e) => handleChange("postal_code", e.target.value)}
              placeholder="00000-000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Observações sobre o contato"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Nome da cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Select 
                value={formData.state} 
                onValueChange={(value) => handleChange("state", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC">Acre</SelectItem>
                  <SelectItem value="AL">Alagoas</SelectItem>
                  <SelectItem value="AP">Amapá</SelectItem>
                  <SelectItem value="AM">Amazonas</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="CE">Ceará</SelectItem>
                  <SelectItem value="DF">Distrito Federal</SelectItem>
                  <SelectItem value="ES">Espírito Santo</SelectItem>
                  <SelectItem value="GO">Goiás</SelectItem>
                  <SelectItem value="MA">Maranhão</SelectItem>
                  <SelectItem value="MT">Mato Grosso</SelectItem>
                  <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="PA">Pará</SelectItem>
                  <SelectItem value="PB">Paraíba</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="PE">Pernambuco</SelectItem>
                  <SelectItem value="PI">Piauí</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="RO">Rondônia</SelectItem>
                  <SelectItem value="RR">Roraima</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="SE">Sergipe</SelectItem>
                  <SelectItem value="TO">Tocantins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={props.onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Contato
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default ContactForm;
