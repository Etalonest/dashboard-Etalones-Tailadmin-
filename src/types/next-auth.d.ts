// types/next-auth.d.ts (или просто next-auth.d.ts в корне проекта)

import { Session } from "next-auth";

// Расширяем тип Session, добавляя managerId
declare module "next-auth" {
  interface Session {
    managerId?: string; // Добавляем managerId как необязательное строковое поле
  }
}
