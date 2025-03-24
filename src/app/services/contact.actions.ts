"use server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { zfd } from "zod-form-data";

const contactSchema = zfd.formData({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne doit pas dépasser 50 caractères")
    .regex(
      /^[a-zA-ZÀ-ÿ\s-]+$/,
      "Le prénom ne doit contenir que des lettres, des espaces et des tirets"
    ),

  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne doit pas dépasser 50 caractères")
    .regex(
      /^[a-zA-ZÀ-ÿ\s-]+$/,
      "Le nom ne doit contenir que des lettres, des espaces et des tirets"
    ),

  email: z
    .string()
    .email("L'adresse email n'est pas valide")
    .min(5, "L'email doit contenir au moins 5 caractères")
    .max(100, "L'email ne doit pas dépasser 100 caractères"),

  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(500, "Le message ne doit pas dépasser 500 caractères")
    .regex(
      /^[^<>]*$/,
      "Le message ne doit pas contenir de caractères spéciaux"
    ),
});

const MESSAGES = {
  SUCCESS:
    "Votre message a été envoyé avec succès ! 📧 Merci de m'avoir contacté !",
  ERROR:
    "Une erreur est survenue lors de l'envoi du message ! 😔 Veuillez réessayer.",
};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async (
  formData: FormData
): Promise<{ success: boolean; message: string }> => {
  try {
    const validatedData = contactSchema.parse(formData);
    const { firstName, lastName, email, message } = validatedData;

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Nouveau message depuis le portfolio",
      text: `
          Nom: ${lastName} ${firstName}
          Email: ${email}
          Message: ${message}
        `,
      html: `
          <p><strong>Nom:</strong> ${lastName} ${firstName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
    });

    return {
      success: true,
      message: MESSAGES.SUCCESS,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }
    return {
      success: false,
      message: MESSAGES.ERROR,
    };
  }
};
