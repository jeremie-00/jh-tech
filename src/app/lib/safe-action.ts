import { authOptions } from "@/app/lib/authOptions";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { createSafeActionClient } from "next-safe-action";

export class ActionError extends Error {
  constructor(message: string, public code: string = "UNAUTHORIZED") {
    super(message);
    this.name = "ActionError";
  }
}

export const actionClient = createSafeActionClient();

export const authActionClient = createSafeActionClient({
  handleServerError: (error) => {
    // Gestion des erreurs ActionError personnalisées
    if (error instanceof ActionError) {
      return {
        message: error.message,
        code: error.code,
      };
    }

    // Gestion des erreurs Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorMessages: Record<string, string> = {
        P2002: `Le champ ${error?.meta?.target} existe déjà.`,
        P2000: "Erreur de validation de la base de données",
        P2025: "Enregistrement non trouvé",
        P2023: "Erreur de relation entre les tables",
        P2003: "Erreur de clé étrangère",
        P2014: "Erreur de relation unique",
        P2016: "Erreur de relation requise",
      };

      return {
        message:
          errorMessages[error.code] || `Erreur Prisma : ${error.message}`,
        code: "DATABASE_ERROR",
      };
    }

    // Gestion des erreurs de validation Zod
    if (error.name === "ZodError") {
      return {
        message: "Erreur de validation des données",
        code: "VALIDATION_ERROR",
      };
    }

    // Erreur générique
    return {
      message: "Une erreur inattendue est survenue",
      code: "INTERNAL_ERROR",
    };
  },
}).use(async ({ next }) => {
  const session = await getServerSession(authOptions);

  // Vérification de la session
  if (!session) {
    throw new ActionError(
      "Vous devez être connecté pour accéder à cette page.",
      "NOT_AUTHENTICATED"
    );
  }

  // Vérification du rôle admin
  if (session.user?.role !== "admin") {
    throw new ActionError(
      "Vous n'avez pas les permissions nécessaires.",
      "NOT_AUTHORIZED"
    );
  }

  // Vérification de l'email autorisé
  const authorizedEmails = [process.env.GITHUB_EMAIL];
  if (!authorizedEmails.includes(session.user.email || "")) {
    throw new ActionError("Accès non autorisé.", "UNAUTHORIZED_EMAIL");
  }

  return next();
});
