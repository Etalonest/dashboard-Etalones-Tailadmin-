import ECommerce from "@/src/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
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
