
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContactsList from "@/components/contacts/ContactsList";
import ContactForm from "@/components/contacts/ContactForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

const ContactsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsContactFormOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsContactFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsContactFormOpen(false);
    setSelectedContact(null);
    // Invalidate contacts query to refresh the list
    queryClient.invalidateQueries({ queryKey: ['contacts'] });
  };

  const handleCreateOrderFromContact = (contact) => {
    // Store contact info in sessionStorage for use in OrderForm
    sessionStorage.setItem('createOrderFromContact', JSON.stringify({
      contactId: contact.id,
      contactName: contact.name
    }));
    navigate('/orders-contracts');
  };

  const handleCreateContractFromContact = (contact) => {
    // Store contact info in sessionStorage for use in ContractForm
    sessionStorage.setItem('createContractFromContact', JSON.stringify({
      contactId: contact.id,
      contactName: contact.name
    }));
    navigate('/orders-contracts');
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-3 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Contatos</h1>
            <div className="bg-card rounded-lg p-3 md:p-5">
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6">
                  <TabsTrigger value="all" className="text-xs md:text-base">Todos</TabsTrigger>
                  <TabsTrigger value="client" className="text-xs md:text-base">Clientes</TabsTrigger>
                  <TabsTrigger value="supplier" className="text-xs md:text-base">Fornecedores</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <ContactsList 
                    filterType="all" 
                    onAddContact={handleAddContact} 
                    onEditContact={handleEditContact}
                    onCreateOrder={handleCreateOrderFromContact}
                    onCreateContract={handleCreateContractFromContact}
                  />
                </TabsContent>
                <TabsContent value="clients">
                  <ContactsList 
                    filterType="client" 
                    onAddContact={handleAddContact} 
                    onEditContact={handleEditContact}
                    onCreateOrder={handleCreateOrderFromContact}
                    onCreateContract={handleCreateContractFromContact}
                  />
                </TabsContent>
                <TabsContent value="suppliers">
                  <ContactsList 
                    filterType="supplier" 
                    onAddContact={handleAddContact} 
                    onEditContact={handleEditContact}
                    onCreateOrder={handleCreateOrderFromContact}
                    onCreateContract={handleCreateContractFromContact}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isContactFormOpen} onOpenChange={setIsContactFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <ContactForm 
            onClose={handleCloseForm} 
            initialContact={selectedContact}
            onSuccess={() => {
              // Invalidate and refetch contacts after successful operation
              queryClient.invalidateQueries({ queryKey: ['contacts'] });
              setIsContactFormOpen(false);
              setSelectedContact(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Wrap the component with QueryClientProvider
const Contacts = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ContactsPage />
    </QueryClientProvider>
  );
};

export default Contacts;
