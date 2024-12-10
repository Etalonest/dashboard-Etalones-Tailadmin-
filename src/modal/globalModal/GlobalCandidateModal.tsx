'use client';
// Modal.tsx
import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      // Отключить прокрутку страницы при открытии модального окна
      document.body.style.overflow = 'hidden';
    } else {
      // Включить прокрутку страницы при закрытии модального окна
      document.body.style.overflow = 'auto';
    }

    // Очистка стиля при размонтировании компонента
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-[100%] h-[100%] flex justify-center items-center ">
      <div className="flex flex-col p-4 w-[800px] h-[800px] rounded text-white bg-black bg-opacity-50 shadow-lg relative overflow-auto">
      <button onClick={onClose} className="self-end text-red-500 text-2xl ">
          &times;
        </button>
        <div className="modal-content w-full overflow-y-auto">
          {children}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;
