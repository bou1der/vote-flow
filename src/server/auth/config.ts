import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcrypt";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { env } from "~/env";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: NonNullable<Awaited<ReturnType<typeof GetUser>>> &
      DefaultSession["user"];
  }
}

const GetUser = async (email: string) => {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
    columns: {
      id: true,
      name:true,
      image:true,
      email: true,
      role: true,
    },
  });
};

export const authConfig = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Не указаны данные для авторизации.");
        }

        const user = await db.query.users.findFirst({
          where: (users, { eq }) =>
            eq(users.email, credentials.email as string),
          columns: {
            id: true,
            name:true,
            image:true,
            email: true,
            password: true,
          },
        });

        if (!user) {
          throw new Error("Пользователь с таким E-mail не найден.");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user?.password ?? "",
        );

        if (!passwordMatch) {
          throw new Error("Неверный логин или пароль");
        }

        return (await GetUser(credentials.email as string)) ?? null;
      },
    }),
    EmailProvider({
      server: {
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT,
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASSWORD,
        },
      },
      from: env.EMAIL_USER,
      maxAge: 10 * 60,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: async ({ session }) => {
      const database_user = await GetUser(session.user.email);

      if (!database_user) {
        throw new Error("Такого пользователя не существует.");
      }

      if (
        database_user.email === env.MAIN_ADMIN_EMAIL &&
        database_user.role !== "ADMIN"
      ) {
        await db
          .update(users)
          .set({ role: "ADMIN" })
          .where(eq(users.email, env.MAIN_ADMIN_EMAIL));
      }

      return {
        ...session,
        user: database_user,
      };
    },
  },
  secret:env.AUTH_SECRET,
} satisfies NextAuthConfig;
