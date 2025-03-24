import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// Liste des emails autorisés comme admin
const ADMIN_EMAILS = process.env.GITHUB_EMAIL as string; // Remplacez par votre email GitHub

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    updateAge: 60 * 60 * 24, // 24 heures
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        // Vérifier si l'email de l'utilisateur est dans la liste des admins
        const isAdmin = ADMIN_EMAILS?.includes(user.email || "");

        return {
          ...token,
          accessToken: account.access_token,
          role: isAdmin ? "admin" : "user",
          userId: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          userId: token.userId,
        },
      };
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
