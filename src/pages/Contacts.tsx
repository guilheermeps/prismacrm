
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContactsList from "@/components/contacts/ContactsList";
import ContactForm from "@/components/contacts/ContactForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Contacts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

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
                  <TabsTrigger value="clients" className="text-xs md:text-base">Clientes</TabsTrigger>
                  <TabsTrigger value="suppliers" className="text-xs md:text-base">Fornecedores</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <ContactsList 
                    filterType="all" 
                    onAddContact={handleAddContact} 
                    onEditContact={handleEditContact}
                  />
                </TabsContent>
                <TabsContent value="clients">
                  <ContactsList 
                    filterType="client" 
                    onAddContact={handleAddContact} 
                    onEditContact={handleEditContact}
                  />
                </TabsContent>
                <TabsContent value="suppliers">
                  <ContactsList 
                    filterType="supplier" 
                    onAddContact={handleAddContact} 
                    onEditContact={handleEditContact}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isContactFormOpen} onOpenChange={setIsContactFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <ContactForm onClose={handleCloseForm} initialContact={selectedContact} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
