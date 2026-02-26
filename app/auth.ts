import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { TierName } from "@/lib/types";

declare module "next-auth" {
  interface User {
    tier?: TierName;
    apiKey?: string | null;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      tier: TierName;
      apiKey: string | null;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const code = credentials?.code as string;
        if (!email || !code) return null;

        const apiUrl = process.env.NEXT_PUBLIC_MIDOS_API_URL ?? "http://localhost:8420";
        try {
          const res = await fetch(`${apiUrl}/api/auth/verify-code`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
          });
          if (!res.ok) return null;
          const user = await res.json();
          return {
            id: user.user_id,
            email: user.email,
            name: user.name ?? null,
            tier: user.tier ?? "community",
            apiKey: user.api_key ?? null,
          };
        } catch {
          return null;
        }
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    Google({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },
  callbacks: {
    async signIn({ user, account }) {
      // OAuth users: register/link with backend on first sign-in
      if (account?.provider !== "credentials" && user.email) {
        const apiUrl = process.env.NEXT_PUBLIC_MIDOS_API_URL ?? "http://localhost:8420";
        try {
          const res = await fetch(`${apiUrl}/api/auth/oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              provider: account?.provider,
              provider_id: account?.providerAccountId,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            user.tier = data.tier ?? "community";
            user.apiKey = data.api_key ?? null;
            user.id = data.user_id;
          }
        } catch {
          // Allow sign-in even if backend link fails — user gets default tier
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.tier = user.tier ?? "community";
        token.apiKey = user.apiKey ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.tier = (token.tier as TierName) ?? "community";
      session.user.apiKey = (token.apiKey as string) ?? null;
      return session;
    },
  },
});
