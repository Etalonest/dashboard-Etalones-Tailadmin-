const nodemailer = require('nodemailer');

// Убедитесь, что transporter создаётся только один раз
const transporter = nodemailer.createTransport({
    service: 'gmail', // Замените на ваш почтовый сервис
    auth: {
        user: 'developerar4y@gmail.com', // Ваш email
        pass: 'your_password' // Ваш пароль
    }
});

const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: 'your_email@gmail.com', // Адрес отправителя
            to: options.to,               // Адрес получателя
            subject: options.subject,     // Тема письма
            html: options.html            // Содержимое письма (HTML)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Экспортируем только sendEmail, transporter не нужен
module.exports = {
    sendEmail
};
