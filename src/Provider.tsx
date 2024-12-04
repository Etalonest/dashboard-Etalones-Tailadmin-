"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

type Props = {
  children?: React.ReactNode;
};

export const Provider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

// "use client";
// import React, { useEffect, useState } from "react";
// import { SessionProvider, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// type Props = {
//   children?: React.ReactNode;
// };

// const CheckManager = ({ children }) => {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [redirected, setRedirected] = useState(false);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     const checkIfManager = async () => {
//       if (session && !redirected) {
//         try {
//           const response = await fetch('/api/manager'); // Ваш API для проверки менеджера
//           if (!response.ok) throw new Error("Failed to fetch manager status");

//           const data = await response.json();
          
//           // Проверяем, является ли пользователь менеджером
//           if (!data.isManager) {
//             setRedirected(true); // Устанавливаем флаг, чтобы избежать повторного перенаправления
//             router.push("/dashboard/profile"); // Перенаправляем на главную или другую страницу
//           }
//         } catch (err) {
//           console.error("Error fetching manager status:", err);
//           setError(true); // Устанавливаем ошибку
//         }
//       }
//     };

//     checkIfManager();
//   }, [session, redirected, router]);

//   // Пока статус загрузки, можно показывать спиннер или что-то еще
//   if (status === "loading") return <p>Loading...</p>;

//   // Обработка ошибки
//   if (error) return <p>Error loading manager status. Please try again later.</p>;

//   return <>{children}</>;
// };

// export const Provider = ({ children }: Props) => {
//   return (
//     <SessionProvider>
//       <CheckManager>{children}</CheckManager>
//     </SessionProvider>
//   );
// };
