// app/api/subscribe/route.ts

import Manager from '@/src/models/Manager';
import webPush from 'web-push';

export const POST = async (req: Request) => {
  try {
    const { subscription } = await req.json();

    // Получаем менеджера и сохраняем подписку
    const manager = await Manager.findOneAndUpdate(
      { email: subscription.email }, // Или используем другой способ идентификации
      { pushSubscription: subscription },
      { new: true, upsert: true } // Если менеджера нет, создаем новый
    );

    return new Response(
      JSON.stringify({ message: 'Подписка на пуш-уведомления сохранена' }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при сохранении подписки:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка при сохранении подписки' }),
      { status: 500 }
    );
  }
};


// export const sendPushNotification = async (managerId: string, message: string) => {
//     const manager = await Manager.findById(managerId);
//     if (!manager || !manager.pushSubscription) {
//       console.log('Менеджер не найден или подписка отсутствует');
//       return;
//     }
  
//     const pushSubscription = manager.pushSubscription;
  
//     const payload = JSON.stringify({ title: 'Новый кандидат', message });
  
//     webPush.setVapidDetails(
//       'mailto:your_email@example.com',
//       process.env.VAPID_PUBLIC_KEY!,
//       process.env.VAPID_PRIVATE_KEY!
//     );
  
//     try {
//       await webPush.sendNotification(pushSubscription, payload);
//       console.log('Уведомление отправлено');
//     } catch (error) {
//       console.error('Ошибка при отправке уведомления:', error);
//     }
//   };

  