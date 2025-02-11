// generateVapidKeys.js
const webPush = require('web-push');

// Генерация публичного и приватного VAPID ключей
const vapidKeys = webPush.generateVAPIDKeys();

// Выводим ключи в консоль
console.log('VAPID PUBLIC KEY:', vapidKeys.publicKey);
console.log('VAPID PRIVATE KEY:', vapidKeys.privateKey);
