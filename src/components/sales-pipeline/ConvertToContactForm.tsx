import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

interface ConvertToContactFormProps {
  lead: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ConvertToContactForm = ({ lead, onClose, onSuccess }: ConvertToContactFormProps) => {
  const navigate = useNavigate();
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [registrationLink, setRegistrationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [useExternalForm, setUseExternalForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: lead.name || "",
    email: "",
    phone: lead.whatsapp || "",
    type: "client",
    document: "",
    street: "",
    city: "",
    state: "SP",
    notes: lead.notes || ""
  });

  // Verificar se já existe um link para este lead
  useEffect(() => {
    const checkExistingLink = async () => {
      console.log("Verificando link existente para lead:", lead);
      if (lead && lead.id) {
        try {
          console.log("Buscando link para lead_id:", lead.id);
          const link = await getClientRegistrationLink(lead.id);
          console.log("Resultado da busca de link:", link);
          
          if (link) {
            const fullLink = `${window.location.origin}/register/${link.token}`;
            console.log("Link encontrado, URL completa:", fullLink);
            setRegistrationLink(fullLink);
          } else {
            console.log("Nenhum link encontrado para este lead");
          }
        } catch (error) {
          console.error("Erro ao verificar link existente:", error);
        }
      }
    };
    
    checkExistingLink();
  }, [lead]);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would save the contact to a database
    console.log("Contact saved:", formData);
    
    // Add the contact to mockContacts
    const newContact = {
      id: Date.now().toString(), // Generate a unique ID
      ...formData,
      orders: []
    };
    
    // In a real application, this would call an API
    // For now, we'll modify the mockContacts array directly
    import('@/utils/mockData').then(({ mockContacts }) => {
      mockContacts.push(newContact);
      
      // Navigate to the contacts page
      onSuccess();
      navigate('/contacts');
    });
  };

  const generateLink = async () => {
    console.log("Iniciando geração de link para lead:", lead.id);
    setIsGeneratingLink(true);
    try {
      const result = await generateClientRegistrationLink(lead.id);
      console.log("Resultado da geração de link:", result);
      
      if (result) {
        const fullLink = `${window.location.origin}/register/${result.token}`;
        console.log("Link gerado com sucesso, URL completa:", fullLink);
        setRegistrationLink(fullLink);
        toast.success("Link de cadastro gerado com sucesso!");
      } else {
        console.error("Falha ao gerar link - resultado nulo");
        toast.error("Erro ao gerar link de cadastro.");
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
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={onSuccess}>
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
            <Label htmlFor="document">CPF/CNPJ</Label>
            <Input
              id="document"
              value={formData.document}
              onChange={(e) => handleChange("document", e.target.value)}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
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
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Converter para Cliente
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default ConvertToContactForm;
