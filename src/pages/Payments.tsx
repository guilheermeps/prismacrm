
import { useState } from 'react';
import { Check, CreditCard, DollarSign, Filter, Plus, Search, WalletCards, X } from 'lucide-react';
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
}

const Payments = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [payments, setPayments] = useState<Payment[]>(upcomingPayments as Payment[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    client: '',
    service: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    type: 'receivable'
  });
  
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

  const handleAddNewPayment = () => {
    if (!newPayment.client || !newPayment.service || !newPayment.amount || !newPayment.dueDate) {
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
      amount: Number(newPayment.amount),
      status: 'pending' as PaymentStatus,
    } as Payment;

    setPayments([...payments, completePayment]);
    
    toast({
      title: newPayment.type === 'receivable' ? "Conta a receber adicionada" : "Conta a pagar adicionada",
      description: `${newPayment.client} - ${newPayment.service} (R$ ${Number(newPayment.amount).toLocaleString()})`,
    });

    // Reset form and close dialog
    setNewPayment({
      client: '',
      service: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      type: 'receivable'
    });
    setIsAddDialogOpen(false);
  };
  
  const filteredPayments = payments.filter(payment => 
    payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                          onClick={() => setNewPayment({...newPayment, type: 'receivable'})}
                        >
                          <ArrowUpIcon className="h-4 w-4 mr-2" /> Conta a Receber
                        </Button>
                        <Button
                          type="button"
                          variant={newPayment.type === 'payable' ? 'default' : 'outline'}
                          className={newPayment.type === 'payable' ? 'bg-red-600 hover:bg-red-700' : ''}
                          onClick={() => setNewPayment({...newPayment, type: 'payable'})}
                        >
                          <ArrowDownIcon className="h-4 w-4 mr-2" /> Conta a Pagar
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="client">
                        {newPayment.type === 'receivable' ? 'Cliente' : 'Fornecedor/Despesa'}
                      </Label>
                      <Input
                        id="client"
                        value={newPayment.client}
                        onChange={(e) => setNewPayment({...newPayment, client: e.target.value})}
                        className="bg-studio-gray border-studio-gray"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="service">
                        {newPayment.type === 'receivable' ? 'Serviço' : 'Categoria'}
                      </Label>
                      <Input
                        id="service"
                        value={newPayment.service}
                        onChange={(e) => setNewPayment({...newPayment, service: e.target.value})}
                        className="bg-studio-gray border-studio-gray"
                      />
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
              />
            </div>
          </section>
          
          <div className="bg-card rounded-xl border border-studio-gray overflow-hidden">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-studio-gray">
                <TabsList className="bg-studio-gray mb-4 sm:mb-0">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="receivable">A Receber</TabsTrigger>
                  <TabsTrigger value="payable">A Pagar</TabsTrigger>
                  <TabsTrigger value="pending">Pendentes</TabsTrigger>
                  <TabsTrigger value="completed">Concluídos</TabsTrigger>
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
            <th className="text-left p-4">Serviço/Categoria</th>
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
                <td className="p-4">{payment.service}</td>
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
