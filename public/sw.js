// self.addEventListener('push', (event) => {
//     // Проверяем, что event.data существует и получаем данные пуш-уведомления
//     const { title, message } = event.data ? event.data.json() : { title: 'Без заголовка', message: 'Без сообщения' };
  
//     // Показываем уведомление
//     event.waitUntil(
//       self.registration.showNotification(title, {
//         body: message,
//         icon: '/images/best-value-banner.png', // Укажите путь к иконке для уведомлений
//       })
//     );
// });
self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();
        const { title, body, primaryKey, badge, url } = data;
        const options = {
            body,
            icon: '/android-chrome-192x192.png',
            badge: badge || '/push-badge.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey,
                url,
            },
        };
        event.waitUntil(self.registration.showNotification(title, options));
    }
});

self.addEventListener('notificationclick', function (event) {
    const data = event.notification.data;
    const { url } = data;
    event.notification.close();

    if (url) {
        event.waitUntil(clients.openWindow(url));
    }
});