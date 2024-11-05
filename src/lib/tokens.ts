'use server';
import { prisma } from "@/utils/prisma/prisma";
import bcrypt from "bcryptjs";
import { sendOTP } from "./email";
import { signIn } from "@/utils/auth/auth";

/**
 * Відправляє OTP (одноразовий пароль) на email користувача після перевірки облікових даних
 * @param email Email користувача
 * @param password Пароль користувача
 * @returns null якщо перевірка не пройдена, true якщо OTP успішно відправлено
 */
export async function sendOtp(email: string, password: string) {
    // Пошук користувача за email з включенням пов'язаних облікових записів
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        include: {
            accounts: true,
        }
    });

    // Якщо користувача не знайдено
    if (!user) {
        return null;
    }

    // Пошук облікового запису з провайдером "credentials"
    const userCredentialsAccount = await prisma.account.findFirst({
        where: {
            userId: user?.id,
            provider: "credentials",
        }
    });

    // Перевірка валідності облікового запису
    if (!userCredentialsAccount || userCredentialsAccount.type !== "email" || !userCredentialsAccount.access_token) {
        return null;
    }

    // Перевірка правильності пароля
    const isValid = await bcrypt.compare(password, userCredentialsAccount.access_token);
    if (!isValid) {
        return null;
    }

    // Перевірка чи email підтверджено
    if (!user.emailVerified) {
        throw new Error("Email not verified");
    }

    // Генерація та відправка OTP
    const otp = await generateVerificationToken(email);
    await sendOTP(email, otp);
    return true;
}

/**
 * Генерує токен верифікації для email
 * @param email Email для якого генерується токен
 * @returns Згенерований токен
 */
export async function generateVerificationToken(email: string) {
    // Генерація 6-значного випадкового коду
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    // Встановлення терміну дії 10 хвилин
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

    // Пошук та видалення існуючого токена
    const existingToken = await prisma.verificationCode.findFirst({
        where: { email },
    });
    if (existingToken) {
        await prisma.verificationCode.delete({
            where: { id: existingToken.id },
        });
    }

    // Створення нового токена в базі даних
    await prisma.verificationCode.create({
        data: {
            email,
            code: token,
            expires,
        },
    });
    return token;
}

/**
 * Перевіряє валідність токена верифікації
 * @param email Email користувача
 * @param code Код верифікації
 */
export async function verifyToken(email: string, code: string) {
    // Пошук дійсного токена верифікації
    const verificationToken = await prisma.verificationCode.findFirst({
        where: {
            email,
            code,
            expires: { gt: new Date() }, // Перевірка чи токен не прострочений
        },
    });

    if (!verificationToken) {
        throw new Error("Invalid or expired verification code");
    }

    // Оновлення статусу підтвердження email
    await prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
    });

    // Видалення використаного токена
    await prisma.verificationCode.delete({
        where: { id: verificationToken.id },
    });
}

/**
 * Виконує вхід користувача через OTP
 * @param email Email користувача
 * @param otp Одноразовий пароль
 * @returns Результат входу
 */
export async function verifyOtpLogin(email: string, otp: string) {
    return signIn('credentials', {
        email,
        otp,
        redirectTo: "/"
    });
}
