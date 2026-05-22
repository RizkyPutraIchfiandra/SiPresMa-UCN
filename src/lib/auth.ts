import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { container } from "@/infrastructure/container";
import { adminLoginSchema } from "@/lib/validators/schemas";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = adminLoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const admin = await container.adminRepo.findByUsername(
          parsed.data.username
        );
        if (!admin) return null;

        const ok = await bcrypt.compare(parsed.data.password, admin.passwordHash);
        if (!ok) return null;

        return {
          id: admin.id,
          name: admin.username,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as
          | string
          | undefined;
      }
      return session;
    },
  },
};