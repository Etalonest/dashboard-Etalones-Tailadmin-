import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "./src/lib/db";
import User from "./src/models/User";
import Manager from "./src/models/Manager";

const providers = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  session: {
    strategy: "jwt", // Если используете JWT
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token", // Имя cookie для сессии
      options: {
        httpOnly: true, // Запрещает доступ к cookie через JavaScript
        secure: process.env.NODE_ENV === "production", // Использовать secure cookies только в production
        maxAge: 24 * 60 * 60, // Время жизни cookie (24 часа)
      },
    },
  },
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

        const userExist = await User.findOne({ email: profile.email });
        if (!userExist) {
          await User.create({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
            role: 'user',
            googleId: profile.id
          });
        }

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
      if (user && user.email) {
        // Ищем менеджера по email пользователя
        const manager = await Manager.findOne({ email: user.email }).populate('role');  
        if (manager) {
          // Проверяем, существует ли роль у менеджера
          if (manager.role && manager.role.name) {
            token.managerRole = manager.role.name.toString();  // Сохраняем роль менеджера
          } else {
            console.log("Manager role not found or incorrect structure");
          }

          token.managerId = manager._id.toString();  
          token.managerRole = manager.role.name.toString();  
        }

        // Добавляем роль пользователя в токен
        if (user.role) {
          token.role = user.role;
        }
      }
      return token;
    },
  },
});
