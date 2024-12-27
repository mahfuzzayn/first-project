import nodemailer from 'nodemailer'
import config from '../config'
import emailTemplate from './emailTemplate'

export const sendEmail = async (userEmail: string, resetLink: string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: config.NODE_ENV === 'production',
        auth: {
            user: config.reset_sender_account_email,
            pass: config.reset_sender_account_password,
        },
    })

    await transporter.sendMail({
        from: `"Support 🔥 PH University" <${config.reset_sender_account_email}>`, // sender address
        to: userEmail, // list of receivers
        subject: 'Reset your Password within 10 minutes!', // Subject line
        text: 'You have to reset your password within 10 minutes!', // plain text body
        html: emailTemplate(userEmail, resetLink),
    })
}
