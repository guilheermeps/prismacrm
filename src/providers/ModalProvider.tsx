
import React, { createContext, useContext, useState } from 'react';

type ModalContextType = {
  isOpen: boolean;
  modalContent: React.ReactNode;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setModalContent(null);
    }, 300); // Small delay to allow closing animation
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        modalContent,
        openModal,
        closeModal,
      }}
    >
      {children}
      {isOpen && modalContent}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
