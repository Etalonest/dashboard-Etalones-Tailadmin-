// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    picture?: string | null; // Указываем, что поле picture может быть строкой или null
  }
}
