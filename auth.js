
// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"
// import {connectDB} from "./src/lib/db"
// import User from "./src/models/User"

// const providers = [
//   Google({
//     clientId: process.env.AUTH_GOOGLE_ID,
//     clientSecret: process.env.AUTH_GOOGLE_SECRET,
//   })
// ]
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers,
//   callbacks: {
//    async session({ session}) {
//       return session
//     },
//     async signIn({profile}) {
// console.log(profile)
// try {
//   await connectDB()
//   const userExist = await User.findOne({email: profile.email})
//   if (!userExist) {
//     await User.create({
//       email: profile.email,
//       name: profile.name,
//       image: profile.picture,
//     })
//   }
// return true
// } catch (error) {
//   console.log(error)
//   return false
// }

//     },
   
//   },
// })
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "./src/lib/db";
import User from "./src/models/User";
import Manager from "./src/models/Manager"; // Импорт модели Manager для проверки

const providers = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  })
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    // Этот колбэк выполняется при создании сессии
    async session({ session, token }) {
      // Добавляем ID менеджера в сессию, если он был найден
      if (token.managerId) {
        session.managerId = token.managerId;
        
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
          });
        }

        // Ищем среди менеджеров, есть ли такой email
        const manager = await Manager.findOne({ email: profile.email });

        if (manager) {
          // Если менеджер найден, сохраняем его ID в токен
          return true;
        }

        // Если менеджер не найден, возвращаем false (не разрешаем вход)
        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    // В колбэке `jwt` можно добавлять дополнительные данные в токен
    async jwt({ token, user }) {
      // Если у пользователя есть менеджер, добавляем его ID в токен
      if (user && user.email) {
        const manager = await Manager.findOne({ email: user.email });
        if (manager) {
          token.managerId = manager._id.toString(); // Сохраняем ID менеджера в токен
        }
      }
      return token;
    },
  },
});
