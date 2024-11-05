import nodemailer from 'nodemailer';

/**
 * Відправляє email з кодом верифікації для підтвердження email адреси
 * @param email Email отримувача
 * @param code Код верифікації
 */
export async function sendVerificationEmail(email: string, code: string) {
    // Створення транспортера для відправки email через Gmail SMTP
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // TLS
        auth: {
            user: process.env.EMAIL_USER, // Email відправника з env
            pass: process.env.EMAIL_PASS, // Пароль з env
        },
    })

    // Відправка email з кодом верифікації
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        text: `Your verification code is: ${code}`,
    });
}

/**
 * Відправляє email з одноразовим паролем (OTP) для входу
 * @param email Email отримувача
 * @param otp Одноразовий пароль
 */
export async function sendOTP(email: string, otp: string) {
    // Створення транспортера для відправки email через Gmail SMTP
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    // Відправка email з OTP
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your login',
        text: `Your one-time code is: ${otp}`,
    });
}
