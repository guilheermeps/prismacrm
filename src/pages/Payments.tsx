
import { useState } from 'react';
import { Check, DollarSign, Filter, Plus, Search, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { upcomingPayments } from '@/utils/mockData';

const Payments = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [payments, setPayments] = useState(upcomingPayments);
  const [searchTerm, setSearchTerm] = useState('');
  
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
    
    toast({
      title: payment?.status === 'completed' ? "Pagamento desmarcado" : "Pagamento confirmado",
      description: payment?.status === 'completed' 
        ? `O pagamento de ${payment.client} foi marcado como pendente`
        : `O pagamento de ${payment?.client} foi marcado como concluído`,
    });
  };
  
  const filteredPayments = payments.filter(payment => 
    payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.service.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
              <Button className="bg-studio-orange hover:bg-studio-orange/90 text-white">
                <Plus className="h-4 w-4 mr-2" /> Novo Pagamento
              </Button>
            </div>
          </section>
          
          <div className="bg-card rounded-xl border border-studio-gray overflow-hidden">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-studio-gray">
                <TabsList className="bg-studio-gray mb-4 sm:mb-0">
                  <TabsTrigger value="all">Todos</TabsTrigger>
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-studio-gray/50">
                      <tr>
                        <th className="text-left p-4">Cliente</th>
                        <th className="text-left p-4">Serviço</th>
                        <th className="text-left p-4">Valor</th>
                        <th className="text-left p-4">Data</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.length > 0 ? (
                        filteredPayments.map((payment) => (
                          <tr key={payment.id} className="border-t border-studio-gray hover:bg-studio-gray/20 transition-colors">
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
                          <td colSpan={6} className="p-4 text-center text-muted-foreground">
                            Nenhum pagamento encontrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-studio-gray/50">
                      <tr>
                        <th className="text-left p-4">Cliente</th>
                        <th className="text-left p-4">Serviço</th>
                        <th className="text-left p-4">Valor</th>
                        <th className="text-left p-4">Data</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments
                        .filter(payment => payment.status === 'pending')
                        .map((payment) => (
                          <tr key={payment.id} className="border-t border-studio-gray hover:bg-studio-gray/20 transition-colors">
                            <td className="p-4">{payment.client}</td>
                            <td className="p-4">{payment.service}</td>
                            <td className="p-4">R$ {payment.amount.toLocaleString()}</td>
                            <td className="p-4">{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-900/20 text-yellow-400">
                                Pendente
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleCompletePayment(payment.id)}
                                  className="text-muted-foreground hover:text-white"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-studio-gray/50">
                      <tr>
                        <th className="text-left p-4">Cliente</th>
                        <th className="text-left p-4">Serviço</th>
                        <th className="text-left p-4">Valor</th>
                        <th className="text-left p-4">Data</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments
                        .filter(payment => payment.status === 'completed')
                        .map((payment) => (
                          <tr key={payment.id} className="border-t border-studio-gray hover:bg-studio-gray/20 transition-colors">
                            <td className="p-4">{payment.client}</td>
                            <td className="p-4">{payment.service}</td>
                            <td className="p-4">R$ {payment.amount.toLocaleString()}</td>
                            <td className="p-4">{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-400">
                                Concluído
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleCompletePayment(payment.id)}
                                  className="text-green-400 hover:text-green-500"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payments;
