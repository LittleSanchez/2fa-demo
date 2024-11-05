'use server';
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/utils/prisma/prisma";

export async function signup({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      accounts: {
        create: {
          provider: "credentials",
          access_token: hashedPassword,
          type: "email",
          providerAccountId: email,
        },
      },
      name,
    },
  });

  const verificationCode = await generateVerificationToken(email);
  await sendVerificationEmail(email, verificationCode);

  return user;
}
