import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthConfig } from "next-auth";
import { prisma } from "../prisma/prisma";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateVerificationToken, verifyToken } from "@/lib/tokens";
import { sendOTP } from "@/lib/email";

/**
 * Розширення типу Session для включення користувацьких полів
 */
declare module "next-auth" {
    interface Session {
        user: User;
    }
}

/**
 * Конфігурація NextAuth для автентифікації
 */
export const authConfig = {
    // Адаптер для роботи з Prisma
    adapter: PrismaAdapter(prisma),

    // Налаштування провайдерів автентифікації
    providers: [
        Discord,
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                otp: { label: "OTP", type: "text", required: false },
            },
            /**
             * Функція авторизації користувача через credentials
             * @param credentials Облікові дані користувача (email та OTP)
             * @returns User | null
             */
            async authorize(credentials) {
                try {
                    const email = credentials?.email as string;
                    const otp = credentials?.otp as string;

                    // Перевірка наявності необхідних даних
                    if (!email || !otp) {
                        return null;
                    }

                    // Пошук користувача за email
                    const user = await prisma.user.findUnique({
                        where: {
                            email,
                        },
                        include: {
                            accounts: true,
                        }
                    });

                    if (!user) {
                        return null;
                    }

                    // Перевірка наявності облікового запису credentials
                    const userCredentialsAccount = await prisma.account.findFirst({
                        where: {
                            userId: user?.id,
                            provider: "credentials",
                        }
                    });

                    // Перевірка валідності облікового запису
                    if (!userCredentialsAccount ||
                        userCredentialsAccount.type !== "email" ||
                        !userCredentialsAccount.access_token) {
                        return null;
                    }

                    // Перевірка OTP коду
                    await verifyToken(email, otp);
                    return user;
                } catch (error) {
                    console.error(error);
                }
            },
        }),
    ],

    // Налаштування сторінок автентифікації
    pages: {
        signIn: "/auth/login",
        verifyRequest: "/auth/verify",
    },

    // Колбеки для кастомізації процесу автентифікації
    callbacks: {
        // Модифікація сесії
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
        // Модифікація JWT токена
        async jwt({ token, user }) {
            console.log("jwt user", user);
            return token;
        },
    },

    // Налаштування стратегії сесії
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig;
