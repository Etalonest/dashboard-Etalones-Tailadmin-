import React, { createContext, useState, useContext, ReactNode } from 'react';

// Тип уведомлений
export interface Notification {
  id: string;
  title?: string;
  content?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  metadata?: any;  // Метаданные
  link?: string;    // Ссылка для уведомления
}

// Тип контекста уведомлений
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
}

// Типы для провайдера
interface NotificationProviderProps {
  children: ReactNode;
}

// Создаем контекст
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Провайдер контекста
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => {
      return [...prev, notification];
    });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Хук для доступа к уведомлениям
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }

  return context;
};
