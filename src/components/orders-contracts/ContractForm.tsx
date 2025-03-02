import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, FileText, Upload, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

// Mock data para clientes, pedidos e templates
const mockClients = [
  { id: 1, name: "João Silva" },
  { id: 2, name: "Maria Oliveira" },
  { id: 3, name: "Carlos Santos" },
  { id: 4, name: "Ana Pereira" }
];

const mockOrders = [
  { id: 1, clientId: 1, title: "Website para Loja Virtual", total: 3500 },
  { id: 2, clientId: 2, title: "Identidade Visual", total: 2200 },
  { id: 3, clientId: 3, title: "Automação de Marketing", total: 4800 },
  { id: 4, clientId: 4, title: "Consulta SEO", total: 1200 }
];

const mockTemplates = [
  { id: 1, name: "Contrato de Prestação de Serviços" },
  { id: 2, name: "Contrato de Desenvolvimento de Software" },
  { id: 3, name: "Acordo de Confidencialidade" },
  { id: 4, name: "Contrato de Venda de Produtos" }
];

interface Attachment {
  id: number;
  name: string;
  type: string;
  size: number;
}

interface ContractFormProps { 
  onClose: () => void;
  initialContract?: any | null;
  initialLead?: { leadId: string; leadName: string } | null;
}

const ContractForm = ({ 
  onClose,
  initialContract = null,
  initialLead = null
}: ContractFormProps) => {
  const [contractTab, setContractTab] = useState("basic");
  const [clientId, setClientId] = useState(initialContract?.clientId || "");
  const [orderId, setOrderId] = useState(initialContract?.orderId || "");
  const [contractDate, setContractDate] = useState<Date | undefined>(
    initialContract?.contractDate ? new Date(initialContract.contractDate) : new Date()
  );
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    initialContract?.expirationDate ? new Date(initialContract.expirationDate) : undefined
  );
  const [templateId, setTemplateId] = useState(initialContract?.templateId || "");
  const [status, setStatus] = useState(initialContract?.status || "draft");
  const [title, setTitle] = useState(initialContract?.title || "");
  const [description, setDescription] = useState(initialContract?.description || "");
  const [contractText, setContractText] = useState(initialContract?.contractText || "");
  const [attachments, setAttachments] = useState<Attachment[]>(initialContract?.attachments || []);

  // Initialize form with lead data if available
  useEffect(() => {
    if (initialLead) {
      console.log("Initializing contract form with lead data:", initialLead);
      
      // In a real app, you would fetch the contact ID associated with this lead
      // For demo purposes, we're just setting the description
      if (initialLead.leadName) {
        setDescription(`Contrato criado a partir do lead: ${initialLead.leadName}`);
        setTitle(`Contrato - ${initialLead.leadName}`);
      }
      
      // You might also want to set other fields based on the lead data
    }
  }, [initialLead]);

  // Função para carregar dados do pedido quando selecionado
  const loadOrderData = (newOrderId: string) => {
    if (!newOrderId) return;
    
    const selectedOrder = mockOrders.find(order => order.id.toString() === newOrderId);
    if (selectedOrder) {
      setClientId(selectedOrder.clientId.toString());
      setTitle(selectedOrder.title);
    }
  };

  // Adicionar um anexo
  const addAttachment = (file: File) => {
    const newAttachment: Attachment = {
      id: Date.now(),
      name: file.name,
      type: file.type,
      size: file.size
    };
    setAttachments([...attachments, newAttachment]);
  };

  // Remover um anexo
  const removeAttachment = (attachmentId: number) => {
    setAttachments(attachments.filter(a => a.id !== attachmentId));
  };

  // Simular upload de arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        addAttachment(files[i]);
      }
    }
    // Reset input value to allow uploading the same file again
    e.target.value = "";
  };

  // Carregar template
  const loadTemplate = (templateId: string) => {
    if (templateId === "1") {
      setContractText(`CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: [Nome do Cliente], inscrito no CPF/CNPJ sob o nº [CPF/CNPJ], com sede/residência em [Endereço].

CONTRATADO: [Sua Empresa], inscrita no CNPJ sob o nº [CNPJ], com sede em [Endereço].

As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.

CLÁUSULA PRIMEIRA - DO OBJETO DO CONTRATO
O presente contrato tem como objeto a prestação de serviços de [descrição detalhada dos serviços].

CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES DA CONTRATADA
A CONTRATADA se obriga a:
- Executar os serviços conforme especificações do projeto;
- Cumprir rigorosamente os prazos estabelecidos;
- Manter sigilo sobre todas as informações recebidas da CONTRATANTE;
- [Outras obrigações específicas].

CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DA CONTRATANTE
A CONTRATANTE se obriga a:
- Fornecer todas as informações necessárias para execução dos serviços;
- Efetuar os pagamentos nas condições estabelecidas;
- [Outras obrigações específicas].

CLÁUSULA QUARTA - DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO
Pela prestação do serviço, a CONTRATANTE pagará à CONTRATADA o valor total de R$ [Valor], a ser pago da seguinte forma:
[Descrever parcelamento e datas]

CLÁUSULA QUINTA - DO PRAZO
O presente contrato terá início em [Data de Início] e término em [Data de Término], podendo ser prorrogado mediante acordo entre as partes.

CLÁUSULA SEXTA - DA RESCISÃO
O presente instrumento poderá ser rescindido por qualquer das partes, mediante notificação expressa, com antecedência mínima de 30 dias.

CLÁUSULA SÉTIMA - DO FORO
Para dirimir quaisquer controvérsias oriundas do presente contrato, as partes elegem o foro da comarca de [Cidade/Estado].

E, por estarem assim justos e contratados, firmam o presente instrumento, em duas vias de igual teor.

[Local e Data]

_______________________________
CONTRATANTE

_______________________________
CONTRATADA`);
    } else if (templateId === "2") {
      setContractText(`CONTRATO DE DESENVOLVIMENTO DE SOFTWARE

CONTRATANTE: [Nome do Cliente], inscrito no CPF/CNPJ sob o nº [CPF/CNPJ], com sede/residência em [Endereço].

CONTRATADO: [Sua Empresa], inscrita no CNPJ sob o nº [CNPJ], com sede em [Endereço].

Pelo presente instrumento particular, as partes têm, entre si, justo e acertado o presente Contrato de Desenvolvimento de Software, mediante as cláusulas e condições seguintes:

CLÁUSULA PRIMEIRA - DO OBJETO
O presente contrato tem por objeto o desenvolvimento de software com as seguintes características:
- [Descrição detalhada do software]
- [Funcionalidades esperadas]
- [Tecnologias utilizadas]

CLÁUSULA SEGUNDA - DAS ETAPAS DE DESENVOLVIMENTO
O desenvolvimento do software será realizado nas seguintes etapas:
1. Levantamento de requisitos
2. Elaboração do projeto
3. Desenvolvimento
4. Testes
5. Implantação
6. Treinamento

CLÁUSULA TERCEIRA - DOS PRAZOS
O prazo para conclusão do desenvolvimento é de [Prazo] dias a contar da data de assinatura deste contrato, conforme cronograma abaixo:
- [Detalhamento dos prazos para cada etapa]

CLÁUSULA QUARTA - DO VALOR E FORMA DE PAGAMENTO
Pela execução dos serviços, a CONTRATANTE pagará à CONTRATADA o valor total de R$ [Valor], a ser pago da seguinte forma:
[Descrever parcelamento e datas]

CLÁUSULA QUINTA - DA PROPRIEDADE INTELECTUAL
Após a quitação integral dos valores contratados, os direitos de propriedade intelectual relativos ao software desenvolvido serão transferidos à CONTRATANTE, resguardando-se à CONTRATADA o direito de mencionar em seu portfólio o desenvolvimento realizado.

CLÁUSULA SEXTA - DO SIGILO E CONFIDENCIALIDADE
As partes se comprometem a manter sigilo sobre todas as informações trocadas durante o desenvolvimento do projeto.

CLÁUSULA SÉTIMA - DAS GARANTIAS
A CONTRATADA fornecerá garantia de [Prazo] meses para correção de bugs e falhas identificadas após a entrega do software.

CLÁUSULA OITAVA - DO FORO
Para dirimir quaisquer controvérsias oriundas do presente contrato, as partes elegem o foro da comarca de [Cidade/Estado].

E, por estarem assim justos e contratados, firmam o presente instrumento, em duas vias de igual teor.

[Local e Data]

_______________________________
CONTRATANTE

_______________________________
CONTRATADA`);
    }
  };

  // Salvar contrato
  const handleSave = () => {
    const contractData = {
      clientId,
      orderId,
      contractDate,
      expirationDate,
      templateId,
      status,
      title,
      description,
      contractText,
      attachments,
      // New field for linking to lead
      leadId: initialLead?.leadId || null,
    };
    
    console.log("Contract saved:", contractData);
    
    // In a real app, you would update the lead history to reflect that a contract was created
    if (initialLead?.leadId) {
      // Import the renamed function
      import('@/lib/supabase/leadsService')
        .then(({ updateLeadForTransactionCreation }) => {
          // We don't have the full lead object here, but in a real app you would
          // fetch it or pass it through from the lead card
          const dummyLead = {
            id: initialLead.leadId,
            name: initialLead.leadName,
            stageId: '',
            history: [],
            createdAt: new Date().toISOString()
          } as any;
          
          updateLeadForTransactionCreation(dummyLead, 'contract')
            .then(() => console.log("Lead updated with contract creation"))
            .catch(err => console.error("Error updating lead:", err));
        });
    }
    
    onClose();
  };

  return (
    <div className="space-y-6">
      <Tabs value={contractTab} onValueChange={setContractTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="content">Conteúdo do Contrato</TabsTrigger>
          <TabsTrigger value="attachments">Anexos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Contrato</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título do contrato"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients.map(client => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="order">Pedido Vinculado</Label>
                <Select 
                  value={orderId} 
                  onValueChange={(newOrderId) => {
                    setOrderId(newOrderId);
                    loadOrderData(newOrderId);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vincular a um pedido (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {mockOrders.map(order => (
                      <SelectItem key={order.id} value={order.id.toString()}>
                        {order.title} - R$ {order.total.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descrição do contrato"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Data do Contrato</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {contractDate ? format(contractDate, "dd/MM/yyyy") : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={contractDate}
                      onSelect={setContractDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Data de Expiração</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expirationDate ? format(expirationDate, "dd/MM/yyyy") : "Selecione uma data (opcional)"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expirationDate}
                      onSelect={setExpirationDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status do contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Em Elaboração</SelectItem>
                    <SelectItem value="pending-signature">Aguardando Assinatura</SelectItem>
                    <SelectItem value="signed">Assinado</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template">Modelo de Contrato</Label>
              <Select 
                value={templateId} 
                onValueChange={(newTemplateId) => {
                  setTemplateId(newTemplateId);
                  loadTemplate(newTemplateId);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Personalizado</SelectItem>
                  {mockTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Texto do Contrato</Label>
              <Textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Digite ou cole o texto do contrato aqui"
                rows={16}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="attachments" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Anexos do Contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {attachments.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum anexo adicionado ao contrato
                </p>
              ) : (
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div 
                      key={attachment.id}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6">
                <div className="text-center space-y-2">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Arraste arquivos ou clique para selecionar</p>
                    <p className="text-xs text-muted-foreground">Suporta PDF, DOCX, JPG, PNG</p>
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                    Selecionar Arquivos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botões de ação */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Salvar Contrato
        </Button>
      </div>
    </div>
  );
};

export default ContractForm;
