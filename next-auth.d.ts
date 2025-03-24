import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    userId?: string;
  }

  interface Session {
    user: {
      role?: string;
      userId?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    userId?: string;
  }
}
