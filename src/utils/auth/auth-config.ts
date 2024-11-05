import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthConfig } from "next-auth";
import { prisma } from "../prisma/prisma";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateVerificationToken, verifyToken } from "@/lib/tokens";
import { sendOTP } from "@/lib/email";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text", required: false },
      },
      async authorize(credentials) {
        try {

          const email = credentials?.email as string;
          const otp = credentials?.otp as string;

          if (!email || !otp) {
            return null;
          }

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

          const userCredentialsAccount = await prisma.account.findFirst({
            where: {
              userId: user?.id,
              provider: "credentials",
            }
          });

          if (!userCredentialsAccount || userCredentialsAccount.type !== "email" || !userCredentialsAccount.access_token) {
            return null;
          }

          await verifyToken(email, otp);
          return user;

        } catch (error) {
          console.error(error);
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify",
  },
  callbacks: {
    async session({ session, token }) {
      // console.log("session user", user);
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      console.log("jwt user", user);
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
