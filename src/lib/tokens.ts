'use server';
import { prisma } from "@/utils/prisma/prisma";
import bcrypt from "bcryptjs";
import { sendOTP } from "./email";
import { signIn } from "@/utils/auth/auth";

export async function sendOtp(email: string, password: string) {

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

  const isValid = await bcrypt.compare(password, userCredentialsAccount.access_token);

  if (!isValid) {
    return null;
  }

  if (!user.emailVerified) {
    throw new Error("Email not verified");
  }

  const otp = await generateVerificationToken(email);

  await sendOTP(email, otp);
  return true;
}

export async function generateVerificationToken(email: string) {
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutes

  const existingToken = await prisma.verificationCode.findFirst({
    where: { email },
  });

  if (existingToken) {
    await prisma.verificationCode.delete({
      where: { id: existingToken.id },
    });
  }

  await prisma.verificationCode.create({
    data: {
      email,
      code: token,
      expires,
    },
  });

  return token;
}

export async function verifyToken(email: string, code: string) {
  const verificationToken = await prisma.verificationCode.findFirst({
    where: {
      email,
      code,
      expires: { gt: new Date() },
    },
  });

  if (!verificationToken) {
    throw new Error("Invalid or expired verification code");
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationCode.delete({
    where: { id: verificationToken.id },
  });
}

export async function verifyOtpLogin(email: string, otp: string) {
  return signIn('credentials', {
    email,
    otp,
    redirectTo: "/"
  });
}
