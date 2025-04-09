import Credentials from "next-auth/providers/credentials";

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { apiServices } from "@/config/axios.config";
import { NextAuthOptions } from "next-auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const response = await apiServices.post("/signin", {
            email,
            password,
            device_name: req.headers?.["user-agent"],
          });
          const user = response.data.data;
          return user;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: any;
      account: any;
      user: any;
    }) {
      if (account) {
        token.accessToken = user.token;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    session({ session, token }) {
      return { ...session, role: token.role, accessToken: token.accessToken };
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV !== "production",
} satisfies NextAuthOptions;
