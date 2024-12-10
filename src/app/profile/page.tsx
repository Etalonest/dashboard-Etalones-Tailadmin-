// import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
// import ProfileComponent from "@/src/components/Profile/Profile";
// import { auth } from "@/auth"

// const Profile = async() => {
//   const session = await auth()
//   if (!session) 

//     return <div>Not authenticated</div>
//   return (
//     <DefaultLayout>
//      <ProfileComponent />
//     </DefaultLayout>
//   );
// };

// export default Profile;
// Используем серверный компонент для асинхронной логики
import { auth } from "@/auth";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import ProfileComponent from "@/src/components/Profile/Profile";
import { redirect } from 'next/navigation';

const Profile = async () => {
  const session = await auth();  // Получаем сессию на сервере

  if (!session) {
    redirect('/auth/signin');  // Перенаправляем на главную страницу, если нет сессии
  }

  return (
    <DefaultLayout>
      <ProfileComponent />
    </DefaultLayout>
  );
};

export default Profile;
