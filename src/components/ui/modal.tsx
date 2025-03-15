import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]  dark:bg-[#333333] border border-border rounded-lg shadow-lg p-6 w-full max-w-lg">
        {children}
      </div>
    </>
  );
}

export function ModalHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-lg font-semibold mb-4">
      {children}
    </div>
  );
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-text-secondary mb-6">
      {children}
    </div>
  );
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end space-x-2">
      {children}
    </div>
  );
} 