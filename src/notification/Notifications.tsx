'use client'
import React, { useContext, useEffect, useState } from "react";
import { NotificationContext, Notification } from "@/src/context/NotificationContext";

const Notifications = () => {
  const { notifications } = useContext(NotificationContext) || { notifications: [] };
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const [shownNotificationIds, setShownNotificationIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    notifications.forEach(notification => {
      console.log('Обрабатываем уведомление:', notification); // Логируем всё уведомление, включая метаданные

      // Проверяем, было ли уже это уведомление показано
      if (!shownNotificationIds.has(notification.id)) {
        setVisibleNotifications(prevNotifications => [...prevNotifications, notification]);
        setShownNotificationIds(prevIds => new Set(prevIds.add(notification.id)));

        // Убираем уведомление через 3 секунды
        setTimeout(() => {
          setVisibleNotifications(prevNotifications => prevNotifications.filter(n => n.id !== notification.id));
        }, 5000);
      }
    });
  }, [notifications, shownNotificationIds]);

  const handleClose = (id: string) => {
    setVisibleNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));
    setShownNotificationIds(prevIds => {
      const updatedIds = new Set(prevIds);
      updatedIds.delete(id);
      return updatedIds;
    });
  };

  return (
    <div style={{ position: "fixed", top: "10px", right: "10px", zIndex: 9999 }}>
      {
        visibleNotifications.map((notification: Notification) => (
          <div
            key={notification.id}
            className={`alert ${notification.type === "success" ? "alert-success" : notification.type === "error" ? "alert-error" : "alert-info"}`}
            style={{
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: notification.type === "success" ? "#4CAF50" : notification.type === "error" ? "#f44336" : "#2196F3",
              color: "#fff",
              borderRadius: "5px",
              opacity: 1,
              transition: "opacity 0.5s",
              position: "relative",
            }}
          >
            <h4>{notification.title}</h4>
            <p>
              {notification.content}
              {notification.metadata?.partnerId && (
                <a 
                  href={`/partner/${notification.metadata.partnerId}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: "#FFD700", textDecoration: "underline", marginLeft: "10px" }}
                >
                  Перейти к партнёру
                </a>
              )}
            </p>

            <button
              onClick={() => handleClose(notification.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "20px",
                cursor: "pointer",
                position: "absolute",
                top: "5px",
                right: "10px"
              }}
            >
              &times;
            </button>
          </div>
        ))
      }
    </div>
  );
};

export default Notifications;
