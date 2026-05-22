import { PrismaClient } from "@prisma/client";

/**
 * Singleton Pattern — one PrismaClient per Node process.
 *
 * On Vercel/serverless, modules are cached across invocations. Without this
 * guard, hot-reload (dev) and warm-start (prod) can leak DB connections.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}