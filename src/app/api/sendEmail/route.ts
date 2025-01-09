// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',    
    port: 465,               
    secure: true, 
  auth: {
    user: "office@etalones.com",
    // user: "developerar4y@mail.ru", 
    pass: "P3AEYkrnT5VJFihkdv71", 
  },
});

// API-роут для отправки email
export const POST = async (request: Request) => {
  try {
    const { email, subject, text } = await request.json();

    // Проверка, что все данные есть
    if (!email || !subject || !text) {
      return new NextResponse(
        JSON.stringify({ message: "Все поля обязательны для отправки почты." }),
        { status: 400 }
      );
    }

    // Настройка письма
    const mailOptions = {
      from: "developerar4y@mail.ru", // Адрес отправителя
      to: email, // Адрес получателя
      subject: subject, // Тема письма
      text: text, // Текст письма
    };

    // Отправка письма
    const info = await transporter.sendMail(mailOptions);

    return new NextResponse(
      JSON.stringify({ message: "Письмо успешно отправлено!", info }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Ошибка при отправке письма:", error);
    return new NextResponse(
      JSON.stringify({ message: "Ошибка при отправке письма", error: error.message }),
      { status: 500 }
    );
  }
};
