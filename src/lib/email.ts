// import { Resend } from 'resend';

import nodemailer from 'nodemailer';

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string) {
  // await resend.emails.send({
  //   from: 'onboarding@resend.dev',
  //   to: email,
  //   subject: 'Verify your email',
  //   html: `Your verification code is: ${code}`,
  // });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    text: `Your verification code is: ${code}`,
  });
}

export async function sendOTP(email: string, otp: string) {
  // await resend.emails.send({
  //   from: 'onboarding@resend.dev',
  //   to: email,
  //   subject: 'Verify your login',
  //   html: `Your one-time code is: ${otp}`,
  // })

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your login',
    text: `Your one-time code is: ${otp}`,
  });
}

