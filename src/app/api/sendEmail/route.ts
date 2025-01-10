import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',    
    port: 465,               
    secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const POST = async (request: Request) => {
  try {
    const { email, subject, text } = await request.json();

    if (!email || !subject || !text) {
      return new NextResponse(
        JSON.stringify({ message: "Все поля обязательны для отправки почты." }),
        { status: 400 }
      );
    }

 
    const mailOptions = {
      from: process.env.EMAIL,
      to: email, 
      subject: subject, 
      text: text, 
    };

   
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
