const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
            service: 'gmail', // Replace with your email provider
            auth: {
                user: 'developerar4y@gmail.com', // Replace with your email address
                pass: 'your_password' // Replace with your email password
            }
        });

        module.exports = {
            transporter
        };
        
        const { transporter } = require('./utils/email');

        const sendEmail = async (options) => {
        try {
        const mailOptions = {
        from: 'your_email@gmail.com', // Sender address
        to: options.to, // Recipient address
        subject: options.subject, // Email subject
        html: options.html // Email content (HTML)
        };
       
        const info = await transporter.sendMail(mailOptions);
       
        console.log('Email sent successfully:', info.response);
        } catch (error) {
        console.error('Error sending email:', error);
        }
        };
       
        module.exports = {
        sendEmail
        };