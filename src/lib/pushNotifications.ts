// src/lib/pushNotifications.ts

import webPush from 'web-push';
import Manager from '@/src/models/Manager'; // Путь к твоей модели Manager

export const sendPushNotification = async (managerId: string, message: string) => {
  const manager = await Manager.findById(managerId);
  if (!manager || !manager.pushSubscription) {
    console.log('Менеджер не найден или подписка отсутствует');
    return;
  }

  const pushSubscription = manager.pushSubscription;

  const payload = JSON.stringify({ title: 'Новый кандидат', message });

  webPush.setVapidDetails(
    'mailto:your_email@example.com',
    process.env.VAPID_PUBLIC_KEY!, // Убедись, что у тебя есть ключи в .env
    process.env.VAPID_PRIVATE_KEY!
  );

  try {
    await webPush.sendNotification(pushSubscription, payload);
    console.log('Уведомление отправлено');
  } catch (error) {
    console.error('Ошибка при отправке уведомления:', error);
  }
};
