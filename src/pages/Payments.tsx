
import { useState, useEffect } from 'react';
import { Check, CreditCard, DollarSign, Filter, Plus, Search, Trash2, WalletCards, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { upcomingPayments } from '@/utils/mockData';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import NegotiationCard from '@/components/dashboard/NegotiationCard';

// Define payment type
type PaymentType = 'receivable' | 'payable';
type PaymentStatus = 'pending' | 'completed';

// Extended payment interface
interface Payment {
  id: number;
  client: string;
  service: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  type: PaymentType;
  category?: string;
}

// Extended category interface
interface Category {
  id: number;
  name: string;
  type: PaymentType;
}

const Payments = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [payments, setPayments] = useState<Payment[]>(upcomingPayments as Payment[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    type: 'receivable'
  });
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Casamento', type: 'receivable' },
    { id: 2, name: 'Formatura', type: 'receivable' },
    { id: 3, name: 'Gestante', type: 'receivable' },
    { id: 4, name: '15 anos', type: 'receivable' },
    { id: 5, name: 'Despesa Fixa', type: 'payable' },
    { id: 6, name: 'Material', type: 'payable' },
  ]);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    client: '',
    service: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    type: 'receivable',
    category: ''
  });
  const [clients, setClients] = useState<string[]>([
    'Ana Carolina', 'Marcos Silva', 'Juliana Santos', 'Pedro Oliveira', 
    'Carla Mendes', 'Aluguel Estúdio', 'Fornecedor Álbuns', 'Energia Elétrica'
  ]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Initialize payments with categories from existing data
  useEffect(() => {
    const updatedPayments = upcomingPayments.map(payment => ({
      ...payment,
      category: payment.service
    }));
    setPayments(updatedPayments as Payment[]);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleCompletePayment = (id: number) => {
    setPayments(
      payments.map(payment => 
        payment.id === id ? { ...payment, status: payment.status === 'completed' ? 'pending' : 'completed' } : payment
      )
    );
    
    const payment = payments.find(p => p.id === id);
    
    if (payment) {
      toast({
        title: payment.status === 'completed' ? "Pagamento desmarcado" : "Pagamento confirmado",
        description: payment.status === 'completed' 
          ? `O pagamento de ${payment.client} foi marcado como pendente`
          : `O pagamento de ${payment.client} foi marcado como concluído`,
      });
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.type) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const id = Math.max(...categories.map(c => c.id), 0) + 1;
    const completeCategory = {
      ...newCategory,
      id,
    } as Category;

    setCategories([...categories, completeCategory]);
    
    toast({
      title: "Categoria adicionada",
      description: `${completeCategory.name} foi adicionada com sucesso.`,
    });

    // Reset form and close dialog
    setNewCategory({
      name: '',
      type: 'receivable'
    });
    setIsCategoryDialogOpen(false);
  };

  const handleDeleteCategory = (id: number) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if (!categoryToDelete) return;

    // Check if category is being used in any payment
    const isUsed = payments.some(p => p.category === categoryToDelete.name);
    if (isUsed) {
      toast({
        title: "Não é possível excluir",
        description: "Esta categoria está sendo usada em um ou mais pagamentos.",
        variant: "destructive",
      });
      return;
    }

    setCategories(categories.filter(c => c.id !== id));
    toast({
      title: "Categoria removida",
      description: `${categoryToDelete.name} foi removida com sucesso.`,
    });
  };

  const handleAddNewPayment = () => {
    if (!newPayment.client || !newPayment.category || !newPayment.amount || !newPayment.dueDate) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const id = Math.max(...payments.map(p => p.id), 0) + 1;
    const completePayment = {
      ...newPayment,
      id,
      service: newPayment.category,
      amount: Number(newPayment.amount),
      status: 'pending' as PaymentStatus,
    } as Payment;

    setPayments([...payments, completePayment]);
    
    toast({
      title: newPayment.type === 'receivable' ? "Conta a receber adicionada" : "Conta a pagar adicionada",
      description: `${newPayment.client} - ${newPayment.category} (R$ ${Number(newPayment.amount).toLocaleString()})`,
    });

    // Add client to list if it doesn't exist
    if (!clients.includes(newPayment.client!)) {
      setClients([...clients, newPayment.client!]);
    }

    // Reset form and close dialog
    setNewPayment({
      client: '',
      service: '',
      category: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      type: 'receivable'
    });
    setIsAddDialogOpen(false);
  };
  
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If we have an active filter from dashboard card, apply it
    if (activeFilter) {
      switch (activeFilter) {
        case 'receivable-pending':
          return matchesSearch && payment.type === 'receivable' && payment.status === 'pending';
        case 'receivable-completed':
          return matchesSearch && payment.type === 'receivable' && payment.status === 'completed';
        case 'payable-pending':
          return matchesSearch && payment.type === 'payable' && payment.status === 'pending';
        case 'payable-completed':
          return matchesSearch && payment.type === 'payable' && payment.status === 'completed';
        default:
          return matchesSearch;
      }
    }
    
    return matchesSearch;
  });

  // Calculate financial summary
  const financialSummary = {
    receivable: {
      pending: {
        total: payments
          .filter(p => p.type === 'receivable' && p.status === 'pending')
          .reduce((sum, p) => sum + p.amount, 0),
        count: payments.filter(p => p.type === 'receivable' && p.status === 'pending').length
      },
      completed: {
        total: payments
          .filter(p => p.type === 'receivable' && p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0),
        count: payments.filter(p => p.type === 'receivable' && p.status === 'completed').length
      }
    },
    payable: {
      pending: {
        total: payments
          .filter(p => p.type === 'payable' && p.status === 'pending')
          .reduce((sum, p) => sum + p.amount, 0),
        count: payments.filter(p => p.type === 'payable' && p.status === 'pending').length
      },
      completed: {
        total: payments
          .filter(p => p.type === 'payable' && p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0),
        count: payments.filter(p => p.type === 'payable' && p.status === 'completed').length
      }
    }
  };

  // Handle dashboard card click
  const handleCardClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
    
    const filterNames = {
      'receivable-pending': 'Contas a Receber (Pendentes)',
      'receivable-completed': 'Contas a Receber (Concluídos)',
      'payable-pending': 'Contas a Pagar (Pendentes)',
      'payable-completed': 'Contas a Pagar (Concluídos)'
    };
    
    if (activeFilter !== filter) {
      toast({
        title: "Filtro aplicado",
        description: `Exibindo ${filterNames[filter as keyof typeof filterNames]}`,
      });
    }
  };
  
  return (
    <div className="min-h-screen flex w-full bg-dark text-white">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full animate-fade-in">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Pagamentos</h1>
              <p className="text-muted-foreground">Gerencie os pagamentos de seus clientes</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-studio-orange hover:bg-studio-orange/90 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Novo Pagamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border border-studio-gray sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar novo pagamento</DialogTitle>
                    <DialogDescription>
                      Preencha os dados abaixo para adicionar um novo pagamento ao sistema.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="payment-type">Tipo</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={newPayment.type === 'receivable' ? 'default' : 'outline'}
                          className={newPayment.type === 'receivable' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => setNewPayment({...newPayment, type: 'receivable', category: ''})}
                        >
                          <ArrowUpIcon className="h-4 w-4 mr-2" /> Conta a Receber
                        </Button>
                        <Button
                          type="button"
                          variant={newPayment.type === 'payable' ? 'default' : 'outline'}
                          className={newPayment.type === 'payable' ? 'bg-red-600 hover:bg-red-700' : ''}
                          onClick={() => setNewPayment({...newPayment, type: 'payable', category: ''})}
                        >
                          <ArrowDownIcon className="h-4 w-4 mr-2" /> Conta a Pagar
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="client">
                        {newPayment.type === 'receivable' ? 'Cliente' : 'Fornecedor/Despesa'}
                      </Label>
                      <Select 
                        value={newPayment.client} 
                        onValueChange={(value) => setNewPayment({...newPayment, client: value})}
                      >
                        <SelectTrigger className="bg-studio-gray border-studio-gray">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client, index) => (
                            <SelectItem key={index} value={client}>{client}</SelectItem>
                          ))}
                          <SelectItem value="new">+ Adicionar Novo</SelectItem>
                        </SelectContent>
                      </Select>
                      {newPayment.client === 'new' && (
                        <Input
                          placeholder="Nome do cliente/fornecedor"
                          value=""
                          onChange={(e) => setNewPayment({...newPayment, client: e.target.value})}
                          className="mt-2 bg-studio-gray border-studio-gray"
                        />
                      )}
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="category">
                          {newPayment.type === 'receivable' ? 'Categoria/Serviço' : 'Categoria'}
                        </Label>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsCategoryDialogOpen(true)}
                          className="h-6 text-xs"
                        >
                          Gerenciar Categorias
                        </Button>
                      </div>
                      <Select 
                        value={newPayment.category} 
                        onValueChange={(value) => setNewPayment({...newPayment, category: value})}
                      >
                        <SelectTrigger className="bg-studio-gray border-studio-gray">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter(cat => cat.type === newPayment.type)
                            .map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Valor (R$)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newPayment.amount || ''}
                        onChange={(e) => setNewPayment({...newPayment, amount: Number(e.target.value)})}
                        className="bg-studio-gray border-studio-gray"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Data de Vencimento</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newPayment.dueDate}
                        onChange={(e) => setNewPayment({...newPayment, dueDate: e.target.value})}
                        className="bg-studio-gray border-studio-gray"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="button" onClick={handleAddNewPayment} className="bg-studio-orange hover:bg-studio-orange/90">
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Category Management Dialog */}
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent className="bg-card border border-studio-gray sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Gerenciar Categorias</DialogTitle>
                    <DialogDescription>
                      Adicione ou remova categorias para classificar seus pagamentos.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nova Categoria</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Nome da categoria"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                          className="bg-studio-gray border-studio-gray"
                        />
                        <Select 
                          value={newCategory.type} 
                          onValueChange={(value: PaymentType) => setNewCategory({...newCategory, type: value})}
                        >
                          <SelectTrigger className="w-[180px] bg-studio-gray border-studio-gray">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="receivable">Contas a Receber</SelectItem>
                            <SelectItem value="payable">Contas a Pagar</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={handleAddCategory} size="sm" className="bg-studio-orange hover:bg-studio-orange/90">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Categorias Existentes</Label>
                      <Tabs defaultValue="receivable" className="w-full">
                        <TabsList className="grid grid-cols-2 bg-studio-gray">
                          <TabsTrigger value="receivable">Contas a Receber</TabsTrigger>
                          <TabsTrigger value="payable">Contas a Pagar</TabsTrigger>
                        </TabsList>
                        <TabsContent value="receivable" className="max-h-[200px] overflow-y-auto mt-2">
                          <div className="space-y-2">
                            {categories.filter(c => c.type === 'receivable').map(category => (
                              <div key={category.id} className="flex items-center justify-between bg-studio-gray/50 p-2 rounded">
                                <span>{category.name}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-transparent"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value="payable" className="max-h-[200px] overflow-y-auto mt-2">
                          <div className="space-y-2">
                            {categories.filter(c => c.type === 'payable').map(category => (
                              <div key={category.id} className="flex items-center justify-between bg-studio-gray/50 p-2 rounded">
                                <span>{category.name}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-transparent"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsCategoryDialogOpen(false)}>
                      Fechar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </section>
          
          {/* Financial Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-studio-gray rounded-xl p-4">
              <NegotiationCard 
                title="Contas a Receber (Pendentes)" 
                data={{
                  total: financialSummary.receivable.pending.total,
                  currency: "R$",
                  count: financialSummary.receivable.pending.count
                }}
                onClick={() => handleCardClick('receivable-pending')}
              />
            </div>
            <div className="bg-card border border-studio-gray rounded-xl p-4">
              <NegotiationCard 
                title="Contas a Receber (Concluídos)" 
                data={{
                  total: financialSummary.receivable.completed.total,
                  currency: "R$",
                  count: financialSummary.receivable.completed.count
                }}
                onClick={() => handleCardClick('receivable-completed')}
              />
            </div>
            <div className="bg-card border border-studio-gray rounded-xl p-4">
              <NegotiationCard 
                title="Contas a Pagar (Pendentes)" 
                data={{
                  total: financialSummary.payable.pending.total,
                  currency: "R$",
                  count: financialSummary.payable.pending.count
                }}
                onClick={() => handleCardClick('payable-pending')}
              />
            </div>
            <div className="bg-card border border-studio-gray rounded-xl p-4">
              <NegotiationCard 
                title="Contas a Pagar (Concluídos)" 
                data={{
                  total: financialSummary.payable.completed.total,
                  currency: "R$",
                  count: financialSummary.payable.completed.count
                }}
                onClick={() => handleCardClick('payable-completed')}
              />
            </div>
          </section>
          
          <div className="bg-card rounded-xl border border-studio-gray overflow-hidden">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-studio-gray">
                <TabsList className="bg-studio-gray mb-4 sm:mb-0">
                  <TabsTrigger value="all" onClick={() => setActiveFilter(null)}>Todos</TabsTrigger>
                  <TabsTrigger value="receivable" onClick={() => setActiveFilter(null)}>A Receber</TabsTrigger>
                  <TabsTrigger value="payable" onClick={() => setActiveFilter(null)}>A Pagar</TabsTrigger>
                  <TabsTrigger value="pending" onClick={() => setActiveFilter(null)}>Pendentes</TabsTrigger>
                  <TabsTrigger value="completed" onClick={() => setActiveFilter(null)}>Concluídos</TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar pagamentos..."
                      className="pl-9 w-full bg-studio-gray border-studio-gray"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" className="border-studio-gray">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <TabsContent value="all" className="p-0">
                <PaymentTable 
                  payments={filteredPayments}
                  handleCompletePayment={handleCompletePayment}
                />
              </TabsContent>
              
              <TabsContent value="receivable" className="p-0">
                <PaymentTable 
                  payments={filteredPayments.filter(p => p.type === 'receivable')}
                  handleCompletePayment={handleCompletePayment}
                />
              </TabsContent>
              
              <TabsContent value="payable" className="p-0">
                <PaymentTable 
                  payments={filteredPayments.filter(p => p.type === 'payable')}
                  handleCompletePayment={handleCompletePayment}
                />
              </TabsContent>
              
              <TabsContent value="pending" className="p-0">
                <PaymentTable 
                  payments={filteredPayments.filter(p => p.status === 'pending')}
                  handleCompletePayment={handleCompletePayment}
                />
              </TabsContent>
              
              <TabsContent value="completed" className="p-0">
                <PaymentTable 
                  payments={filteredPayments.filter(p => p.status === 'completed')}
                  handleCompletePayment={handleCompletePayment}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Active filter indicator */}
          {activeFilter && (
            <div className="flex items-center justify-between bg-studio-gray/30 p-2 rounded-lg">
              <span>
                Filtro ativo: {
                  activeFilter === 'receivable-pending' ? 'Contas a Receber (Pendentes)' :
                  activeFilter === 'receivable-completed' ? 'Contas a Receber (Concluídos)' :
                  activeFilter === 'payable-pending' ? 'Contas a Pagar (Pendentes)' :
                  'Contas a Pagar (Concluídos)'
                }
              </span>
              <Button variant="ghost" size="sm" onClick={() => setActiveFilter(null)}>
                <X className="h-4 w-4 mr-1" /> Limpar filtro
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Payment Table Component - Extracted to make the main component more manageable
interface PaymentTableProps {
  payments: Payment[];
  handleCompletePayment: (id: number) => void;
}

const PaymentTable = ({ payments, handleCompletePayment }: PaymentTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-studio-gray/50">
          <tr>
            <th className="text-left p-4">Tipo</th>
            <th className="text-left p-4">Cliente/Fornecedor</th>
            <th className="text-left p-4">Categoria/Serviço</th>
            <th className="text-left p-4">Valor</th>
            <th className="text-left p-4">Data</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.id} className="border-t border-studio-gray hover:bg-studio-gray/20 transition-colors">
                <td className="p-4">
                  {payment.type === 'receivable' ? (
                    <span className="inline-flex items-center text-green-400">
                      <ArrowUpIcon className="h-4 w-4 mr-1" /> Receber
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-400">
                      <ArrowDownIcon className="h-4 w-4 mr-1" /> Pagar
                    </span>
                  )}
                </td>
                <td className="p-4">{payment.client}</td>
                <td className="p-4">{payment.category || payment.service}</td>
                <td className="p-4">R$ {payment.amount.toLocaleString()}</td>
                <td className="p-4">{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'completed' 
                      ? 'bg-green-900/20 text-green-400' 
                      : 'bg-yellow-900/20 text-yellow-400'
                  }`}>
                    {payment.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCompletePayment(payment.id)}
                      className={`${
                        payment.status === 'completed' 
                          ? 'text-green-400 hover:text-green-500' 
                          : 'text-muted-foreground hover:text-white'
                      }`}
                    >
                      {payment.status === 'completed' ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center text-muted-foreground">
                Nenhum pagamento encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
