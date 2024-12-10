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
    <div className="fixed  flex justify-end items-end   inset-0 w-[70%] "> 
      <div className="p-4 rounded text-white bg-black bg-opacity-50 shadow-lg relative overflow-auto">
        <button onClick={onClose} className="self-end text-red-500 text-2xl absolute right-4 top-4">
          &times;
        </button>
        
        <div className="modal-content max-h-[80vh] overflow-y-auto">
          {children}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;
