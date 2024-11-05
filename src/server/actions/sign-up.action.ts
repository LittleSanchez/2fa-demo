'use server';

import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/utils/prisma/prisma";

/**
 * Функція реєстрації нового користувача
 * @param {Object} params - Параметри реєстрації
 * @param {string} params.email - Email користувача
 * @param {string} params.password - Пароль користувача
 * @param {string} [params.name] - Ім'я користувача (опціонально)
 * @returns {Promise<User>} Створений об'єкт користувача
 * @throws {Error} Якщо email вже існує
 */
export async function signup({
    email,
    password,
    name,
}: {
    email: string;
    password: string;
    name?: string;
}) {
    // Перевірка чи існує користувач з таким email
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    // Якщо користувач існує - викидаємо помилку
    if (existingUser) {
        throw new Error("Email already exists");
    }

    // Хешування пароля для безпечного зберігання
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача з пов'язаним обліковим записом credentials
    const user = await prisma.user.create({
        data: {
            email,
            accounts: {
                create: {
                    provider: "credentials",
                    access_token: hashedPassword, // Зберігаємо хешований пароль як access_token
                    type: "email",
                    providerAccountId: email, // Використовуємо email як унікальний ідентифікатор
                },
            },
            name, // Додаємо ім'я, якщо воно надано
        },
    });

    // Генерація коду верифікації для підтвердження email
    const verificationCode = await generateVerificationToken(email);

    // Відправка email з кодом верифікації
    await sendVerificationEmail(email, verificationCode);

    return user;
}
