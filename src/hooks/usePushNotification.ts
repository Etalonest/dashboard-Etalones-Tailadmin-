// // hooks/usePushNotification.ts

// import { useEffect } from 'react';

// const usePushNotification = () => {
//   useEffect(() => {
//     if ('Notification' in window && 'serviceWorker' in navigator) {
//       // Запрос разрешения на уведомления
//       Notification.requestPermission().then((permission) => {
//         if (permission === 'granted') {
//           console.log('Уведомления разрешены');
//           registerServiceWorker();
//         }
//       });
//     }
//   }, []);

//   const registerServiceWorker = async () => {
//     try {
//       // Регистрируем Service Worker
//       const swRegistration = await navigator.serviceWorker.register('/sw.js');
//       console.log('Service Worker зарегистрирован', swRegistration);

//       // Подписываем пользователя на пуш-уведомления
//       const pushSubscription = await swRegistration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, // Публичный ключ VAPID
//       });

//       console.log('Подписка на пуш-уведомления:', pushSubscription);

//       // Отправляем подписку на сервер для сохранения
//       const response = await fetch('/api/notifications', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           subscription: pushSubscription,
//           message: 'Вы успешно подписаны на уведомления!',
//         }),
//       });

//       if (!response.ok) {
//         console.error('Ошибка при сохранении подписки');
//       }
//     } catch (error) {
//       console.error('Ошибка при регистрации service worker или подписке:', error);
//     }
//   };
// };

// export default usePushNotification;
// hooks/usePushNotification.ts
import { useEffect } from 'react';

const usePushNotification = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker зарегистрирован', registration);

          // Запрашиваем разрешение на пуш-уведомления
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              console.log('Пуш-уведомления разрешены');

              // Проверяем VAPID ключ
              const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
              console.log('Используем публичный ключ VAPID:', vapidPublicKey);

              // Конвертируем ключ
              const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey || '');
              console.log('Конвертированный ключ:', applicationServerKey);

              // Подписка на пуш-уведомления
              registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey,
              })
                .then((subscription) => {
                  console.log('Подписка на пуш-уведомления успешна:', subscription);

                  // Отправляем подписку на сервер для сохранения
                  fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      subscription: subscription,
                    }),
                  });
                })
                .catch((error) => {
                  console.error('Ошибка при подписке на пуш-уведомления:', error);
                });
            } else {
              console.log('Пуш-уведомления отклонены');
            }
          });
        })
        .catch((error) => {
          console.error('Ошибка при регистрации Service Worker:', error);
        });
    } else {
      console.log('Service Worker или Push API не поддерживаются');
    }
  }, []);
};

// Функция для конвертации публичного ключа VAPID в нужный формат
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default usePushNotification;
