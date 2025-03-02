import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { validateClientRegistrationToken, updateClientRegistrationFormData, getLeads } from "@/lib/supabase";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const ClientRegistration = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [validationAttempts, setValidationAttempts] = useState(0);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "SP",
    postalCode: "",
    notes: ""
  });

  useEffect(() => {
    // Adicionamos uma verificação com retry para o caso da validação falhar inicialmente
    const validateToken = async () => {
      console.log(`Tentativa ${validationAttempts + 1} de validação do token na página:`, token);
      
      if (!token) {
        console.log("Token não fornecido");
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log("Chamando validateClientRegistrationToken para token:", token);
        const { valid, leadId } = await validateClientRegistrationToken(token);
        
        console.log("Resultado da validação:", { valid, leadId });
        
        if (valid && leadId) {
          setIsValid(true);
          // Tentar buscar informações do lead para pré-preencher o formulário
          const leads = await getLeads();
          const lead = leads.find(l => l.id === leadId);
          
          if (lead) {
            console.log("Lead encontrado:", lead);
            setLeadName(lead.name);
            
            setFormData(prev => ({
              ...prev,
              name: lead.name || "",
              phone: lead.whatsapp || ""
            }));
          } else {
            console.log("Lead não encontrado para ID:", leadId);
          }
        } else {
          console.log("Token inválido ou expirado");
          
          // Se ainda não tentamos muitas vezes e não está válido, tentamos novamente
          if (validationAttempts < 2) {
            setValidationAttempts(prev => prev + 1);
            // Aguarda um pouco antes de tentar novamente
            setTimeout(() => validateToken(), 1000);
            return;
          } else {
            toast.error("Este link não é válido ou já expirou.");
            setIsValid(false);
          }
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
        
        // Se ainda não tentamos muitas vezes, tentamos novamente
        if (validationAttempts < 2) {
          setValidationAttempts(prev => prev + 1);
          // Aguarda um pouco antes de tentar novamente
          setTimeout(() => validateToken(), 1000);
          return;
        } else {
          toast.error("Ocorreu um erro ao validar o link de cadastro.");
          setIsValid(false);
        }
      } finally {
        if (validationAttempts >= 2 || isValid) {
          setIsLoading(false);
        }
      }
    };

    validateToken();
  }, [token, validationAttempts]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) return;
    
    setIsLoading(true);
    
    try {
      const success = await updateClientRegistrationFormData(token, formData);
      
      if (success) {
        setIsSubmitted(true);
        toast.success("Cadastro realizado com sucesso!");
      } else {
        toast.error("Erro ao salvar os dados. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error("Ocorreu um erro ao enviar o formulário.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Carregando...</CardTitle>
            <CardDescription>
              Estamos verificando o seu link de cadastro.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-red-600">Link inválido</CardTitle>
            <CardDescription>
              Este link de cadastro não é válido ou já expirou.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/")}>
              Voltar para a página inicial
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">Cadastro Concluído!</CardTitle>
            <CardDescription className="text-base">
              Obrigado por completar seu cadastro. Entraremos em contato em breve!
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button className="px-8" onClick={() => navigate("/")}>
              Voltar para a página inicial
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Complete seu cadastro</CardTitle>
            {leadName && (
              <CardDescription className="text-base">
                Olá, {leadName}! Por favor, preencha os campos abaixo para completar seu cadastro.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="exemplo@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
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

            <div className="space-y-2">
              <Label htmlFor="street">Endereço</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleChange("street", e.target.value)}
                placeholder="Nome da rua"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  placeholder="123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formData.complement}
                  onChange={(e) => handleChange("complement", e.target.value)}
                  placeholder="Apto 123, Bloco B, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => handleChange("neighborhood", e.target.value)}
                  placeholder="Nome do bairro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">CEP</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  placeholder="00000-000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Inclua qualquer informação adicional que julgar relevante"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Concluir Cadastro"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ClientRegistration;
