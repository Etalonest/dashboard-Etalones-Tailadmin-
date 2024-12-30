import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "./src/lib/db";
import User from "./src/models/User";
import Manager from "./src/models/Manager";
import Role from "./src/models/Role";  // Импортируем модель Role

const providers = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    // Этот колбэк выполняется при получении сессии
    async session({ session, token }) {
      // Проверяем наличие данных в токене и добавляем их в сессию
      if (token.managerId) {
        session.managerId = token.managerId;  // ID менеджера
      }
      if (token.managerRole) {
        session.managerRole = token.managerRole;  // Роль менеджера
      }
      if (token.role) {
        session.user.role = token.role;  // Роль пользователя
      }
      return session;
    },

    // Этот колбэк выполняется при попытке входа
    async signIn({ profile }) {
      try {
        await connectDB();

        // Ищем пользователя по email в базе данных User
        const userExist = await User.findOne({ email: profile.email });
        if (!userExist) {
          // Если пользователя нет, создаем нового
          await User.create({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
            role: 'user',  // Роль пользователя по умолчанию
          });
        }

        // Ищем среди менеджеров, есть ли такой email
        const manager = await Manager.findOne({ email: profile.email });

        if (manager) {
          // Если менеджер найден, сохраняем его ID и роль в токен
          return true;  // Разрешаем вход
        }

        // Если менеджер не найден, возвращаем false (не разрешаем вход)
        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    // Этот колбэк выполняется при генерации токена
    async jwt({ token, user }) {
      console.log("JWT Token before:", token);  // Выводим текущий токен в консоль
      if (user && user.email) {
        // Ищем менеджера по email пользователя
        const manager = await Manager.findOne({ email: user.email }).populate('role');  // Используем populate для роли
        if (manager) {
          // Проверяем, существует ли роль у менеджера
          if (manager.role && manager.role.name) {
            token.managerRole = manager.role.name.toString();  // Сохраняем роль менеджера
          } else {
            console.log("Manager role not found or incorrect structure");
          }

          token.managerId = manager._id.toString();  // Сохраняем ID менеджера
        }

        // Добавляем роль пользователя в токен
        if (user.role) {
          token.role = user.role;
        }
      }
      console.log("JWT Token after:", token);  // Проверяем изменения токена
      return token;
    },
  },
});
