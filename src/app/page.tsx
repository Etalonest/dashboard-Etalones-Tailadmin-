import ECommerce from "@/src/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title:
    "Etalones S&B | Dashboard ",
  description: "Internal dashboard Etalones S&B",
};

export default async function Home () {
  const session = await auth();  // Получаем сессию на сервере

  if (!session) {
    redirect('/auth/signin');  // Перенаправляем на главную страницу, если нет сессии
  }
  return (
    <>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </>
  );
}
